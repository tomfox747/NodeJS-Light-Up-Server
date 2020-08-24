import { InternalServerError, internalServerConst } from '../../helpers/errorHandling/server/server';
import { webinarPageError, webinarPageErrorConst } from '../../helpers/errorHandling/pages/pages';
import { hasSpecialChars, specialChars } from '../../helpers/hasSpecialChars';
import {errorlogger, createErrorLog} from '../../../logging/log'

export const webinarInputValidation = ((req, res, next) => {
    try {

        const maxDescriptionCharLen = 600;
        const maxTitleCharLen = 117;
        const maxHostCharLen = 50;

        if (!req.body.webinarObject) {
            throw new webinarPageError('Webinar object not provided', 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.notProvided)
        }

        validateInputDataExistance(req.body.webinarObject, ['host', 'url', 'title', 'description', 'scheduledTime', 'expiredTime', 'activeStatus']);
        let { host, title, description, scheduledTime, expiredTime } = req.body.webinarObject;

        scheduledTime = parseInt(scheduledTime);
        expiredTime = parseInt(expiredTime);

        if (isNaN(scheduledTime) || isNaN(expiredTime)) {
            throw new webinarPageError('Scheduled or expired times must be number', 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.notOfTypeNumber)
        };

        req.body.webinarObject.scheduledTime = scheduledTime;
        req.body.webinarObject.expiredTime = expiredTime;

        if (description.length > maxDescriptionCharLen) {
            throw new webinarPageError('Maximum number of characters for the description exceeded', 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.tooBig)
        }

        if (title.length > maxTitleCharLen) {
            throw new webinarPageError('Maximum number of characters for the title exceeded', 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.tooBig)
        }

        if (host.length > maxHostCharLen) {
            throw new webinarPageError('Maximum number of characters for the host exceeded', 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.tooBig)
        }

        if (hasSpecialChars(description, specialChars.webinarChars)) {
            throw new webinarPageError('Forbidden expression detected in description', 403, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.forbiddenExpression);
        }


        if (hasSpecialChars(title, specialChars.webinarChars)) {
            throw new webinarPageError('Forbidden expression detected in title', 403, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.forbiddenExpression);
        }


        if (hasSpecialChars(host, specialChars.webinarChars)) {
            throw new webinarPageError('Forbidden expression detected in host', 403, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.forbiddenExpression);
        }

        next();

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'webinarInputValidation', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context));
    }

});


const validateInputDataExistance = (inputObject, keys) => {

    keys.map(key => {
        if (!inputObject[key]) {
            throw new webinarPageError(`Request input ${key} not provided`, 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.notProvided);
        };
    });

}


// const webinarObject:{
//     "host":"test host",
//     "url":"www.azoomsite.com",
//     "title":"test webinar",
//     "description":"test webinar description",
//     "scheduledTime":"1586154836",
//     "expiredTime":"1586158436",
//     "activeStatus":"upComing"   
// }