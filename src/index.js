const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const { engine } = require("express-handlebars");
const app = express()
const cors = require('cors')
const port = 3003
const db = require('./config/db')
const route = require('./routes/index')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const multer = require('multer')

dotenv.config();
// Connect to DB
db.connect()
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) 
app.use(morgan('combined'))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// app.engine(
//   "hbs",
//   engine({
//     extname: ".hbs",
//   })
// ); // Sử dụng 'engine()' thay vì 'handlebars()'
// app.set("view engine", "hbs");
// app.set("views", "src/resources/views");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname))
//   },
// })
// const upload = multer({ storage: storage })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
route(app)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

