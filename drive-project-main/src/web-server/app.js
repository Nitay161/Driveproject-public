const express = require('express')
const cors = require('cors');
const app = express()
const fileRoutes = require('./routes/files');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/users');
const { startTrashCleanup } = require('./models/files');

app.use(cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'User-Id'], 
    exposedHeaders: ['User-Id'],
    origin: '*'
}));
app.use(express.json())
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', userRoutes);

//start trash cleanup process
startTrashCleanup().then(() => {
    app.listen(5000, () => console.log("API server running on port 5000"));
});