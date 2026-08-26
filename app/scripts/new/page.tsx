import { getUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { obfuscateLua } from "@/lib/obfuscator";
import { redirect } from "next/navigation";

async function createScript(form: FormData) {
  "use server";
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const name = String(form.get("name") || "Untitled");
  const description = String(form.get("description") || "");
  const code = String(form.get("code") || "");
  const level = String(form.get("obfuscation") || "basic") as "basic"|"medium";
  const protectedCode = obfuscateLua(code, level);
  const encrypted = encrypt(protectedCode);
  const script = await db.script.create({
    data: { userId, name, description, obfuscation: level, encryptedCode: encrypted.ciphertext, iv: encrypted.iv, authTag: encrypted.authTag }
  });
  redirect("/scripts/" + script.id);
}

export default function NewScript() {
  return <div className="mx-auto max-w-4xl">
    <h1 className="text-3xl font-bold">New script</h1>
    <form action={createScript} className="mt-6 space-y-4">
      <input className="input" name="name" placeholder="Script name" required />
      <input className="input" name="description" placeholder="Description" />
      <select className="input" name="obfuscation" defaultValue="basic"><option value="basic">Basic</option><option value="medium">Medium</option></select>
      <textarea className="input min-h-[420px] font-mono" name="code" placeholder="-- Lua code" required />
      <button className="btn btn-primary">Save encrypted script</button>
    </form>
  </div>;
}
