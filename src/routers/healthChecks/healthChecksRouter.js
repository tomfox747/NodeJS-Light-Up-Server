import express from 'express';
import { createHealthCheck } from '../../services/healthChecks/healthCheckService';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';


const router = express.Router();

router.post('/', async (req, res) => {

    try {
        await createHealthCheck({ input: 'Health Check Success in db!' })
        res.status(200).send('Health Check Success!');

    } catch (error) {

        if (error.errorType && error.errorType === 'custom') {
            res.status(400).send(error);
            return;
        }

        res.status(500).send(new InternalServerError('Internal Server Error', internalServerConst.identifier, internalServerConst.context));
    }

});

export default router;
