import setupDb from './utils/helpers/db/setupDb';
import config from './config';

const { CONNECTION_STRING, DB_NAME } = config;

const db = setupDb(CONNECTION_STRING, DB_NAME);

export default db;