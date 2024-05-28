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
    form: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { timestamp: true }
);

formCustomerSchema.plugin(mongoosePaginate);

const FormCustomer = mongoose.model('FormCustomer', formCustomerSchema);
export { FormCustomer };