import jwt from 'jsonwebtoken'
import { AuthenticationError, AuthenticationConst } from '../../helpers/errorHandling/auth/jwt/jwt';
import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';
import { getUser } from '../../../services/user/userService';
import config from '../../../config';
import {errorlogger, createErrorLog} from '../../../logging/log'

export const verify = async (accessToken, secret) => {
    try {
        // No other code must be placed in here 
        const user = await jwt.verify(accessToken, secret, { algorithms: ["HS256"] });
        return user

    } catch (err) {
        err.errorType = 'custom';
        throw err
    }
}

export const jwtAuthentication = async (req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            throw new AuthenticationError('authorization header not provided', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.authHeaderNotProvided);
        }

        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken) {
            throw new AuthenticationError('Access token not provided', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.accessTokenNotProvided);
        }

        const user = await verify(accessToken, config.JWT_TOKEN_ACCESS_SECRET);

        if (!user.accessLevel || user.accessLevel.length === 0) {
            throw new AuthenticationError('Access denied', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.invalidPayload);
        }
        // Check if user has refresh token, if they dont it meansd they have been logged out and their access token if it hasnt expired yet is not longer valid
        const { refreshToken } = await getUser({ username: user.username });
        if (!refreshToken) {
            throw new AuthenticationError('Access denied', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.userIsNotLoggedIn);
        }

        req.body.user = user
        console.log('Access Auth Success');
        next();

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'jwtAuthentication', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
        console.log('Access Auth Failure');

    }

};


export const audienceAuthentication = (req, res, next) => {

    try {
        const audienceHeader = req.headers['audience'];

        if (!audienceHeader) {
            throw new AuthenticationError('audience header not provided', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.audienceHeaderNotProvided);
        }

        const audience = audienceHeader.split(' ')[1];
        if (!audience) {
            throw new AuthenticationError('audience header provided', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.audienceNotProvided);
        }

        const audienceAllowed = config.TRUSTED_AUDIENCES.includes(audience)
        if (!audienceAllowed) {
            throw new AuthenticationError('Invalid audience', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.invalidaudience);
        }

        req.body.audience = audience
        next();

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, "audienceAuthentication", req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
        console.log('Access Auth Failure');

    }
}