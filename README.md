# 🎓 Student Profile Blockchain System

## 📌 Project Description
This project stores student profile data in blockchain block format.

Instead of storing normal database fields, data is:
- Compressed
- Encrypted
- Stored as hash inside blocks

## 🔗 Block Structure

Each student record is stored like:

{
  blockId: 1,
  previousHash: "GENESIS",
  hash: "encrypted student data"
}

## ⚙️ Tech Stack
- Node.js
- Express
- MongoDB
- Multer (image upload)
- Crypto (hash encryption)

## 🚀 Features
- Student profile creation
- Image upload
- Data encryption into hash
- Blockchain linking system

## 👨‍💻 Authors
Latikesh Marathe
Durgesh Upasani
