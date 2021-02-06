require('dotenv').config()

/** Database connection **/
require('./db/mongoose')

/** Routes */
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const uploadRoute = require('./routes/upload')
const profileRoute = require('./routes/profile')

/** Middlewares */
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const errorHandler = require('./middleware/error-handler')
const initSocket = require('./socket/socket-fix')
const app = express()

app.use(express.static (`uploads`))
app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

/** Setup Routes */
app.use('/auth', authRoute)
app.use('/post', postRoute)
app.use('/upload', uploadRoute)
app.use('/profile', profileRoute)

/** Undefined Routes */
app.use(function(req, res, next) {
  res.status(404);
  res.json({error: true, message:"Not Found"});
  next();
 });

app.use(errorHandler)

var server = app.listen(process.env.PORT, () => {
  console.log('API is running at http://localhost:%d',
  process.env.PORT
  )
})

initSocket(server)
// socket.init(server)

module.exports = app