import db from '../db';

const { model, Schema } = db;

const usersSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    accessLevel: { type: Array, required: true },
    refreshToken: { type: String }

}, { collection: 'users' });

const usersModel = model('users', usersSchema);

export default usersModel;