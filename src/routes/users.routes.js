import express from "express";
const router = express.Router();

// import listBlog from "../controllers/blog.controller.js"
import {loginUser, updateUser} from "../controllers/user.controller.js"

router.post('/login', loginUser)
router.post('/update-user/:id', updateUser)

export default router