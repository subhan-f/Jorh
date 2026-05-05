import { Link2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex size-7 items-center justify-center rounded-md">
            <Link2 className="text-primary-foreground size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Jorh</span>
        </div>
        <span className="text-muted-foreground text-sm hidden sm:block">
          جوڑ — Every link, beautifully managed.
        </span>
      </div>
      <Separator />
    </header>
  );
}
