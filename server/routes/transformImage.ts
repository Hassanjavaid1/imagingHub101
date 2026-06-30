import express from "express";
import sharp from "sharp";

const route = express.Router();

route.get("/transform/:filename", async (req, res) => {
  const { filename } = req.params;
  const { w, h, q, f } = req.query;

  // filename
  if (!filename)
    return res.status(400).json({ error: "No file name provided" });

  //CF URL
  const r2Url = `https://pub-59656db884864fe3b1e24c5aff7daf97.r2.dev/${filename}`;

  // width
  const width = parseInt(w as string);
  if (w && (isNaN(width) || width < 1 || width > 5000))
    return res
      .status(400)
      .json({ error: "width must be a number between 1 and 5000" });

  // height
  const height = parseInt(h as string);
  if (h && (isNaN(height) || height < 1 || height > 5000))
    return res
      .status(400)
      .json({ error: "height must be a number between 1 and 5000" });

  // quality
  const quality = parseInt(q as string) || 80; // default 80
  if (isNaN(quality) || quality < 1 || quality > 100)
    return res
      .status(400)
      .json({ error: "quality must be a number between 1 and 100" });

  // format
  const allowedFormats = ["webp", "jpeg", "png", "avif", "tiff", "gif"];
  const format = (f as string) || "webp"; // default webp
  if (!allowedFormats.includes(format))
    return res
      .status(400)
      .json({ error: "format must be webp, jpeg, png, tiff, gif or avif" });

  // Fetch Cloudfalre

  const response = await fetch(r2Url);
  const buffer = Buffer.from(await response.arrayBuffer());
  // console.log(response)
  console.log(buffer);

  // transform with sharp
  const transformed = await sharp(buffer)
    .resize(width || null, height || null)
    .toFormat(format as any, { quality })
    .toBuffer();

  res.setHeader("Content-Type", `image/${format}`);
  return res.send(transformed);
});

export default route;
