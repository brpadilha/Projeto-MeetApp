import { Router } from 'express';

import authMiddleare from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import PhotoController from './app/controllers/PhotoController';
import ArchiveController from './app/controllers/ArchiveController';
import multerConfig from './config/multer';
import multer from 'multer';
import MeetupController from './app/controllers/MeetupController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const update = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleare);

routes.put('/users', UserController.update);
routes.post('/files', update.single('file'), PhotoController.store);

routes.post('/arquives', update.single('file'), ArchiveController.store);

routes.get('/providers', ProviderController.index);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications', NotificationController.update);

export default routes;
