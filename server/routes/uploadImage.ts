import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { dbPool } from "../config/database.js";

const route = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

// ------------------------------------------------------------------------------

route.post("/", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ error: "No Image provided" });

    const ext = image.mimetype.split("/")[1];
    const imageName = `${Date.now()}.${ext}`;
    const url = `https://pub-59656db884864fe3b1e24c5aff7daf97.r2.dev/${imageName}`;

    // Size conversion
    let bytes: number = image.size;
    let convert: number = bytes / 1000000;
    let size: number = Number(Math.round(Number(`${convert}e1`)) + "e-1");

    
    // Save to Cloudeflare

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: imageName,
        Body: image.buffer,
        ContentType: image.mimetype,
      }),
    );

    //Save to Database

    await dbPool.execute("INSERT INTO media(url,name,size) VALUES (?,?,?)", [
      url,
      imageName,
      size,
    ]);

    return res.json(url);
  } catch (error) {
    console.log("R2 Error:", error);
    return res.status(500).json({ error });
  }
});

export default route;
