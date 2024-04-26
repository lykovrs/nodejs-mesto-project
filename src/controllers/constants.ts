import { celebrate, Joi } from 'celebrate';

export const notFoundUserMessage = 'Нет пользователя с таким id';
export const notFoundCardMessage = 'Нет карточки с таким id';

export const idValidationRules = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});
