import express from "express";
const router = express.Router();

// import listBlog from "../controllers/blog.controller.js"
import {loginUser} from "../controllers/user.controller.js"

router.post('/login', loginUser)

export default router