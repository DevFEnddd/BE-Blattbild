import BlogRouter from "./blog.routes.js"
import AdminRouter from "./users.routes.js"

const routes = (app) => {
    // app.use('/api/admin', BlogRouter)
    app.use('/api/user', AdminRouter)
    app.use('/api/blog', BlogRouter)
    app.use('/api/form', BlogRouter)
}

export default routes