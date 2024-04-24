import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../../models/user';
import {
  BadRequest,
} from '../../errors';
import {
  badReqCreateUserMessage,
} from '../constants';

/**
 * Создает нового пользователя
 */
const createUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(constants.HTTP_STATUS_CREATED);
    return res.send({ _id: user._id });
  } catch (err) {
    const isMongoValidationError = err instanceof MongooseError.ValidationError;
    if (isMongoValidationError) {
      return next(new BadRequest(badReqCreateUserMessage));
    }
    return next(err);
  }
};

export default createUser;
