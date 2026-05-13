import fs from "fs";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const __filename = fileURLToPath(import.meta.url);

// ------------------------------------------------------------------
// .gitignore pattern matching (simplified git semantics)
// ------------------------------------------------------------------
function parseGitignore(gitignorePath) {
  if (!fs.existsSync(gitignorePath)) return [];
  const content = fs.readFileSync(gitignorePath, "utf8");
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

function shouldIgnore(relativePath, patterns) {
  const normalized = relativePath.replace(/\\/g, "/");
  const isDir = normalized.endsWith("/"); // we pass directories with trailing slash

  for (const raw of patterns) {
    let pattern = raw;
    let anchorRoot = false;
    let dirOnly = false;

    // Trailing slash → directory only
    if (pattern.endsWith("/")) {
      dirOnly = true;
      pattern = pattern.slice(0, -1);
    }

    // Leading slash → anchored to root
    if (pattern.startsWith("/")) {
      anchorRoot = true;
      pattern = pattern.slice(1);
    }

    // Build regex from pattern
    let regexStr = "";
    for (let i = 0; i < pattern.length; i++) {
      const ch = pattern[i];
      if (ch === "*") {
        // ** → match zero or more directories
        if (pattern[i + 1] === "*") {
          regexStr += ".*";
          i++; // skip second *
        } else {
          regexStr += "[^/]*"; // single * does not match /
        }
      } else if (ch === "?") {
        regexStr += "[^/]";
      } else if (
        ch === "." ||
        ch === "+" ||
        ch === "^" ||
        ch === "$" ||
        ch === "(" ||
        ch === ")" ||
        ch === "{" ||
        ch === "}" ||
        ch === "|"
      ) {
        regexStr += "\\" + ch;
      } else {
        regexStr += ch;
      }
    }

    // Anchoring
    if (anchorRoot) {
      // Must match from the beginning of the path
      regexStr = "^" + regexStr;
    } else {
      // Match anywhere in the path (full path segment)
      regexStr = "(^|/)" + regexStr;
    }

    if (dirOnly) {
      // Must be a directory: pattern ends, or followed by /
      regexStr += "($|/)";
    } else {
      // Can be a file or directory: pattern matches and is followed by / or end
      regexStr += "($|/)";
    }

    const regex = new RegExp(regexStr);
    if (regex.test(normalized)) {
      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------------
// Scope filtering (keep only files inside given top‑level directories)
// ------------------------------------------------------------------
function isInScope(relativePath, scopes) {
  if (!scopes || scopes.length === 0) return true;
  const normalized = relativePath.replace(/\\/g, "/");
  return scopes.some(
    (scope) => normalized === scope || normalized.startsWith(scope + "/"),
  );
}

// ------------------------------------------------------------------
// Recursive file listing
// ------------------------------------------------------------------
async function getAllFiles(
  dirPath,
  patterns,
  rootPath,
  scopes,
  filesList = [],
) {
  try {
    const entries = await readdir(dirPath);

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      let relPath = path.relative(rootPath, fullPath).replace(/\\/g, "/");

      // Check if the entry itself should be ignored (directory or file)
      if (shouldIgnore(relPath, patterns)) continue;

      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // For recursion, we pass the directory path (not with trailing slash)
        // but the shouldIgnore call above already handles directory patterns.
        await getAllFiles(fullPath, patterns, rootPath, scopes, filesList);
      } else if (stats.isFile()) {
        // Apply scope filter (only after ignoring)
        if (!isInScope(relPath, scopes)) continue;

        // Extension whitelist (React focused)
        const ext = path.extname(entry).toLowerCase();
        const includeExtensions = [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".scss",
          ".sass",
          ".less",
          ".html",
          ".txt",
          ".env.example",
          ".json",
          ".css",
          ".yaml",
          ".sh",
        ];
        if (!ext || includeExtensions.includes(ext)) {
          filesList.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
  return filesList;
}

// ------------------------------------------------------------------
// Read file content (text or binary info)
// ------------------------------------------------------------------
async function readFileContent(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const binaryExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".svg",
  ];

  if (binaryExtensions.includes(ext)) {
    const stats = await stat(filePath);
    return { type: "binary", size: stats.size, extension: ext, content: null };
  }

  try {
    const content = await readFile(filePath, "utf8");
    return { type: "text", size: content.length, extension: ext, content };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return { type: "error", error: error.message, content: null };
  }
}

// ------------------------------------------------------------------
// Main export function
// ------------------------------------------------------------------
async function exportProjectFiles(projectPath, outputPath, options = {}) {
  const { scopes = [], plain = false } = options;

  console.log("Starting project files export...");
  console.log(`Project path: ${projectPath}`);

  if (!fs.existsSync(projectPath)) {
    console.error(`Error: Path ${projectPath} does not exist.`);
    return;
  }

  // Load .gitignore patterns
  const gitignorePath = path.join(projectPath, ".gitignore");
  const patterns = parseGitignore(gitignorePath);
  console.log(`Loaded ${patterns.length} patterns from .gitignore`);

  // Always ignore the .git folder (even if not in .gitignore)
  patterns.push(".git");
  patterns.push("pnpm-lock.yaml");
  patterns.push("exports");

  // Also ignore the export script and the output file (if inside project)
  const selfRel = path.relative(projectPath, __filename).replace(/\\/g, "/");
  patterns.push(selfRel); // ignore this script
  if (outputPath.startsWith(projectPath)) {
    const outRel = path.relative(projectPath, outputPath).replace(/\\/g, "/");
    patterns.push(outRel); // ignore the output file itself
  }

  if (scopes.length) console.log(`Scope limited to: ${scopes.join(", ")}`);

  // Scan
  console.log("Scanning files...");
  const allFiles = await getAllFiles(
    projectPath,
    patterns,
    projectPath,
    scopes,
  );
  console.log(`Found ${allFiles.length} files to process`);

  // Process each file
  const filesData = {};
  let processedCount = 0;
  const total = allFiles.length;

  // Handle Ctrl+C gracefully
  process.on("SIGINT", () => {
    console.log("\n\nExport cancelled by user.");
    process.exit(0);
  });

  for (const filePath of allFiles) {
    const relPath = path.relative(projectPath, filePath);
    console.log(`Processing: ${relPath} (${++processedCount}/${total})`);
    filesData[relPath] = await readFileContent(filePath);
  }

  // Build output
  if (plain) {
    const plainOutput = {};
    for (const [rp, info] of Object.entries(filesData)) {
      plainOutput[rp] = info.type === "text" ? info.content : `[${info.type}]`;
    }
    const jsonString = JSON.stringify(plainOutput, null, 2);
    await writeFile(outputPath, jsonString, "utf8");
    console.log(`\n✅ Plain export saved to: ${outputPath}`);
    console.log(`   Files: ${Object.keys(plainOutput).length}`);
    return;
  }

  // Full metadata envelope
  const output = {
    metadata: {
      projectPath,
      exportDate: new Date().toISOString(),
      totalFiles: allFiles.length,
      ignorePatterns: patterns,
      scopes: scopes.length ? scopes : null,
      fileTypes: {
        text: Object.values(filesData).filter((f) => f.type === "text").length,
        binary: Object.values(filesData).filter((f) => f.type === "binary")
          .length,
        error: Object.values(filesData).filter((f) => f.type === "error")
          .length,
      },
    },
    files: filesData,
  };

  const jsonString = JSON.stringify(output, null, 2);
  await writeFile(outputPath, jsonString, "utf8");
  console.log(`\n✅ Export saved to: ${outputPath}`);
  console.log(`📊 Statistics:`);
  console.log(`   - Total files: ${output.metadata.totalFiles}`);
  console.log(`   - Text files: ${output.metadata.fileTypes.text}`);
  console.log(`   - Binary files: ${output.metadata.fileTypes.binary}`);
  console.log(`   - Errors: ${output.metadata.fileTypes.error}`);
  console.log(
    `   - File size: ${(jsonString.length / 1024 / 1024).toFixed(2)} MB`,
  );
}

// ------------------------------------------------------------------
// CLI interface
// ------------------------------------------------------------------
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  const positional = [];
  let scopes = [];
  let plain = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--scope") {
      // collect all following non-option arguments as scope values
      const scopeValues = [];
      while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        i++;
        scopeValues.push(args[i]);
      }
      // join them (they might be space-separated) and split by commas
      scopes = scopeValues
        .join(",")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg === "--plain") {
      plain = true;
    } else {
      positional.push(arg);
    }
  }

  let projectPath = process.cwd();
  let outputPath = "scripts/project-files-export.json";
  if (positional[0]) projectPath = path.resolve(positional[0]);
  if (positional[1]) outputPath = positional[1];

  exportProjectFiles(projectPath, outputPath, { scopes, plain });
}

export { exportProjectFiles, parseGitignore, shouldIgnore, isInScope };
