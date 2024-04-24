import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isURL from 'validator/lib/isURL';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: isURL,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    message: 'Неправильный формат ссылки',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: isEmail,
    message: 'Неправильный формат почты',
  },
  password: {
    type: String,
    required: true,
    validate: isStrongPassword,
    message: 'Неправильный формат пароля',
    select: false,
  },
});

export default model<IUser>('user', userSchema);
