import express from "express";
import { dbPool } from "../config/database.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./uploadImage.js";

const route = express.Router();

route.delete("/delete", async (req, res) => {
  const id = req.query.id;

  if (!id) return res.status(400).json({ error: "No id provided" });

  console.log(id);

  // Save URL before deleting row
  const [row]: any = await dbPool.query("SELECT url FROM media WHERE id=?", [
    id,
  ]);
  let url = row[0].url;
  console.log(url);

  const filename = url.split("/").pop(); 
  console.log(filename);

  await r2.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
  }));

  // Delete  Database Row

  await dbPool.query("DELETE FROM media WHERE id=?", [id]);

  // Delete from Cloudflare

  return res.send(url);
});

export default route;
