const express = require('express')
const cors = require('cors');
const app = express()
const fileRoutes = require('./routes/files');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/users');
const { startTrashCleanup } = require('./models/files');
const { connectDB } = require("./models/db");


app.use(cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'User-Id'], 
    exposedHeaders: ['User-Id'],
    origin: '*'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', userRoutes);

// Start the server after connecting to the database
(async () => {
    try {
        await connectDB();// connect MongoDB first
        await startTrashCleanup();// start cleanup job

        app.listen(5000, () =>
            console.log("API server running on port 5000")
        );
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();