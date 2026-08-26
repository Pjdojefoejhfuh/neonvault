import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { createApiKey, revokeApiKey } from "../server-actions";

export default async function Keys({ searchParams }: { searchParams: Promise<{created?:string}> }) {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const keys = await db.apiKey.findMany({ where: { userId }, orderBy: { createdAt: "desc" }});
  const created = (await searchParams).created;
  return <div>
    <h1 className="text-3xl font-bold">API Keys</h1>
    {created && <div className="card mt-5 border-violet-800 p-4"><p className="text-sm text-zinc-400">Copy this key now. It is not stored in plaintext and won't be shown again.</p><code className="mt-2 block break-all text-violet-300">{created}</code></div>}
    <form action={createApiKey} className="card mt-6 grid gap-3 p-5 md:grid-cols-3">
      <input className="input" name="name" placeholder="Key name" required />
      <input className="input" name="expiresAt" type="datetime-local" />
      <button className="btn btn-primary">Generate key</button>
    </form>
    <div className="mt-6 space-y-3">{keys.map(k =>
      <div className="card flex items-center justify-between p-5" key={k.id}>
        <div><b>{k.name}</b><p className="text-xs text-zinc-500">{k.keyPrefix}•••• · {k.expiresAt ? "expires " + k.expiresAt.toISOString() : "no expiration"} · {k.revokedAt ? "REVOKED" : "ACTIVE"}</p></div>
        {!k.revokedAt && <form action={revokeApiKey}><input type="hidden" name="id" value={k.id}/><button className="text-sm text-red-400">Revoke</button></form>}
      </div>
    )}</div>
  </div>;
}
