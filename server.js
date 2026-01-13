import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import contactRoutes from './routes/contact.js';

// ✅ Load .env from parent folder (project root)
// dotenv.config({ path: path.resolve('../.env') });
// dotenv.config();
// import path from "path";
// import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve("../.env") }); // local
}



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Mongo URI:", process.env.MONGODB_URI);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ✅ Contact routes
app.use('/api/contact', contactRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
