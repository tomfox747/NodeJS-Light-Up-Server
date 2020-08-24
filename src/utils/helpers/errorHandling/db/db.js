import TemplateError from '../errorTemplate/errorTemplate';

export class DatabaseError extends TemplateError {
    constructor(message, statusCode, indentifier, context) {
        super('DatabaseError', message, statusCode, indentifier, context);
    }
}

export const databaseErrorConst = {
    indentifier: 'database',
    context: {
        cannotFind: 'cannot-find',
        credentialNotFound: 'credentials-not-found',
        internal: 'internal',
        updateQueryNotFound: 'update-query-not-found',
        videosNotFound: 'videos-not-found',
        notSaved: 'data-not-daved'
    }
}
