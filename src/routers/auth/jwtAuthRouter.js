import express from 'express';
import passwordInputValidation from '../../utils/middleware/validation/passwordVal';
import usernameInputValidation from '../../utils/middleware/validation/usernameVal';
import { authenticatePassword, generateJWTTokens } from '../../services/auth/jwtAuthService';
import { updateUser } from '../../services/user/userService';
import { getUser } from '../../services/user/userService';

import { AuthenticationError, AuthenticationConst } from '../../utils/helpers/errorHandling/auth/jwt/jwt';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { refreshTokenAuthentication } from '../../utils/middleware/auth/jwtRefreshTokenAuthentication';
import { errorlogger, createErrorLog } from '../../logging/log'
import { jwtAuthentication } from '../../utils/middleware/auth/jwtAuthentication';


const router = express.Router();

router.post('/login', passwordInputValidation, usernameInputValidation, async (req, res) => {

    try {

        const user = await getUser({ username: req.body.user.username }, new AuthenticationError('Cannot find user, username is incorrect', 401, AuthenticationConst.identifier.accessAuth, AuthenticationConst.context.usernameNotCorrect));
        user.audience = req.body.user.audience
        if (user.refreshToken) {
            throw new AuthenticationError('Access denied: User already logged into system', 401, AuthenticationConst.identifier.authentication, AuthenticationConst.context.userAlreadyLoggedIn);
        }
        await authenticatePassword(req.body.user.password, user.password)
        const [accessToken, newRefreshToken] = generateJWTTokens(user);
        await updateUser(req.body.user, { refreshToken: newRefreshToken });
        res.status(200).json({ accessToken: accessToken, refreshToken: newRefreshToken });

    } catch (error) {
        
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/auth/login', error.message, '/login', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }

});


router.delete('/logout', jwtAuthentication, async (req, res) => {

    try {
        await updateUser(req.body.user, { refreshToken: undefined });
        res.sendStatus(204);

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/auth/logout', error.message, '/auth/logout', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
});


router.post('/refresh-token', refreshTokenAuthentication, async (req, res) => {

    try {

        const [accessToken] = generateJWTTokens(req.body.user);
        res.status(200).json({ accessToken: accessToken });

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/auth/refresh-token', error.message, '/refresh-token', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
});


export default router;

