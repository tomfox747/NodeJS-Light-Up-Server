import TemplateError from '../errorTemplate/errorTemplate';

export class videoUploadError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('videoUploadFailed', message, statusCode, identifier, context);
    }
}

export const videoUploadConst = {
    identifier: 'upload',
    context: {
        videoUploadFailed: 'video-upload-failed',
        accessTokenRequestFailure: 'access-token-request-failure'
    }
}