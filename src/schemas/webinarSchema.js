import db from '../db'

const { model, Schema } = db;

const webinarSchema = new Schema({
    'host': { type: String, required: true },
    'url': { type: String, required: true },
    'title': { type: String, required: true },
    'description': { type: String, required: true },
    'scheduledTime': { type: Number, required: true },
    'expiredTime': { type: Number, required: true },
    'activeStatus': { type: String, required: true }
}, { collection: 'webinars' })

const webinarModel = model('webinars', webinarSchema);

export default webinarModel;