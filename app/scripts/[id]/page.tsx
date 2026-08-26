import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { redirect, notFound } from "next/navigation";

export default async function ScriptPage({ params }: { params: Promise<{id:string}> }) {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const { id } = await params;
  const script = await db.script.findFirst({ where: { id, userId }});
  if (!script) notFound();
  const code = decrypt(script.encryptedCode, script.iv, script.authTag);
  return <div>
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">{script.name}</h1><p className="text-zinc-500">{script.description}</p></div><span className="text-sm text-violet-400">{script.obfuscation}</span></div>
    <pre className="card mt-6 overflow-auto p-5 text-sm text-zinc-300"><code>{code}</code></pre>
  </div>;
}
