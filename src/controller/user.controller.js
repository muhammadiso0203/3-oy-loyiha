import Users from '../models/users.model.js';
import { catchError } from '../utils/error-response.js';
import { userValidator } from '../validation/user.validation.js';
import { encode, decode } from '../utils/bcrypt-encrypt.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-token.js';
import { transporter } from '../utils/mailer.js';
import { otpGenerator } from '../utils/otp-generator.js';
import { getCache, setCache } from '../utils/cache.js';
import { refTokenWriteCookie } from '../utils/write-cookie.js';

import jwt from 'jsonwebtoken';

export class UserController {
  async createSuperAdmin(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullname, email, password } = value;
      const checkSuperAdmin = await Users.findOne({ role: 'superadmin' });
      if (checkSuperAdmin) {
        return catchError(res, 409, 'Super admin already exist');
      }
      const hashedPassword = await encode(password, 7);
      const superadmin = await Users.create({
        fullname,
        email,
        hashedPassword,
        role: 'superadmin',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: superadmin,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async createUser(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullname, email, password } = value;
      const existEmail = await Users.findOne({ email });
      if (existEmail) {
        return catchError(res, 409, 'Email already exists');
      }
      const hashedPassword = await encode(password, 7);
      const user = await Users.create({
        fullname,
        email,
        hashedPassword,
        role: 'user',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'succes',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async createAuthor(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullname, email, password } = value;
      const existEmail = await Users.findOne({ email });
      if (existEmail) {
        return catchError(res, 409, 'Email already exists');
      }
      const hashedPassword = await encode(password, 7);
      const user = await Users.create({
        fullname,
        email,
        hashedPassword,
        role: 'author',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'succes',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async createAdmin(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) {
        return catchError(res, 400, error);
      }
      const { fullname, email, password } = value;
      const existEmail = await Users.findOne({ email });
      if (existEmail) {
        return catchError(res, 409, 'Email already exists');
      }
      const hashedPassword = await encode(password, 7);
      const user = await Users.create({
        fullname,
        email,
        hashedPassword,
        role: 'admin',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'succes',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Users.findOne({ email });
      if (!admin) {
        return catchError(res, 404, 'Admin not found');
      }
      const isMatchPassword = await decode(password, admin.hashedPassword);
      if (!isMatchPassword) {
        return catchError(res, 400, 'Invalid password');
      }
      const otp = otpGenerator();
      const mailMessage = {
        from: process.env.SMTP_USER,
        to: 'muhammadiso0203@gmail.com',
        subject: 'onlayn-kurs',
        text: otp,
      };
      transporter.sendMail(mailMessage, function (err, info) {
        if (err) {
          console.log(`Error on sending to mail: ${err}`);
          return catchError(res, 400, err);
        } else {
          console.log(info);
          setCache(admin.email, otp);
        }
      });
      return res.status(200).json({
        statusCode: 200,
        message: 200,
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async confirmSignIn(req, res) {
    try {
      const { email, otp } = req.body;
      const admin = await Users.findOne({ email });
      if (!admin) {
        return catchError(res, 400, 'Admin not found');
      }
      const otpCache = getCache(email);
      if (!otpCache || otp != otpCache) {
        return catchError(res, 400, 'OTP expired');
      }
      const payload = { id: admin._id, role: admin.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      refTokenWriteCookie(res, 'refreshTokenAdmin', refreshToken);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async accessToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenAdmin;
      if (!refreshToken) {
        return catchError(res, 401, 'Refresh token not found');
      }
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return catchError(res, 401, 'Refresh token expired');
      }
      const payload = { id: decodedToken.id, role: decodedToken.role };
      const accessToken = generateAccessToken(payload);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signout(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenAdmin;
      if (!refreshToken) {
        return catchError(res, 401, 'Refresh token not found');
      }
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return catchError(res, 401, 'Refresh token expired');
      }
      res.clearCookie('refreshTokenAdmin');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await Users.find().populate('Enrolment Course');
      return res.status(200).json({
        statusCode: 200,
        message: 'succes',
        data: users,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllAuthor(req, res) {
    try {
      const users = await Users.find({ role: 'author' }).populate('Course');
      return res.status(200).json({
        statusCode: 200,
        message: 'succes',
        data: users,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllAdmin(req, res) {
    try {
      const users = await Users.find({ role: 'admin' });
      return res.status(200).json({
        statusCode: 200,
        message: 'succes',
        data: users,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllUser(req, res) {
    try {
      const users = await Users.find({ role: 'user' });
      if (users.length === 0) {
        return catchError(res, 404, 'User not found');
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'succes',
        data: users,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getUserById(req, res) {
    try {
      const admin = await UserController.findById(res, req.params.id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: admin,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateAdminById(req, res) {
    try {
      const id = req.params.id;
      const user = await UserController.findById(res, id);
      if (!req.body.email) {
        const existEmail = await Users.findOne({
          email: req.params.email,
        });
        if (existEmail && id != existEmail._id) {
          return catchError(res, 409, 'Email already exists');
        }
      }
      let hashedPassword = user.hashedPassword;
      if (req.body.password) {
        hashedPassword = encode(req.body.password, 7);
        delete req.body.password;
      }

      const updateAdmin = await Users.findByIdAndUpdate(
        id,
        {
          ...req.body,
          hashedPassword,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updateAdmin,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await UserController.findById(res, id);
      if (admin.role === 'superadmin') {
        return catchError(res, 400, 'Supper admin cannot be delete');
      }
      await Users.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const admin = await Users.findById(id).populate('Enrolment Course');
      if (!admin) {
        return catchError(res, 404, `Admin not found by ID ${id}`);
      }
      return admin;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
