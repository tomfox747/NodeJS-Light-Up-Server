import db from '../db';

const { model, Schema } = db;

const googleCredentialsSchema = new Schema({
    pageName:{ type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false }

}, { collection: 'shadowUsers' });

const googleCredentialsModel = model('shadowUsers', googleCredentialsSchema);

export default googleCredentialsModel;