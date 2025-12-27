import { LogoutButton } from "../logout-button";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <h1>{title}</h1>
      <LogoutButton />
    </header>
  );
}
