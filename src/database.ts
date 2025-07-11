import { Sequelize } from 'sequelize-typescript';
import { Movie, Actor, MovieActor, User } from "./models.js";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    host: './dev.sqlite',
    logging: console.log,
    models: [Movie, Actor, MovieActor, User],
});

export { sequelize };