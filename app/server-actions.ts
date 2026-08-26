 "use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, clearSession } from "@/lib/auth";
import { sha256, randomToken } from "@/lib/crypto";

async function hashPassword(password: string) {
  const { scrypt } = await import("node:crypto");
  return new Promise<string>((resolve, reject) => {
    scrypt(password, "neonvault", 64, (err, derived) => {
      if (err) reject(err);
      else resolve(derived.toString("hex"));
    });
  });
}

export async function register(form: FormData) {
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  if (!email || password.length < 12) throw new Error("Invalid registration");

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already registered");

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({ data: { email, passwordHash } });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(form: FormData) {
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const candidate = await hashPassword(password);
  if (candidate !== user.passwordHash) throw new Error("Invalid credentials");

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}

export async function createApiKey(form: FormData) {
  const { getUserId } = await import("@/lib/auth");
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const name = String(form.get("name") || "API key");
  const expires = String(form.get("expiresAt") || "");
  const token = "nv_" + randomToken(32);

  await db.apiKey.create({
    data: {
      userId,
      name,
      keyHash: sha256(token),
      keyPrefix: token.slice(0, 10),
      expiresAt: expires ? new Date(expires) : null
    }
  });

  // In production, display this token once in a dedicated page/modal.
  redirect("/keys?created=" + encodeURIComponent(token));
}

export async function revokeApiKey(form: FormData) {
  const { getUserId } = await import("@/lib/auth");
  const userId = await getUserId();
  if (!userId) redirect("/login");
  const id = String(form.get("id") || "");
  await db.apiKey.updateMany({
    where: { id, userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
  redirect("/keys");
}
