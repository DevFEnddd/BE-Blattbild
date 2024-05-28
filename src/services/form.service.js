import { FormCustomer } from "../models/formCustomer.model.js";

let createForm = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, phone, form } = data.body;
      const newBlog = await FormCustomer.create({
        name,
        email,
        phone,
        form
      });
      if (newBlog) {
        resolve({
          status: 200,
          messsage: "Request sent successfully!",
          data: newBlog,
        });
      }
    } catch (err) {
      console.log(err);
      return reject(null, false);
    }
  });
};

export default { createForm };