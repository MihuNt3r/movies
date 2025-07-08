import {User} from "../models.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SessionCreateDto } from "../dtos/sessionDtos.js";

const createSession = async (sessionCreateDto: SessionCreateDto) => {
    const { email, password } = sessionCreateDto;

    const user = await User.findOne({ raw: true, where: { email } });
    if (!user) {
        throw new NotFoundError('User');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid password');
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
};

export {
    createSession
}