import usersModel from '../../../schemas/usersSchema';
import config from '../../../config';
import {
    userInvalidError,
    usernameInvalidError,
    passwordInvalidError,
    emailInvalidError,
    userInvalidConst,
    usernameInvalidConst,
    passwordInvalidConst,
    emailInvalidConst
} from '../../helpers/errorHandling/registerAccount/registerAccount';
import { DatabaseError, databaseErrorConst } from '../../helpers/errorHandling/db/db';
import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';
import { hasSpecialChars, specialChars } from '../../helpers/hasSpecialChars';
import {errorlogger, createErrorLog} from '../../../logging/log'

const validateRegisterAccountInputs = async (req, res, next) => {

    // TODO Consider if making this generic is beneificial or not 
    try {

        if (!req.body.user) {
            res.status(406).send(new userInvalidError('Username is not provided by client', userInvalidConst.identifier, userInvalidConst.context.userNotProvided));
            return
        }

        // Check response body for existance of relevent firld
        if (!req.body.user.username) {
            throw new usernameInvalidError('Username is not provided by client', usernameInvalidConst.identifier, usernameInvalidConst.context.usernameNotProvided);

        }

        if (!req.body.user.email) {
            throw new emailInvalidError('Email is not provided by client', emailInvalidConst.identifier, emailInvalidConst.context.notProvided);

        }

        if (!req.body.user.password) {
            throw new passwordInvalidError('Password is not provided by client', passwordInvalidConst.identifier, passwordInvalidConst.context.notProvided);

        }

        const { username, email, password } = req.body.user;

        // Check inputs are within min/max character length ranges
        const USERNAME_MIN_LEN = parseInt(config.USERNAME_MIN_LEN);
        if (USERNAME_MIN_LEN === NaN) throw new InternalServerError('An Internal Server has occured', internalServerConst.identifier, internalServerConst.context);

        if (username.length < USERNAME_MIN_LEN) {
            throw new usernameInvalidError('Username is too small', usernameInvalidConst.identifier, usernameInvalidConst.context.tooSmall);

        }

        const USERNAME_MAX_LEN = parseInt(config.USERNAME_MAX_LEN);
        if (USERNAME_MAX_LEN === NaN) throw new InternalServerError('An Internal Server has occured', internalServerConst.identifier, internalServerConst.context);

        if (username.length > USERNAME_MAX_LEN) {
            throw new usernameInvalidError('Username is too small', usernameInvalidConst.identifier, usernameInvalidConst.context.tooBig);
            ;
        }

        const PASSWORD_MIN_LEN = parseInt(config.PASSWORD_MIN_LEN);
        if (PASSWORD_MIN_LEN === NaN) throw new InternalServerError('An Internal Server has occured', internalServerConst.identifier, internalServerConst.context);

        if (password.length < PASSWORD_MIN_LEN) {
            throw new passwordInvalidError('Password is not valid', passwordInvalidConst.identifier, passwordInvalidConst.context.tooSmall);
            ;
        }

        const PASSWORD_MAX_LEN = parseInt(config.PASSWORD_MAX_LEN);
        if (PASSWORD_MAX_LEN === NaN) throw new InternalServerError('An Internal Server has occured', internalServerConst.identifier, internalServerConst.context);
        if (password.length > config.PASSWORD_MAX_LEN) {
            throw new passwordInvalidError('Password is not valid', passwordInvalidConst.identifier, passwordInvalidConst.context.tooBig);
            ;
        }

        // Detect Special Characters

        if (hasSpecialChars(password, specialChars.chars)) {
            throw new passwordInvalidError('Forbidden expression detected in password', passwordInvalidConst.identifier, passwordInvalidConst.context.forbiddenExpression);
            ;
        }


        if (hasSpecialChars(username, specialChars.chars)) {
            throw new usernameInvalidError('Forbidden expression detected in username', usernameInvalidConst.identifier, usernameInvalidConst.context.forbiddenExpression);
            ;
        }

        // Check that the account to newly register do not already exist
        if (await usersModel.find({ '$or': [{ username: username }, { email: email }] }).lean().exec().then((doc, err) => {
            if (err) {
                throw new DatabaseError('Database experianced an error when finding a document', databaseErrorConst.indentifier, databaseErrorConst.context.cannotFind);

            }
            return doc.length > 0;
        })) {
            throw new usernameInvalidError('The username already exists', usernameInvalidConst.identifier, usernameInvalidConst.context.notUnique);

        }

        // validate password and email patters. 
        const isValidpassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/.test(password);
        if (!isValidpassword) {
            throw new passwordInvalidError('Password is not valid', passwordInvalidConst.identifier, passwordInvalidConst.context.noLettersOrNumbers);

        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            next();
        } else {
            throw new emailInvalidError('email is not valid', emailInvalidConst.identifier, emailInvalidConst.context.notValid);
        }

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(406).send(error);
            return;
        }
        
        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'validateRegisterAccountsInput', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
}

export default validateRegisterAccountInputs;


