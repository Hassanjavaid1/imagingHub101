import express from "express";
import { dbPool } from "../config/database.js";

const route = express.Router();

route.get("/", async (req, res) => {
  
  const getMedia: string = "SELECT id, url, name, size, uploaded_at FROM media";
  
  const [data] = await dbPool.execute(getMedia);
  return res.send(data);
});

export default route;
