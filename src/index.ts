import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import todoRoutes from './routes/todos'
import { runMigrations } from './config/database'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

// Health check route
app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    })
})

// Root route
app.get('/', (req: express.Request, res: express.Response) => {
    res.json({
        message: 'Todo API Server',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth'
        }
    })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.stack)
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    })
})

// 404 handler - MUST be last
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    })
})

// Start server with database initialization
async function startServer() {
    try {
        // Run database migrations first
        console.log('Initializing database...')
        await runMigrations()
        console.log('Database initialized successfully!')

        // Start the server
        const server = app.listen(PORT, () => {
            console.log('\n Server Started Successfully!')
            console.log(`Server running on: http://localhost:${PORT}`)
            console.log(`Health check: http://localhost:${PORT}/health`)
            console.log(`Auth endpoints: http://localhost:${PORT}/api/auth`)
            console.log(`Database: Connected and migrated`)
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
            console.log('─'.repeat(50))
        })

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('\nSIGTERM received, shutting down gracefully...')
            server.close(() => {
                console.log('Process terminated')
            })
        })

    } catch (error) {
        console.error(' Failed to start server:', error)
        process.exit(1)
    }
}

// Start the server
startServer()

export default app