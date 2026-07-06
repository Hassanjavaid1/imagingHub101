import express from 'express';
import {testDBConnection} from './config/database.js';
import uploadImage from './routes/uploadImage.js'
import transformImage from './routes/transformImage.js'
import imagesHistory from './routes/imagesHistory.js'
import deleteImage from './routes/deleteImage.js'
import cors from 'cors'
//import cookieParser from "cookie-parser";

const app = express()
//app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
   // credentials:true,
}));

const port = 3000

app.use("/", uploadImage)
app.use("/",transformImage)
app.use("/",imagesHistory)
app.use("/",deleteImage)

//testDBConnection();

app.listen(port, () => {
  console.log(`server running at: localhost:${port}`)
}) 