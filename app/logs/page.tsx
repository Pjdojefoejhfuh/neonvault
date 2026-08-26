import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Logs() {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const logs = await db.accessLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100, include: { script: true }});
  return <div><h1 className="text-3xl font-bold">Logs</h1><div className="mt-6 overflow-x-auto card">
    <table className="w-full text-left text-sm"><thead><tr className="border-b border-zinc-800"><th className="p-4">Date</th><th>Action</th><th>Script</th><th>Status</th><th>IP</th></tr></thead>
    <tbody>{logs.map(l=><tr className="border-b border-zinc-900" key={l.id}><td className="p-4">{l.createdAt.toISOString()}</td><td>{l.action}</td><td>{l.script?.name || "-"}</td><td>{l.status}</td><td>{l.ip || "-"}</td></tr>)}</tbody></table>
  </div></div>;
}
