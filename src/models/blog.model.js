import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
// import mongoosePaginate from 'mongoose-paginate-v2';
import { blogStatusEnum } from '../enums/blogStatus.enum.js';

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
      default: 'https://via.placeholder.com/300x300.jpg?text=tmptechnology.vn',
    },
    content: {
      type: String,
    },
    tags: 
      {type: String}
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
      enum: Object.values(blogStatusEnum),
      default: blogStatusEnum.PUBLISHED,
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

// blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model('blog', blogSchema);
export { Blog };