import TemplateError from '../errorTemplate/errorTemplate';

export class pageInvalidError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('PageInvalid', message, statusCode, identifier, context);
    }
}


export class webinarPageError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('webinarPageError', message, statusCode, identifier, context)
    }
}


export const pageInvalidConst = {
    identifier: 'page',
    context: {
        pageNotFound: 'page-not-found',
    }
}


export const webinarPageErrorConst = {
    identifier: {
        dates: 'dates',
        webinar: 'webinar'
    },
    context: {
        invalidDates: 'dates-invalid',
        statusUpdateError: 'could-not-update',
        notProvided: 'not-provided',
        notOfTypeNumber: 'not-type-number',
        tooBig: 'too-big',
        forbiddenExpression: 'forbidden-expression'
    }
}

