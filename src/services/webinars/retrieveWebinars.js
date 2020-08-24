import webinarModel from '../../schemas/webinarSchema'
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db'
import { errorlogger, createErrorLog } from '../../logging/log'

const retrieveWebinars = async () => {
    try {
        let webinars = await webinarModel.find({}).lean().exec().then((doc, error) => doc)

        if (!webinars || webinars.length === 0) {
            throw new DatabaseError('No webinars found', 500, databaseErrorConst.indentifier, databaseErrorConst.context.cannotFind)
        }
        return (webinars)
    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'retrieveWebinars', [''])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);
    }
}

export default retrieveWebinars