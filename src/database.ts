import { Sequelize } from 'sequelize-typescript';
import { Movie, Actor, MovieActor } from "./models.ts";

const sequelize = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './dev.sqlite',
    logging: console.log,
    models: [Movie, Actor, MovieActor],
});

export { sequelize };