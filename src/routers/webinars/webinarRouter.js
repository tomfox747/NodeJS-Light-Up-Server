import express from 'express'
import storeWebinar from '../../services/webinars/storeWebinar'
import verifyDateTime from '../../utils/helpers/webinars/verifyDateTime'
import retrieveWebinars from '../../services/webinars/retrieveWebinars'
import webinarCleanup from '../../services/webinars/webinarCleanup'
import { jwtAuthentication } from '../../utils/middleware/auth/jwtAuthentication';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server'
import { webinarPageError, webinarPageErrorConst } from '../../utils/helpers/errorHandling/pages/pages'
import { webinarInputValidation } from '../../utils/middleware/validation/webinarVal';
import checkUserAccess from '../../utils/helpers/checkUserAccess/checkUserAccess';
import { AuthenticationError, AuthenticationConst } from '../../utils/helpers/errorHandling/auth/jwt/jwt';
import userAccessLevels from '../../utils/helpers/constants/userAccessLevels';
import { eventLogger, createEventLog } from '../../logging/log'

const router = express.Router()

router.post('/create', webinarInputValidation, jwtAuthentication, async (req, res) => {

    try {

        let allowed = await checkUserAccess(req.body.user.accessLevel, userAccessLevels.admin);
        if (!allowed) {
            throw new AuthenticationError('Access level not sufficient', 401, AuthenticationConst.identifier.accessAuth, AuthenticationConst.context.accessLevelNotSufficient)
        }

        let webinarObject = req.body.webinarObject

        const verified = await verifyDateTime(webinarObject)
        if (!verified) {
            throw new webinarPageError('Dates invalid', 406, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.pageNotFound)
        }
        await storeWebinar(webinarObject)

        eventLogger.log({
            level:'info',
            message:createEventLog("A new webinar has been uploaded", webinarObject)
        })

        res.status(200).send("webinar has been uploaded")

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/webinar/create', error.message, '/create', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
})


router.get('/retrieve', jwtAuthentication, async (req, res) => {

    try {
        //perform webinar clean up here
        await webinarCleanup()
        let webinars = await retrieveWebinars()
        res.status(200).send(webinars)
    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/webinar/retrieve', error.message, '/webinar/retrieve', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
})

export default router