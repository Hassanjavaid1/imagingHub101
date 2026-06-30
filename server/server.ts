import express from 'express';
import {testDBConnection} from './config/database.js';
import uploadImage from './routes/uploadImage.js'
import transformImage from './routes/transformImage.js'
import imagesHistory from './routes/imagesHistory.js'
import deleteImage from './routes/deleteImage.js'

const app = express()
const port = 3000

app.use("/", uploadImage)
app.use("/",transformImage)
app.use("/",imagesHistory)
app.use("/",deleteImage)

//testDBConnection();

app.listen(port, () => {
  console.log(`server running at: localhost:${port}`)
}) 