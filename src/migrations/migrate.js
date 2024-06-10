import bcrypt from "bcrypt";
import dotenv from "dotenv-safe";
import path from "path";
import { fileURLToPath } from "url";

import { Category } from "../models/category.model.js";
import { Blog } from "../models/blog.model.js";
import { Account } from "../models/account.model.js";
import { FormCustomer } from "../models/formCustomer.model.js" 
import libphonenum from "google-libphonenumber";

const { PhoneNumberFormat, PhoneNumberUtil } = libphonenum;

const phoneUtil = PhoneNumberUtil.getInstance();

import mongoose from "mongoose";
// import * as data from './data.json';
import fs from "fs";
import { accountTypeEnum } from "../enums/accountType.enum.js";
import { accountStatusEnum } from "../enums/accountStatus.enum.js";
const importBlogs = JSON.parse(
  fs.readFileSync(new URL("./blog.json", import.meta.url))
);
const importCategories = JSON.parse(
  fs.readFileSync(new URL("./category.json", import.meta.url))
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, "./.env"),
  example: path.join(__dirname, './.env.example')
});

const vars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  mongo: {
    uri:
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI,
  },
};

if (vars.env === "development") {
  mongoose.set("debug", false);
}

const migrateData = async () => {
  await Account.deleteMany({});
  await createdAdminAccount();
  // await createCategory();
  // await createBlog();

}

const createdAdminAccount = async (req, res, next)  => {
    const hashedPassword = bcrypt.hashSync('123456', 8);

    const phone = '0373922863';

    const number = phoneUtil.parse(phone, 'VN');

    const phoneNumber = phoneUtil.format(number, PhoneNumberFormat.E164);

   await Account.create(
      {
        profile: {
          fullName: 'ADMIN BLATT',
          dateOfBirth: '2000-03-11 14:55:45',
          email: 'admin@blattbild.de',
          avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg'
        },
        username: 'admin@blattbild.de',
        phone: phoneNumber,
        password: hashedPassword,
        type: accountTypeEnum.ADMIN,
        authentication: {
          isCreatedPassword: true,
          isPhoneVerified: true
        },
        status: accountStatusEnum.ACTIVE,
      }
    );
}

const createBlog = async (req, res, next) => {
  await Blog.deleteMany({});
  await Blog.insertMany(importBlogs);
  console.log(`✨ Inserted Blog`);
};

const createCategory = async (req, res, next) => {
  await Category.deleteMany({});
  await Category.insertMany(importCategories);
  console.log(`✨ Inserted Category`);
};

const createForm = async (req, res, next) => {
  await FormCustomer.deleteMany({});
  await FormCustomer.insertMany(importCategories);
  console.log(`✨ Inserted FormCustomer`);
};
   
mongoose
  .connect(process.env.MONGO_URI_TESTS)
  .then(() => {
    console.log("MongoDB connected...");

    console.log("[/] Waiting for migration begin...");
    setTimeout(() => {
      console.log("done");

      migrateData();
    }, 3000);
  })
  .catch((err) => console.log(err));
