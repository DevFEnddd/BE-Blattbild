import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import mongoosePaginate from 'mongoose-paginate-v2';
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
      default: 'https://cdn-eipmp.nitrocdn.com/ZmvUXPcuuBpGedMIxvrrPiwxyewyyhAp/assets/images/optimized/rev-80232f8/passionates.com/wp-content/uploads/2024/04/Hire-Interim-CFO-for-Startups-1024x683.png',
    },
    content: {
      type: String,
    },
    tags: 
    [{type: Schema.Types.ObjectId,
      ref: 'Category'}]
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

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model('blog', blogSchema);
export { Blog };
