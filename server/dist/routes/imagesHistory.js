import express from "express";
import { dbPool } from "../config/database.js";
const route = express.Router();
route.get("/", async (req, res) => {
    const userId = req.header("X-User-Id");
    console.log(userId);
    if (!userId) {
        return res.status(401).json({ error: "Missing user id" });
    }
    const getMedia = "SELECT id, url, name, size, uploaded_at FROM media WHERE user_id=?";
    const [data] = await dbPool.execute(getMedia, [userId]);
    return res.send(data);
});
export default route;
//# sourceMappingURL=imagesHistory.js.map