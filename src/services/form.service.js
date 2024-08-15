import { FormCustomer } from "../models/formCustomer.model.js";
import nodemailer from 'nodemailer';
import { formEmail } from "./formEmail.js";
let createForm = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, phone,lname,fname,notify,communicate, topic} = data.body;
      const newBlog = await FormCustomer.create({
        name,
        lname,
        fname,
        email,
        phone,
        topic,
        notify,
        communicate
      });
      if (newBlog) {
        sendEmail(newBlog);
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
const sendEmail = (formData) => {

   formData.name = formData.name || `${formData.fname || ''} ${formData.lname || ''}`.trim();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: formData.email,
    to: 'kiubakass@gmail.com', 
    subject: 'New Form Data Received',
    text: `New form data received: ${JSON.stringify(formData)}`,
    html: formEmail(formData),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export default { createForm };
