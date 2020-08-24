import dotenv from 'dotenv';

dotenv.config();

const config = {
    SERVER_PORT: process.env.SERVER_PORT,
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    DB_NAME: process.env.DB_NAME,
    GOOGLE_API_ACCESS_TOKEN_URL: process.env.GOOGLE_API_ACCESS_TOKEN_URL,
    JWT_TOKEN_ACCESS_SECRET: process.env.JWT_TOKEN_ACCESS_SECRET,
    JWT_TOKEN_REFRESH_SECRET: process.env.JWT_TOKEN_REFRESH_SECRET,
    JWT_TOKEN_ACCESS_EXP_TIME: process.env.JWT_TOKEN_ACCESS_EXP_TIME,
    JWT_TOKEN_REFRESH_EXP_TIME: process.env.JWT_TOKEN_REFRESH_EXP_TIME,
    JWT_AUTH_ISSUER: process.env.JWT_AUTH_ISSUER,
    JWT_AUTH_AUDIENCE: process.env.JWT_AUTH_AUDIENCE,
    JWT_AUTH_ALGO: process.env.JWT_AUTH_ALGO,
    USERNAME_MIN_LEN: process.env.USERNAME_MIN_LEN,
    USERNAME_MAX_LEN: process.env.USERNAME_MAX_LEN,
    PASSWORD_MIN_LEN: process.env.USERNAME_MIN_LEN,
    PASSWORD_MAX_LEN: process.env.PASSWORD_MAX_LEN,
    TRUSTED_AUDIENCES: process.env.TRUSTED_AUDIENCES.split(' ')
};

export default config;