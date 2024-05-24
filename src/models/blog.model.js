import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import mongoosePaginate from 'mongoose-paginate-v2';
import { articleStatusEnum } from '../enums/articleStatus.enum.js';

const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
      default: 'https://via.placeholder.com/300x300.jpg?text=tmptechnology.vn',
    },
    content: {
      type: String,
    },
    tags: 
      [{type: Schema.Types.ObjectId,
        ref: 'Tag',}]
    ,
    slug: {
      type: String,
      default() {
        if (this.title) {
          return `${slugify(this.title)}-${nanoid(6)}`;
        }
      },
    },
    status: {
      type: Number,
      enum: Object.values(articleStatusEnum),
      default: articleStatusEnum.PUBLISHED,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.id;
      },
    },
  }
);

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model('blog', blogSchema);
export { Blog };