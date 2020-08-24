import db from '../../db';

const { model, Schema } = db;

const podcastSchema = new Schema({
    ID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publishedAt: { type: String, required: true },
    author: { type: String, required: true },
    lightUps: { type: Number, required: false },
}, { collection: 'podcasts' });

const podcastModel = model('podcasts', podcastSchema);

export default podcastModel;