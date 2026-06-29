import 'dotenv/config'; // Load environment variables from .env file
import { app } from './app.js';
import { connectDB } from './db/index.js';


const PORT = process.env.PORT || 3000;

// Connect to MongoDB   
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

// startServer();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});  
