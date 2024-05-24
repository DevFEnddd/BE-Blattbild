import express from "express";
import listBlog from "../controllers/blog.controller.js"

const router = express.Router();


router.post('/blog', listBlog)

export default router