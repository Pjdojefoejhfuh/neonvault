// Conservative, non-destructive Lua transformation.
// This is not cryptographic protection. Keep real access control server-side.
export function obfuscateLua(source: string, level: "basic" | "medium" = "basic") {
  let code = source.replace(/\r\n/g, "\n");

  if (level === "basic") {
    code = code
      .split("\n")
      .filter(line => !/^\s*--/.test(line))
      .join("\n");
    return `-- NeonVault protected build\n${code}`;
  }

  // Medium removes comments and normalizes whitespace without attempting
  // dangerous parser tricks or changing program semantics.
  code = code
    .split("\n")
    .filter(line => !/^\s*--/.test(line))
    .map(line => line.replace(/\\s+$/g, ""))
    .join("\n");

  return `-- NeonVault protected build\n${code}`;
}
