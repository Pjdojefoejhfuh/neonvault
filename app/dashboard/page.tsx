import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const [scripts, keys, logs] = await Promise.all([
    db.script.count({ where: { userId } }),
    db.apiKey.count({ where: { userId, revokedAt: null } }),
    db.accessLog.count({ where: { userId } })
  ]);
  return <div>
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <div className="mt-7 grid gap-4 md:grid-cols-3">
      {[["Scripts", scripts], ["Active API keys", keys], ["Logs", logs]].map(([a,b]) =>
        <div className="card p-6" key={String(a)}><p className="text-zinc-400">{a}</p><p className="mt-2 text-3xl font-bold">{b}</p></div>
      )}
    </div>
  </div>;
}
