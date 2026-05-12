import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer>
      <Separator />
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Jorh. All rights reserved.
        </span>
        <span className="text-muted-foreground text-xs">jorh.net</span>
      </div>
    </footer>
  );
}
