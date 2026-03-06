const crypto = require("crypto");

const algorithm = "aes-256-cbc";
// Fallback to a default key if SECRET_KEY is not set
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.SECRET_KEY || "default_secret_key_for_development")
  .digest()
  .slice(0, 32);

const iv = Buffer.alloc(16, 0);

function encryptProfile(data) {
  const jsonData = JSON.stringify(data);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(jsonData, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

function decryptProfile(hash) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(hash, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}

module.exports = { encryptProfile, decryptProfile };