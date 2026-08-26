import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Scripts() {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const scripts = await db.script.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }});
  return <div>
    <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Scripts</h1><Link href="/scripts/new" className="btn btn-primary">+ New script</Link></div>
    <div className="mt-6 space-y-3">{scripts.map(s =>
      <Link href={"/scripts/" + s.id} key={s.id} className="card block p-5 hover:border-violet-700">
        <div className="flex justify-between"><b>{s.name}</b><span className="text-xs text-zinc-500">{s.obfuscation}</span></div>
        <p className="mt-2 text-sm text-zinc-500">{s.description || "No description"}</p>
      </Link>
    )}</div>
  </div>;
}
