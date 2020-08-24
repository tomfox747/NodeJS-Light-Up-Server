import TemplateError from '../errorTemplate/errorTemplate';

export class userInvalidError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('RegisterAccountUserInvalid', message, statusCode, identifier, context);
    }
}

export class usernameInvalidError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('RegisterAccountUsernameInvalid', message, statusCode, identifier, context);
    }
}

export class passwordInvalidError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('RegisterAccountPasswordInvalid', message, statusCode, identifier, context);
    }
}

export class emailInvalidError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('RegisterAccountEmailInvalid', message, statusCode, identifier, context)
    }
}


export const usernameInvalidConst = {
    identifier: 'username',
    context: {
        usernameNotProvided: 'username-not-provided',
        forbiddenExpression: 'forbidden-expression',
        tooBig: 'too-big',
        tooSmall: 'too-small',
        notUnique: 'not-unique'
    }
}

export const passwordInvalidConst = {
    identifier: 'password',
    context: {
        notProvided: 'not-provided',
        forbiddenExpression: 'forbidden-expression',
        noLettersOrNumbers: 'no-letters-or-numbers',
        tooBig: 'too-big',
        tooSmall: 'too-small'
    }
}

export const emailInvalidConst = {
    identifier: 'email',
    context: {
        notProvided: 'not-provided',
        notValid: 'not-valid'
    }
}

export const userInvalidConst = {
    identifier: 'user',
    context: {
        userNotProvided: 'user-not-provided'
    }
}

