import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Settings() {
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const user = await db.user.findUnique({ where: { id: userId }});
  return <div className="max-w-2xl"><h1 className="text-3xl font-bold">Settings</h1>
    <div className="card mt-6 p-6"><p className="text-sm text-zinc-500">Account email</p><p className="mt-1">{user?.email}</p>
    <div className="mt-6 border-t border-zinc-800 pt-6"><p className="font-semibold">Security</p><p className="mt-2 text-sm text-zinc-500">Scripts are encrypted with AES-256-GCM at rest. API keys are stored as SHA-256 hashes.</p></div>
    </div>
  </div>;
}
