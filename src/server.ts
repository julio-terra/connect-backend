import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import * as dotenv from "dotenv";

import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';

import './database';

dotenv.config();

const PORT = 8000

const app = express();

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());

app.use('/users', userRoutes)
app.use('/posts', postRoutes)


app.listen(PORT, () => {console.log('server running')})