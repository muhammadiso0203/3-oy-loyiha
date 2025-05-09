import category from '../models/category.model.js';
import { categoryValidator } from '../validation/category.validation.js';
import { catchError } from '../utils/error-response.js';

export class categoryController {
  async createCategory(req, res) {
    try {
      const { error, value } = categoryValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const Category = await category.create(value);
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: Category,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllCategory(req, res) {
    try {
      const Category = await category.find().populate('course');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Category,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const Category = await categoryController.findCategoryById(
        res,
        req.params.id
      );
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: Category,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateById(req, res) {
    try {
      const id = req.params.id;
      await categoryController.findCategoryById(res, id);
      const updatedCategory = await category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updatedCategory,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteById(req, res) {
    try {
      const id = req.params.id;
      await categoryController.findCategoryById(res, id);
      await category.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findCategoryById(res, id) {
    try {
      const Category = await category.findById(id);
      if (!Category) {
        return catchError(res, 404, 'Category not found');
      }
      return Category;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
