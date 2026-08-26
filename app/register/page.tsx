import Link from "next/link";
import { register } from "../server-actions";

export default function Register() {
  return <div className="mx-auto max-w-md card p-7">
    <h1 className="text-2xl font-bold">Créer un compte</h1>
    <form action={register} className="mt-6 space-y-4">
      <input className="input" name="email" type="email" placeholder="Email" required />
      <input className="input" name="password" type="password" placeholder="Mot de passe (12+ caractères)" minLength={12} required />
      <button className="btn btn-primary w-full">Créer le compte</button>
    </form>
    <p className="mt-5 text-sm text-zinc-400">Déjà inscrit ? <Link className="text-violet-400" href="/login">Connexion</Link></p>
  </div>;
}
