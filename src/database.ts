import mongoose from 'mongoose';

const URI = `mongodb+srv://julio:FlR2a08V4nwrQ2V0@cluster0.ei3ejos.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('debug', true);

mongoose
.connect(URI)
  .then(() => console.log('db is up'))
  .catch((err) => console.log(err))