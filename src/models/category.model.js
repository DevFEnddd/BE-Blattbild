import mongoose from 'mongoose';
import { categoryTypeEnum } from '../enums/categoryType.enum.js';

const { Schema } = mongoose;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    enum: Object.values(categoryTypeEnum),
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.id;
    },
  },
});

const Category =  mongoose.model('Category', categorySchema);
export {Category}