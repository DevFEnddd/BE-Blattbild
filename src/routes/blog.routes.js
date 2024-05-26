import express from "express";
const router = express.Router();

import {listBlog, createBlog, updateBlog, deleteBlog, detailBlog} from "../controllers/blog.controller.js"

router.get('/list', listBlog)
router.get('/detail-blog/:slug', detailBlog)
router.post('/new', createBlog)
router.put('/update-blog/:slug', updateBlog)
router.delete('/delete-blog/:id', deleteBlog)

export default router