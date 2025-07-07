import bcrypt from 'bcrypt';
import { User } from "../models.ts";
import { CreateUserDto } from "../dtos/userDtos.ts";
import jwt from 'jsonwebtoken';

const createUser = async (userDto: CreateUserDto) => {
    if (userDto.password !== userDto.confirmPassword) {
        throw new Error("Passwords don't match");
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