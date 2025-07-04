// // @/models.ts
// import { Table, Model, Column, DataType, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
//
// @Table({
//     timestamps: true,
//     tableName: "movies",
// })
// export class Movie extends Model {
//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     })
//     id!: number;
//
//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     title!: string;
//
//     @Column({
//         type: DataType.INTEGER,
//         allowNull: false,
//     })
//     year!: number;
//
//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     format!: string;
//
//     @BelongsToMany(() => Actor, () => MovieActor)
//     actors!: Actor[];
// }
//
// @Table({
//     timestamps: true,
//     tableName: "actors",
// })
// export class Actor extends Model {
//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     })
//     id!: number;
//
//     @Column({
//         type: DataType.STRING,
//         allowNull: false,
//     })
//     name!: string;
//
//     @BelongsToMany(() => Movie, () => MovieActor)
//     movies!: Movie[];
// }
//
// @Table({
//     timestamps: false,
//     tableName: "movie_actors",
// })
// export class MovieActor extends Model {
//     @ForeignKey(() => Movie)
//     @Column({
//         type: DataType.INTEGER,
//         allowNull: false,
//     })
//     movieId!: number;
//
//     @ForeignKey(() => Actor)
//     @Column({
//         type: DataType.INTEGER,
//         allowNull: false,
//     })
//     actorId!: number;
//
//     @BelongsTo(() => Movie)
//     movie!: Movie;
//
//     @BelongsTo(() => Actor)
//     actor!: Actor;
// }