import express from "express";
const router = express.Router();

import {listBlog, createBlog, updateBlog} from "../controllers/blog.controller.js"

router.post('/', listBlog)
router.post('/new', createBlog)
router.put('/update-blog/:slug', updateBlog)

export default router