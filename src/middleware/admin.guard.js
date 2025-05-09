import { catchError } from '../utils/error-response.js';

export const AdminGuard = (req, res, next) => {
  try {
    const user = req?.user;
    if (
      user.role === 'superadmin' ||
      (user.role === 'admin' && user.id == req.params?.id)
    ) {
      return next();
    } else {
      return catchError(res, 403, 'Forbidden user');
    }
  } catch (error) {
    return catchError(res, 500, error.message);
  }
};
