const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/WEB_THUE_NHA', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('connect successfully')
  } catch (error) {
    console.log('connect failure')
  }
}
module.exports = { connect }
