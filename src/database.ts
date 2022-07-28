import mongoose from 'mongoose';

const URI = 'myuri';

mongoose.set('debug', true);

mongoose
.connect(URI)
  .then(() => console.log('db is up'))
  .catch((err) => console.log(err))
