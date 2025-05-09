import { Router } from 'express';
import { reviewController } from '../controller/review.controller.js';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard.js';
import { UserGuard } from '../middleware/user.guard.js';

const router = Router();
const controller = new reviewController();

router
  .post('/', JwtAuthGuard, UserGuard, controller.createReview)
  .get('/', controller.getAllReview)
  .get('/:id', controller.getReviewById)
  .put('/:id', JwtAuthGuard, UserGuard, controller.updateById)
  .delete('/:id', JwtAuthGuard, UserGuard, controller.deleteById);

export default router;
