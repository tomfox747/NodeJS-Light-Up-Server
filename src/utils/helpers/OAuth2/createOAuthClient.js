import { OAuthError, OAuthErrorConst } from '../../helpers/errorHandling/auth/OAuth/OAuth'
import { google } from 'googleapis'
const OAuth2 = google.auth.OAuth2


/********************************
 * createoAuthClient object. Credentials shown will be required from database
 */
const getOAuthClient = (credentials) => {

    try {
        let client = new OAuth2(credentials.clientId, credentials.clientSecret, credentials.redirectUrl)

        client.setCredentials({
            refresh_token: credentials.refreshToken
        })

        return client
    } catch (err) {
        throw new OAuthError('Client setup failed', 500, OAuthErrorConst.indentifier, OAuthErrorConst.context.clientFailed)
    }
}

export default getOAuthClient