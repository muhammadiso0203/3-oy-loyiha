import enrolments from '../models/enrolments.model.js';
import { enrolmentValidator } from '../validation/enrolments.validation.js';
import { catchError } from '../utils/error-response.js';

export class enrolmentController {
  async createEnrolment(req, res) {
    try {
      const { error, value } = enrolmentValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const Enrolment = await enrolments.create(value);
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: Enrolment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllEnrolment(req, res) {
    try {
      const Enrolment = await enrolments
        .find()
        .populate('user_id')
        .populate('course_id');

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Enrolment,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  async getEnrolmentById(req, res) {
    try {
      const Enrolment = await enrolmentController.findEnrolmentById(
        res,
        req.params.id
      );
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Enrolment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateById(req, res) {
    try {
      const id = req.params.id;
      await enrolmentController.findEnrolmentById(res, id);
      const updatedEnrolment = await review.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        data: updatedEnrolment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteById(req, res) {
    try {
      const id = req.params.id;
      await enrolmentController.findEnrolmentById(res, id);
      await enrolments.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findEnrolmentById(res, id) {
    try {
      const Enrolment = await enrolments
        .findById(id)
        .populate('user_id')
        .populate('course_id');
      if (!Enrolment) {
        return catchError(res, 404, 'Enrolment not found');
      }
      return Enrolment;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
