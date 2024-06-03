import express from "express";

const router = express.Router();

// import listBlog from "../controllers/blog.controller.js"
import {
    loginUser,
    logoutUser,
    refreshToken,
    listForm,
    detailForm,
    listBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    detailBlog,
    getUser,
    getTotalBlog, updateStatusBlog
} from "../../controllers/admin.controller.js"
import {authMiddleware} from "../../middleware/authMiddleware.js"
import upload from "../../middleware/uploadMiddleware.js";


router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/refresh-token', refreshToken)

router.post('/me', authMiddleware, getUser)
// form admin
router.get('/form-list', authMiddleware, listForm)
router.get('/detail-form/:id', authMiddleware, detailForm)
// blog admin
router.get('/blog-list', authMiddleware, listBlog)
router.get('/detail-blog', authMiddleware, detailBlog)
router.get('/total-blog', authMiddleware, getTotalBlog)
router.post('/new', authMiddleware, upload.single('coverUrl'), createBlog)
router.put('/update-blog', authMiddleware, upload.single('coverUrl'), updateBlog)
router.put('/update-blog-status', authMiddleware, updateStatusBlog)
router.delete('/delete-blog/:id', authMiddleware, deleteBlog)

export default router