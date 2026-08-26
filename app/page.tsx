import Link from "next/link";

export default function Home() {
  return <div className="py-24 text-center">
    <p className="mb-3 text-violet-400">SECURE LUA MANAGEMENT</p>
    <h1 className="text-5xl font-black">NeonVault</h1>
    <p className="mx-auto mt-5 max-w-xl text-zinc-400">Stockage chiffré, contrôle d'accès et gestion de clés pour tes scripts Lua.</p>
    <div className="mt-8 flex justify-center gap-3">
      <Link className="btn btn-primary" href="/register">Créer un compte</Link>
      <Link className="btn border border-zinc-700" href="/login">Connexion</Link>
    </div>
  </div>;
}
