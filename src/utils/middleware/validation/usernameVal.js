import { usernameInvalidError, userInvalidError, usernameInvalidConst, userInvalidConst } from '../../helpers/errorHandling/registerAccount/registerAccount';
import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';
import { hasSpecialChars, specialChars } from '../../helpers/hasSpecialChars';
import config from '../../../config';
import { errorlogger, createErrorLog } from '../../../logging/log'

const validateUsernameInput = async (req, res, next) => {

    try {

        if (!req.body.user) {
            throw new userInvalidError('Username is not provided by client', 406, userInvalidConst.identifier, userInvalidConst.context.userNotProvided);
        }
        if (!req.body.user.username) {
            throw new usernameInvalidError('Username is not provided by client', 406, usernameInvalidConst.identifier, usernameInvalidConst.context.usernameNotProvided);
        }

        const { username } = req.body.user;

        const USERNAME_MAX_LEN = parseInt(config.USERNAME_MAX_LEN);
        if (USERNAME_MAX_LEN === NaN) throw new InternalServerError('An Internal Server has occured', 500, internalServerConst.identifier, internalServerConst.context)
        if (username.length > parseInt(config.USERNAME_MAX_LEN)) {
            throw new usernameInvalidError('Username is too big', 406, usernameInvalidConst.identifier, usernameInvalidConst.context.tooBig);
            return;
        }

        if (hasSpecialChars(username, specialChars.chars)) {
            throw new usernameInvalidError('Forbidden expression detected in username', 403, usernameInvalidConst.identifier, usernameInvalidConst.context.forbiddenExpression);
        }

        next();

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level: 'error',
            message: createErrorLog('function', error.message, 'validateUsernameInput', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context));
    }
}

export default validateUsernameInput;