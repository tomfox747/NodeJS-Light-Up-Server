import { passwordInvalidError, userInvalidError, passwordInvalidConst, userInvalidConst } from '../../helpers/errorHandling/registerAccount/registerAccount';
import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';
import { hasSpecialChars, specialChars } from '../../helpers/hasSpecialChars';
import config from '../../../config';
import {errorlogger, createErrorLog} from '../../../logging/log'

const validatePasswardInput = async (req, res, next) => {

    try {

        if (!req.body.user) {
            throw new userInvalidError('Username is not provided by client', 406, userInvalidConst.identifier, userInvalidConst.context.userNotProvided);
        }

        if (!req.body.user.password) {
            throw new passwordInvalidError('Password is not provided by client', 406, passwordInvalidConst.identifier, passwordInvalidConst.context.notProvided);
        }

        const { password } = req.body.user;

        const PASSWORD_MAX_LEN = parseInt(config.PASSWORD_MAX_LEN);
        if (PASSWORD_MAX_LEN === NaN) throw new InternalServerError('An Internal Server has occured', 500, internalServerConst.identifier, internalServerConst.context)
        if (password.length > PASSWORD_MAX_LEN) {
            throw new passwordInvalidError('Password is not valid', 406, passwordInvalidConst.identifier, passwordInvalidConst.context.tooBig);
        }

        if (hasSpecialChars(password, specialChars.chars)) {
            throw new passwordInvalidError('Forbidden expression detected in password', 403, passwordInvalidConst.identifier, passwordInvalidConst.context.forbiddenExpression);
        }

        next();

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'validatePasswordInput', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context));
    }
}

export default validatePasswardInput;