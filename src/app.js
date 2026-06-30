import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.routes.js";

app.use("/api/users", userRouter);



// Error handling middleware
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

app.use(notFound);
app.use(errorHandler);

export { app };