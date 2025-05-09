import { Router } from 'express';
import { enrolmentController } from '../controller/enrolment.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { UserGuard } from '../middleware/user.guard.js';
import { AdminGuard } from '../middleware/admin.guard.js';

const router = Router();
const controller = new enrolmentController();

router
  .post('/', JwtAuthGuard, UserGuard, controller.createEnrolment)
  .get('/', JwtAuthGuard, UserGuard, controller.getAllEnrolment)
  .get('/:id', JwtAuthGuard, UserGuard, controller.getEnrolmentById)
  .put('/:id',  JwtAuthGuard, AdminGuard, controller.updateById)
  .delete('/:id', JwtAuthGuard, UserGuard, controller.deleteById);

export default router;
