import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const formCustomerSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    topic: {
      type: String,
    },
    // note: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.id;
        delete ret.password;
      },
    },
  }
);

formCustomerSchema.plugin(mongoosePaginate);

const FormCustomer = mongoose.model('FormCustomer', formCustomerSchema);
export { FormCustomer };