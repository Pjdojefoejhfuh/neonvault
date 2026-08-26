import Link from "next/link";
import { login } from "../server-actions";

export default function Login() {
  return <div className="mx-auto max-w-md card p-7">
    <h1 className="text-2xl font-bold">Connexion</h1>
    <form action={login} className="mt-6 space-y-4">
      <input className="input" name="email" type="email" placeholder="Email" required />
      <input className="input" name="password" type="password" placeholder="Mot de passe" required />
      <button className="btn btn-primary w-full">Se connecter</button>
    </form>
    <p className="mt-5 text-sm text-zinc-400">Pas de compte ? <Link className="text-violet-400" href="/register">Créer un compte</Link></p>
  </div>;
}
