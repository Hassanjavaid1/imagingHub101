import express from 'express';
import {testDBConnection} from './config/database.js';
import uploadImage from './routes/uploadImage.js'
import transformImage from './routes/transformImage.js'
import imagesHistory from './routes/imagesHistory.js'
import deleteImage from './routes/deleteImage.js'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: 'https://linkify-shortener.vercel.app',
   // credentials:true,
}));

const PORT = process.env.PORT || 3000;

app.use("/", uploadImage)
app.use("/",transformImage)
app.use("/",imagesHistory)
app.use("/",deleteImage)

testDBConnection();

app.listen(PORT, () => {
  console.log(`server running at: localhost:${PORT}`)
}) 