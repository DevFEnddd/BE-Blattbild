import AdminRouter from "./admin/admin.routes.js"
import BlogRouter from "./client/blog.routes.js"
import FormRouter from "./client/blog.routes.js"

const routes = (app) => {
    app.use('/api/admin', AdminRouter)
    // app.use('/api/blog', BlogRouter)
    // app.use('/api/form', FormRouter)
}

export default routes