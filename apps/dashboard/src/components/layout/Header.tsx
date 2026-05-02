interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-card px-6">
      <div>
        <h1 className="text-base font-semibold leading-none">{title}</h1>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </header>
  );
}
