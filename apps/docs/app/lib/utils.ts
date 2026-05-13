export { cn } from "@repo/ui/lib/utils";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export function methodVariant(method: HttpMethod) {
  return method.toLowerCase() as "get" | "post" | "patch" | "delete" | "put";
}

export function highlightJson(raw: string): string {
  return raw
    .replace(/("[\w\s-]+")\s*:/g, '<span class="text-violet-300">$1</span>:')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="text-emerald-300">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="text-amber-300">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="text-red-400">$1</span>')
    .replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="text-sky-300">$1</span>');
}

export function highlightBash(raw: string): string {
  return raw
    // Flags must run first (pure text) — after curl wrapping, "-" appears inside span
    // class names like "text-yellow-300" and would be falsely matched
    .replace(/(--\w[\w-]*|-[A-Za-z])/g, '<span class="text-blue-300">$1</span>')
    .replace(/^(curl)/gm, '<span class="text-yellow-300">curl</span>')
    // URL before strings — URL becomes inner span so it wins the color over the
    // surrounding single-quoted string (sky-blue URL inside emerald quotes looks correct)
    .replace(/(https?:\/\/[^\s\\']+)/g, '<span class="text-sky-300">$1</span>')
    .replace(/('[^']*')/g, '<span class="text-emerald-300">$1</span>')
    .replace(/(\\)$/gm, '<span class="text-slate-400">\\</span>');
}

export function highlightJs(raw: string): string {
  return raw
    .replace(/\b(const|let|await|async|function|return|import|from|export|default|new)\b/g, '<span class="text-violet-300">$1</span>')
    .replace(/('[\w\-/:@. ]*'|"[\w\-/:@. ]*")/g, '<span class="text-emerald-300">$1</span>')
    .replace(/\b(fetch|console|JSON|Promise|Response|Headers)\b/g, '<span class="text-yellow-300">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="text-slate-400">$1</span>');
}
