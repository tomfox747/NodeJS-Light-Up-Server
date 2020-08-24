import { retrieveAllVideos, saveVideoObject } from '../../services/videos/videosService';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { jwtAuthentication } from '../../utils/middleware/auth/jwtAuthentication';
import usernameInputValidation from '../../utils/middleware/validation/usernameVal';
import getGoogleCredentials from '../../services/OAuth2/getGoogleCredentials';
import checkUserAccess from '../../utils/helpers/checkUserAccess/checkUserAccess';
import { getYoutubeAccessToken } from '../../services/videos/videosService'
import userAccessLevels from '../../utils/helpers/constants/userAccessLevels';
import { AuthenticationError, AuthenticationConst } from '../../utils/helpers/errorHandling/auth/jwt/jwt';
import { errorlogger, createErrorLog } from '../../logging/log'
import { eventLogger, createEventLog } from '../../logging/log'

import express from 'express'

const router = express.Router()

router.get('/retrieve-podcasts', jwtAuthentication, async (req, res) => {
    try {
        //make database case call to return all videos
        let videos = await retrieveAllVideos()
        res.status(200).send(videos)

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('video/retrieve-podcasts', error.message, 'retrieve-podcasts', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
})



router.get('/get-youtube-access-token', jwtAuthentication, async (req, res) => {

    try {
        let allowed = await checkUserAccess(req.body.user.accessLevel, userAccessLevels.admin);
        if (!allowed) {
            throw new AuthenticationError('Access level not sufficient', 401, AuthenticationConst.identifier.accessAuth, AuthenticationConst.context.accessLevelNotSufficient)
        }

        const credentials = await getGoogleCredentials(req.body.pageName);
        const youtubeAccessToken = await getYoutubeAccessToken(credentials);
        res.status(200).send(youtubeAccessToken);

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('video/get-youtube-access-token', error.message, '/get-youtube-access-token', req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
});

router.post('/save-video-object', jwtAuthentication, async (req,res) =>{
    try{
        await saveVideoObject(req.body.videoObject, req.body.pageName)

        eventLogger.log({
            level:'info',
            message:createEventLog("a new video has been uploaded to the database", {"videoData":req.body.videoObject, "pageName":req.body.pageName})
        })

        res.status(200).send("the video has been saved")
    }catch(error){
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.status|Code ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('/video/save-video-object', error.message, 'save-video-object', req.body)
        })
        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context))
    }
})

export default router