import crypto from "node:crypto";

function key() {
  const value = process.env.ENCRYPTION_KEY;
  if (!value || !/^[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error("ENCRYPTION_KEY must be exactly 64 hexadecimal characters");
  }
  return Buffer.from(value, "hex");
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64")
  };
}

export function decrypt(ciphertext: string, iv: string, authTag: string) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final()
  ]).toString("utf8");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
