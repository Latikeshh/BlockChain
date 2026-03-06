const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const key = crypto
.createHash("sha256")
.update(process.env.SECRET_KEY)
.digest();

function encryptData(data){

const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(
algorithm,
key,
iv
);

let encrypted = cipher.update(
JSON.stringify(data),
"utf8",
"hex"
);

encrypted += cipher.final("hex");

return iv.toString("hex") + encrypted;

}

function decryptData(data){

const iv = Buffer.from(data.substring(0,32),"hex");

const encryptedText = data.substring(32);

const decipher = crypto.createDecipheriv(
algorithm,
key,
iv
);

let decrypted = decipher.update(
encryptedText,
"hex",
"utf8"
);

decrypted += decipher.final("utf8");

return JSON.parse(decrypted);

}

module.exports = {encryptData,decryptData};