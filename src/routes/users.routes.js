import express from "express";
const router = express.Router();

// import listBlog from "../controllers/blog.controller.js"
import {loginUser, logoutUser} from "../controllers/user.controller.js"

router.post('/login', loginUser)
router.post('/logout', logoutUser)

export default router