import { dbPool } from "./database.js";

// Database Creation

    let createDB:string = "CREATE DATABASE ImagingHub"


// Table Creation
    let createTable:string = "CREATE TABLE media(id INT PRIMARY KEY AUTO_INCREMENT,url VARCHAR(300),name VARCHAR(300),size VARCHAR(100),uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
