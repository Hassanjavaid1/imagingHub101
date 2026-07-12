import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.HOST ||
  !process.env.USER ||
  !process.env.PASSWORD ||
  !process.env.DATABASE ||
  !process.env.DB_PORT
) {
  throw new Error("Missing DB environment variables");
}

export const dbPool = mysql2.createPool({
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 20,
});

export async function testDBConnection() {
  try {
    let connection = await dbPool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error(error);
  }
}
