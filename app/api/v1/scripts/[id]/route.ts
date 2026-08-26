import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { decrypt } from "@/lib/crypto";

export async function GET(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const key = await db.apiKey.findUnique({ where: { keyHash: sha256(token) }});
  if (!key || key.revokedAt || (key.expiresAt && key.expiresAt <= new Date()))
    return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });

  const { id } = await params;
  const script = await db.script.findFirst({ where: { id, userId: key.userId }});
  if (!script) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.apiKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() }});
  await db.accessLog.create({ data: { userId: key.userId, scriptId: script.id, apiKeyId: key.id, action: "script.read", status: "success", ip: req.headers.get("x-forwarded-for") || undefined, userAgent: req.headers.get("user-agent") || undefined }});

  return NextResponse.json({
    id: script.id,
    name: script.name,
    version: script.version,
    code: decrypt(script.encryptedCode, script.iv, script.authTag)
  });
}
