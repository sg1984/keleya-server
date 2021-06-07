import express from 'express';
import cors from 'cors';
import config from './config/base';
import router from './middlewares/router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.serverPort, () => {
  console.log(`now listening for requests on port ${config.serverPort}`);
});

app.use("/", router);

export default app;