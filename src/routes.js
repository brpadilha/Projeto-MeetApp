import { Router } from 'express';

import authMiddleare from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import multerConfig from './config/multer';
import multer from 'multer';

const routes = new Router();
const update = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleare);

routes.put('/users', UserController.update);
routes.post('/files', update.single('file'), FileController.store);

export default routes;
