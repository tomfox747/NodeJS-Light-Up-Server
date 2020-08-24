import googleCredentialsModel from '../../schemas/googleCredentialsSchema'
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { errorlogger, createErrorLog } from '../../logging/log'

const getGoogleCredentials = async pageName => {

    try {
        const credentials = await googleCredentialsModel.findOne({ pageName: pageName }).lean().exec().then((doc, err) => ({
            clientId: doc.clientId,
            clientSecret: doc.clientSecret,
            redirectUrl: doc.redirectUrl,
            refreshToken: doc.refreshToken,
            accessToken: doc.accessToken
        }));

        if (!credentials) {
            throw new DatabaseError('Credentials not found in database', 406, databaseErrorConst.indentifier, databaseErrorConst.context.credentialNotFound);
        }
        return credentials;

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'getGoogleCredentials', [pageName])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);
    }
}

export default getGoogleCredentials