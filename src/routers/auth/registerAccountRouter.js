import express from 'express';
import validateRegisterAccountInputs from '../../utils/middleware/validation/registerAccountVal';
import { createNewUser } from '../../services/user/userService';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { errorlogger, createErrorLog } from '../../logging/log'
import { eventLogger, createEventLog } from '../../logging/log'

const router = express.Router();

router.post('/', validateRegisterAccountInputs, async (req, res) => {

    // First validate input
    try {
        const { username, email, password } = req.body.user;
        await createNewUser({ username, email, password });

        eventLogger.log({
            level:'info',
            message:createEventLog("a new account has been created", {"username":username, "email":email})
        })

        res.status(201).send()

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/register/', error.message, '/', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
});


export default router;