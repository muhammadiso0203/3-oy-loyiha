import { Router } from 'express';
import { categoryController } from '../controller/category.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { AdminGuard } from '../middleware/admin.guard.js';

const router = Router();
const controller = new categoryController();

router
  .post('/', JwtAuthGuard, AdminGuard, controller.createCategory)
  .get('/', controller.getAllCategory)
  .get('/:id', controller.getCategoryById)
  .put('/:id', JwtAuthGuard, AdminGuard, controller.updateById)
  .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteById);

export default router;
