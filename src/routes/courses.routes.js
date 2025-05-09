import { Router } from 'express';
import { courseController } from '../controller/course.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { AuthorGuard } from '../middleware/author.guard.js';
import { AdminGuard } from '../middleware/admin.guard.js';

const router = Router();
const controller = new courseController();

router
  .post('/', JwtAuthGuard, AuthorGuard, controller.createCourse)
  .get('/', controller.getAllCourses)
  .get('/:id', controller.getCoursesById)
  .get('/filter', controller.getByFilter)
  .put('/:id', JwtAuthGuard, AuthorGuard, controller.updateById)
  .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteById);

export default router;
