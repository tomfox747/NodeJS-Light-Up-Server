import app from "./app";
import config from './config';

const port = config.SERVER_PORT;

app.listen(port, () => console.log(`Listening on port ${port}`));