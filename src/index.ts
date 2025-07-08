import express from 'express';
import { sequelize } from "./database.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import dotenv from "dotenv";

import movieRoutes from './routes/movieRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import sessionRoutes from './routes/sessionRoutes.ts';

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