import { FormCustomer } from "../models/formCustomer.model.js";

let createForm = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, phone, form, note } = data.body;
      const newForm = await Blog.create({
        name,
        email,
        phone,
        form,
        note,
      });
      if (newForm) {
        resolve({
          status: "200",
          messsage: "SUCCESS",
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