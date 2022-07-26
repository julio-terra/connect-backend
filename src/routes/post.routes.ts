import express from 'express';
import postController from '../controllers/postController';
import multer from 'multer';
import uploadConfig from '../config/multer';

const upload = multer(uploadConfig);

const Router = express.Router();

Router.post('/new', upload.single('file'), postController.new)
Router.delete('/delete/:id', postController.delete)
Router.get('/list/:user_id', postController.list)
Router.get('/post/:id', postController.post)

export default Router;