import bcrypte from 'bcrypt';
import usersModel from '../../schemas/usersSchema';
import config from '../../config';
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db';
import { AuthenticationError, AuthenticationConst } from '../../utils/helpers/errorHandling/auth/jwt/jwt';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import jwt from 'jsonwebtoken';
import { errorlogger, createErrorLog } from '../../logging/log'


//Find user in Db 
// compare password using bcrypte
// generate access and refresh token

export const authenticatePassword = async (receivedPassword, storedPassword) => {

    try {

        if (await bcrypte.compare(receivedPassword, storedPassword)) {
            return true;
        } else {
            throw new AuthenticationError('password is incorrect', 401, AuthenticationConst.identifier.jwtAuth, AuthenticationConst.context.passwordNotCorrect);
        }

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'authenticatePassword', [receivedPassword, storedPassword])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);

    }
};


export const generateJWTTokens = (user) => {

    let currentdate = new Date();
    const datetime = Math.round(currentdate.getTime() / 1000)

    const exp = parseInt(config.JWT_TOKEN_ACCESS_EXP_TIME);

    if (exp === NaN){
        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'generateJWTTokens', [user])
        })

        throw new InternalServerError('An Internal Server has occured', 500, internalServerConst.identifier, internalServerConst.context)
    } 

    const payload = { username: user.username, iat: datetime, accessLevel: user.accessLevel, audience: user.audience };
    const refreshPayload = { username: user.username, iat: datetime, audience: user.audience }

    const accessToken = jwt.sign(payload, config.JWT_TOKEN_ACCESS_SECRET, { expiresIn: config.JWT_TOKEN_ACCESS_EXP_TIME, algorithm: 'HS256' });
    const refreshToken = jwt.sign(refreshPayload, config.JWT_TOKEN_REFRESH_SECRET, { expiresIn: config.JWT_TOKEN_REFRESH_EXP_TIME, algorithm: 'HS256' });

    return [accessToken, refreshToken]

};