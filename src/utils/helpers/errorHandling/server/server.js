import TemplateError from '../errorTemplate/errorTemplate';

export class InternalServerError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('InternalServerError', message, statusCode, identifier, context);
    }
}

export const internalServerConst = {
    identifier: 'server',
    context: 'internal-server'
}