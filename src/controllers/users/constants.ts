import { Joi } from 'celebrate';

const PASSWORD_PATTERN = /^[a-zA-Z0-9]{8,30}$/;
const PASSWORD_MESSAGES = {
  'string.pattern.base': 'Пароль должен быть от 8 до 30 символов и состоять из букв и чисел',
  'string.empty': 'Пароль не может быть пустым',
  'any.required': 'Поле пароля обязательно',
};

export const joiPasswordValidator = Joi.string()
  .pattern(PASSWORD_PATTERN)
  .messages(PASSWORD_MESSAGES);
