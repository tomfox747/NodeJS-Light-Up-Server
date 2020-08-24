import webinarModel from '../../schemas/webinarSchema'
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { errorlogger, createErrorLog } from '../../logging/log'

const storeWebinar = async (webinarObject) => {
    try {

        let webinar = new webinarModel(webinarObject)

        await webinar.save()
        return;

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'storeWebinar', webinarObject)
        })

        throw new DatabaseError('Webinar not stored', 500, databaseErrorConst.indentifier, databaseErrorConst.context.notSaved)
    }
}

export default storeWebinar