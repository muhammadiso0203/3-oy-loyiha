import course from '../models/courses.model.js';
import { courseValidator } from '../validation/courses.validation.js';
import { catchError } from '../utils/error-response.js';

export class courseController {
  async createCourse(req, res) {
    try {
      const { error, value } = courseValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const Course = await course.create(value);
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: Course,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }

  async getAllCourses(req, res) {
    try {
      const Courses = await course.find().populate('category author');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Courses,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }

  async getCoursesById(req, res) {
    try {
      const Courses = await courseController.findCoursesById(
        res,
        req.params.id
      );
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Courses,
      });
    } catch (error) {
      catchError(res, 500, error.message);
    }
  }

  async updateById(req, res) {
    try {
      const id = req.params.id;
      await courseController.findCoursesById(res, id);
      const updateCourse = await course.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updateCourse,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteById(req, res) {
    try {
      const id = req.params.id;
      await courseController.findCoursesById(res, id);
      await course.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findCoursesById(res, id) {
    try {
      const Course = await course.findById(id).populate('category author');
      if (!Course) {
        return catchError(res, 404, 'Course not found');
      }
      return Course;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
