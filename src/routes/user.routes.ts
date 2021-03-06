import express from 'express';
import UserController from '../controllers/userController';
import multer from 'multer';
import uploadConfig from '../config/multer';

const upload = multer(uploadConfig);

const Router = express.Router();

Router.post('/register', UserController.register);
Router.post('/session', UserController.session);
Router.put('/updateImage/:id', upload.single('file'), UserController.updateImage);
Router.put('/updateBody/:id', UserController.updateBody);
Router.put('/follow/:id', UserController.follow);
Router.put('/unfollow/:id', UserController.unfollow);
Router.get('/', UserController.users);
Router.get('/user/:id', UserController.user);
Router.get('/posts/:id', UserController.posts)

export default Router;