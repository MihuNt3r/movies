import bcrypt from 'bcrypt';
import { User } from "../models.js";
import { CreateUserDto } from "../dtos/userDtos.js";
import jwt from 'jsonwebtoken';
import {EntityAlreadyExists} from "../errors/EntityAlreadyExists.js";

const createUser = async (userDto: CreateUserDto) => {
    const existingUser = await User.findOne({ where: { email: userDto.email } });
    if (existingUser) {
        throw new EntityAlreadyExists("User with this email already exists");
    }

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    await User.create({
        email: userDto.email,
        name: userDto.name,
        password: hashedPassword,
        salt: salt,
    });

    const user = await User.findOne({
        where: { email: userDto.email },
        attributes: { exclude: ['password', 'salt'] },
    });

    if (!user) {
        throw new Error('User creation failed');
    }

    const jwtSecretKey = process.env.JWT_SECRET;

    if (!jwtSecretKey) {
        throw new Error('JWT secret must be set');
    }

    const token = jwt.sign({
        userId: user.id,
        email: user.email
    },jwtSecretKey,{
        expiresIn: '1h'
    });

    return {
        token
    };
}

export {
    createUser
}