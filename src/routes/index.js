const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')
const paymentRouter = require('./payment')
function route(app) {
  app.use('/payment',paymentRouter)
  app.use('/auth', authRouter)
  app.use('/user', userRouter)
  app.use('/post', postRouter)
}
module.exports = route
