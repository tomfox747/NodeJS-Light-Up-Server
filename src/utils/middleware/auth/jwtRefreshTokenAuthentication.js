import jwt from 'jsonwebtoken';
import config from '../../../config';
import { AuthenticationError, AuthenticationConst } from '../../helpers/errorHandling/auth/jwt/jwt';
import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';
import { getUser } from '../../../services/user/userService';
import { errorlogger, createErrorLog } from '../../../logging/log'
import { verify } from '../../middleware/auth/jwtAuthentication';

export const refreshTokenAuthentication = (async (req, res, next) => {
    try {
        const sentRefreshToken = req.body.refreshToken;

        if (!sentRefreshToken) {
            throw new AuthenticationError('Refresh token not provided', 401, AuthenticationConst.identifier.jwtAuth, AuthenticationConst.context.refreshTokenNotProvided);
        }

        // search for the user based on username and refresh token so that a search by token doesnt pull another user sccount and search by username doesnt reviel dsomeone elses refresh token

        const user = await verify(sentRefreshToken, config.JWT_TOKEN_REFRESH_SECRET);

        const { refreshToken, username, accessLevel } = await getUser({ username: user.username, refreshToken: sentRefreshToken });

        if (!refreshToken) {
            throw new AuthenticationError('Access denied', 401, AuthenticationConst.identifier.jwtAuth, AuthenticationConst.context.userRefreshTokenNotFound);
        }

        req.body.user = {
            username: username,
            accessLevel: accessLevel
        }

        next();

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level: 'error',
            message: createErrorLog('function', error.message, 'refreshTokenAuthentication', req.body)
        })

        res.status(500).send(new InternalServerError('Internal Server Error', internalServerConst.identifier, internalServerConst.context));
    }
});
