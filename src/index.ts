import express from 'express';
import { sequelize } from "./database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";

import movieRoutes from './routes/movieRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();

sequelize.sync()
    .then(() => console.log('db is ready'))
    .catch((err) => console.error('db error: ' + err));

const app = express();

app.use(express.json());
app.use(express.static('frontend'));

// Register routes
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);

app.use(errorHandler);

const APP_PORT = Number(process.env.APP_PORT) || 8080;

app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}...`);
});