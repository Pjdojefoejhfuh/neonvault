import "./globals.css";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="border-b border-zinc-900 bg-[#08080c]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-bold text-xl">Neon<span className="text-violet-500">Vault</span></Link>
            <nav className="flex gap-5 text-sm text-zinc-400">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/scripts">Scripts</Link>
              <Link href="/keys">API Keys</Link>
              <Link href="/logs">Logs</Link>
              <Link href="/settings">Settings</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
