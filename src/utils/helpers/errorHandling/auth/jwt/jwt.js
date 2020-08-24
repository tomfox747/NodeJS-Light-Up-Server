import TemplateError from '../../errorTemplate/errorTemplate';

export class AuthenticationError extends TemplateError {
    constructor(message, statusCode, identifier, context) {
        super('AuthenticationError', message, statusCode, identifier, context);
    }
}

export const AuthenticationConst = {
    identifier: {
        authentication: 'authentication',
        accessAuth: 'access-auth',
        jwtAuth: 'jwt-auth',
        passwordAuth: 'password-auth'
    },
    context: {
        refreshTokenNotProvided: 'refresh-token-not-provided',
        accessLevelNotSufficient: 'access-level-not-sufficient',
        passwordNotCorrect: 'password-not-correct',
        usernameNotCorrect: 'username-not-correct',
        accessTokenNotProvided: 'access-token-not-provided',
        audienceNotProvided: 'audience-not-provided',
        authHeaderNotProvided: 'auth-header-not-provided',
        audienceHeaderNotProvided: 'audience-header-not-provided',
        userRefreshTokenNotFound: 'refresh-token-not-found',
        userAlreadyLoggedIn: 'user-already-logged-in',
        userIsNotLoggedIn: 'user-is-not-logged-in',
        invalidPayload: 'invalid-payload',
        invalidaudience: 'invalid-audience'
    }
}
