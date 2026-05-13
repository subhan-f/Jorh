import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Button } from "@repo/ui/components/button";
import { highlightBash, highlightJs, highlightJson } from "~/lib/utils";

type Lang = "bash" | "javascript" | "json";

interface Tab {
  label: string;
  lang: Lang;
  code: string;
}

interface CodeBlockProps {
  tabs?: Tab[];
  code?: string;
  lang?: Lang;
  filename?: string;
}

function highlight(code: string, lang: Lang): string {
  if (lang === "json") return highlightJson(code);
  if (lang === "bash") return highlightBash(code);
  if (lang === "javascript") return highlightJs(code);
  return code;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copy}
      aria-label="Copy code"
    >
      {copied ? (
        <Check size={13} className="text-emerald-400" />
      ) : (
        <Copy size={13} />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function CodeBlock({ tabs, code, lang = "bash", filename }: CodeBlockProps) {
  const items: Tab[] = tabs ?? [{ label: lang, lang, code: code ?? "" }];
  const [activeTab, setActiveTab] = useState(items[0]!.label);
  const current = items.find((t) => t.label === activeTab) ?? items[0]!;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/50 px-4 py-2">
        {items.length > 1 ? (
          <Tabs>
            <TabsList>
              {items.map((t) => (
                <TabsTrigger
                  key={t.label}
                  value={t.label}
                  activeValue={activeTab}
                  onClick={() => setActiveTab(t.label)}
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <span className="text-xs text-slate-400 font-mono">{filename ?? items[0]!.label}</span>
        )}
        <CopyButton text={current.code} />
      </div>

      <pre className="overflow-x-auto p-5 text-sm leading-relaxed font-mono">
        <code
          className="text-slate-300"
          dangerouslySetInnerHTML={{ __html: highlight(current.code, current.lang) }}
        />
      </pre>
    </div>
  );
}
