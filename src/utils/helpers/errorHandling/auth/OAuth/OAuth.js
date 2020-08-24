import TemplateError from '../../errorTemplate/errorTemplate';

export class OAuthError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('OAuthError', message, statusCode, identifier, context);
    }
}

export const OAuthErrorConst = {
    indentifier: 'OAuth',
    context: {
        clientFailed:'could-not-create-client'
    }
}