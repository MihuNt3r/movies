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

// Register routes
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});