import express from 'express';
import multer from 'multer';
import CommentController from '../controllers/commentsController';
import uploadConfig from '../config/multer';

const upload = multer(uploadConfig);
const Router = express.Router();

Router.post('/new', upload.single('file'), CommentController.new);
Router.get('/list/:post_id', CommentController.list);
Router.get('/comment/:id', CommentController.comment);


export default Router;