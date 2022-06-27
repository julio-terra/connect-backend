import mongoose from 'mongoose';

const URI = 'mongodb://localhost:27017/connect';

mongoose.set('debug', true);

mongoose
  .connect(URI)
  .then(() => console.log('db is up'))
  .catch((err) => console.log(err))