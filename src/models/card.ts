import {
  Schema, model, ObjectId,
} from 'mongoose';
import isURL from 'validator/lib/isURL';

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: string;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: isURL,
    required: true,
    message: 'Неправильный формат ссылки',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default model<ICard>('card', cardSchema);
