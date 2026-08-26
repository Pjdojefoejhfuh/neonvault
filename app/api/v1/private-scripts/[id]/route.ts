import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
  });

  if (!apiKey || apiKey.revokedAt) {
    return NextResponse.json(
      { error: "Invalid or revoked key" },
      { status: 401 }
    );
  }

  if (apiKey.expiresAt && apiKey.expiresAt <= new Date()) {
    return NextResponse.json(
      { error: "Key expired" },
      { status: 401 }
    );
  }

  const script = await prisma.script.findUnique({
    where: { id },
  });

  if (!script) {
    return NextResponse.json(
      { error: "Script not found" },
      { status: 404 }
    );
  }

  if (script.userId !== apiKey.userId) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const code = decrypt(
      script.encryptedCode,
      script.iv,
      script.authTag
    );

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    await prisma.accessLog.create({
      data: {
        userId: apiKey.userId,
        scriptId: script.id,
        apiKeyId: apiKey.id,
        action: "SCRIPT_ACCESS",
        ip: request.headers.get("x-forwarded-for"),
        userAgent: request.headers.get("user-agent"),
        status: "SUCCESS",
      },
    });

    return new NextResponse(code, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to decrypt script" },
      { status: 500 }
    );
  }
}