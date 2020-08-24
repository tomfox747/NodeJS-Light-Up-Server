import healthCheckModel from '../../schemas/healthCheckSchema';
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db';
import { logger, formatErrorLog } from '../../logging/log'


export const createHealthCheck = healthCheckObject => {

    let user = new healthCheckModel(healthCheckObject);
    return new Promise(async (success, fail) => {

        try {
            await user.save()
            success()

        } catch (e) {
            logger.log({
                level:'error',
                message:formatErrorLog('', error.message, 'createHealthCheck', [healthCheckObject], '')
            })
            fail(new DatabaseError('Health check data did not save', databaseErrorConst.indentifier, databaseErrorConst.context.notSaved))
        }
    });
};