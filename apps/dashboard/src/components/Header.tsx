import React from "react";

interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

export default function Header({ title, action }: HeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
