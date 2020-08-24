import db from '../db';

const { model, Schema } = db;

const healthCheckSchema = new Schema({
    'input': { type: String, required: true }

}, { collection: 'healthCheck' });

const healthCheckModel = model('healthCheck', healthCheckSchema);

export default healthCheckModel;