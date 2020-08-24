import axios from 'axios';
import config from '../../config';
import pageSchemaWrapper from '../../schemas/pages/pageSchemaWrapper';
import { DatabaseError, databaseErrorConst } from '../../utils/helpers/errorHandling/db/db';
import { pageInvalidError, pageInvalidConst } from '../../utils/helpers/errorHandling/pages/pages';
import podcastModel from '../../schemas/pages/podcastSchema';
import { videoUploadError, videoUploadConst } from '../../utils/helpers/errorHandling/youtube/upload';
import { InternalServerError, internalServerConst } from '../../utils/helpers/errorHandling/server/server';
import { errorlogger, createErrorLog } from '../../logging/log'

export const saveVideoObject = async (videoObject, pageName) => {

    try{
        const model = pageSchemaWrapper[pageName];

        if (!model) {
            throw new pageInvalidError(`The page ${pageName} could not be found`, 406, pageInvalidConst.identifier, pageInvalidConst.context.pageNotFound);
        }

        let video = new model(videoObject)
        await video.save()
        return

    }catch(error){
        if (error.errorType && error.errorType === 'custom') {
            res.status(error.statusCode ? typeof error.statusCode === 'number' ? error.statusCode : 400 : 400).send(error);
            return;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog("function", error.message, "saveVideoObject", req.body)
        })

        res.status(500).send(new InternalServerError('An internal server error has occured', internalServerConst.identifier, internalServerConst.context));
    }
};


export const retrieveAllVideos = async () => {

    try {

        let videos = await podcastModel.find({}).lean().exec().then((doc, err) => doc);
        if (!videos || videos.length === 0) {
            throw new DatabaseError('Videos not retrieved from database', 500, databaseErrorConst.indentifier, databaseErrorConst.context.videosNotFound)
        }

        return videos

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'retrieveAllVideos', [''])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);
    }
}


export const getYoutubeAccessToken = async (credentials) => {
    try {
        const accessToken = await axios.post(config.GOOGLE_API_ACCESS_TOKEN_URL, {
            "refresh_token": credentials.refreshToken,
            "clientId": credentials.clientId,
            "clientSecret": credentials.clientSecret,
            "grant_type": "refresh_token"
        });

        if (accessToken.status !== 200) {
            throw new videoUploadError('Video upload failed due to error when requesting a usable access token', videoUploadConst.identifier, videoUploadConst.context.accessTokenRequestFailure);
        }

        return { accessToken: accessToken.data.access_token, expiresIn: accessToken.data.expires_in };

    } catch (error) {
        if (error.errorType && error.errorType === 'custom') {
            throw error;
        }

        errorlogger.log({
            level:'error',
            message:createErrorLog('function', error.message, 'getYoutubeAccessToken', [credentials])
        })

        throw new InternalServerError('An internal server has occured', 500, internalServerConst.identifier, internalServerConst.context);
    }

}