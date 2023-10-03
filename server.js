import app from './app/app.js';
import config from './app/config/dbConfig.js';

const port = config.database.port;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default server;