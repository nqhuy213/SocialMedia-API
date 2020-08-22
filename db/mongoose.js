const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})


mongoose.connection.on('error', err => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

mongoose.connection.once('open', async () => {
  console.log('%s MongoDB connected.', chalk.green('✓'))
})
