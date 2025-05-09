import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from './utils/logger/logger.js';
import userRouter from './routes/user.routes.js';
import CategoryRouter from './routes/category.routes.js';
import courseRouter from './routes/courses.routes.js';
import reviewRouter from './routes/review.routes.js';
import enrolmentRouter from './routes/enrolments.routes.js';
import { connectDB } from './config/db.js';

config();

const app = express();
const PORT = +process.env.PORT;

app.use(express.json());
app.use(cookieParser());
await connectDB();

app.use('/user', userRouter);
app.use('/category', CategoryRouter);
app.use('/course', courseRouter);
app.use('/review', reviewRouter);
app.use('/enrolment', enrolmentRouter);

app.listen(PORT, logger.info(`Server is running on port ${PORT}`));
