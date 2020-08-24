import bcrypt from 'bcrypt';
import userModel from '../../schemas/usersSchema';
import userAccessLevels from '../../utils/helpers/constants/userAccessLevels';
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { errorlogger, createErrorLog } from '../../logging/log'

export const createNewUser = async (user) => {

    try {
        const encryptedPassword = await bcrypt.hash(user.password, 10);

        let newUser = new userModel({ username: user.username, email: user.email, password: encryptedPassword, accessLevel: [userAccessLevels.standardUser] });

        return new Promise(async (success, fail) => {

            try {
                await newUser.save()
                success();
            } catch (e) {

                errorlogger.log({
                    level:'error',
                    message:createErrorLog('function', error.message, 'createNewUser', [user])
                })

                fail(new DatabaseError('Internal Error', 500, databaseErrorConst.indentifier, databaseErrorConst.context.internal))

            }
        });

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'createNewUser', [user])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);
    }
}


export const updateUser = async (user, update) => {

    try {
        const query = { username: user.username };
        const foundUser = await userModel.findOneAndUpdate(query, update, { new: true }).exec();

        if (!foundUser) {
            throw new DatabaseError('Query not found in database', 406, databaseErrorConst.indentifier, databaseErrorConst.context.updateQueryNotFound);
        }

        return;

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'updateUser', [user, update])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);

    }
}

export const getUser = async (query, overrideError) => {

    try {
        let foundUser = await userModel.findOne(query).lean().exec().then((doc, err) => doc);

        if (!foundUser || foundUser === null) {
            if (overrideError) {
                throw overrideError;
            }
            throw new DatabaseError('Query not found in database', 406, databaseErrorConst.indentifier, databaseErrorConst.context.cannotFind);
        }

        return foundUser;

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'getUser', [query, overrideError])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);
    }
}