import review from '../models/reviews.model.js';
import { reviewsValidator } from '../validation/reviews.validation.js';
import { catchError } from '../utils/error-response.js';

export class reviewController {
  async createReview(req, res) {
    try {
      const { error, value } = reviewsValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const Review = await review.create(value);
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: Review,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllReview(req, res) {
    try {
      const Review = await review
        .find()
        .populate('user_id')
        .populate('course_id');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Review,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }

  async getReviewById(req, res) {
    try {
      const Review = await reviewController.findReviewById(res, req.params.id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Review,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateById(req, res) {
    try {
      const id = req.params.id;
      await reviewController.findReviewById(res, id);
      const updatedReview = await review.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        data: updatedReview,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteById(req, res) {
    try {
      const id = req.params.id;
      await reviewController.findReviewById(res, id);
      await review.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findReviewById(res, id) {
    try {
      const Review = await review
        .findById(id)
        .populate('user_id')
        .populate('course_id');
      if (!Review) {
        return catchError(res, 404, 'Review not found');
      }
      return Review;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
