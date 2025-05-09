import { Router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { SuperAdminGuard } from '../middleware/super-admin.guard.js';
import { UserGuard } from '../middleware/user.guard.js';
import { AdminGuard } from '../middleware/admin.guard.js';

const router = Router();
const controller = new UserController();

router
  .post('/superadmin', controller.createSuperAdmin)
  .post('/', JwtAuthGuard, UserGuard, controller.createUser)
  .post('/author', controller.createAuthor)
  .post('/admin', controller.createAdmin)
  .post('/signin', controller.signin)
  .post('/confirm-signin', controller.confirmSignIn)
  .post('/token', controller.accessToken)
  .post('/signout', controller.signout)

  .get('/', JwtAuthGuard, AdminGuard, controller.getAllUsers)
  .get('/:id', JwtAuthGuard, UserGuard, controller.getUserById)
  .get('/getAuthor', controller.getAllAuthor)
  .get('/getAdmins', controller.getAllAdmin)
  .get('/getAllUser', controller.getAllUser)

  .put('/:id', JwtAuthGuard, UserGuard, controller.updateAdminById)
  .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteAdminById);

export default router;
