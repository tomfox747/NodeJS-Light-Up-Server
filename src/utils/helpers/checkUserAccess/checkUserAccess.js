import { errorlogger, createErrorLog } from '../../../logging/log'
import usersModel from '../../../schemas/usersSchema'
import { DatabaseError, databaseErrorConst } from '../../helpers/errorHandling/db/db'
import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';

const checkUserAccess = async (accessLevel, requiredAccesslevel) => {
    try {
        return accessLevel.includes(requiredAccesslevel);

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'checkuserAccess', [accessLevel, requiredAccesslevel])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);

    }
}

export default checkUserAccess;