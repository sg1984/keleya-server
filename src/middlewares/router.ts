import * as express from 'express';
import {singUp, update, logIn} from '../controllers/user-controller';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require ('../../swagger.json');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.post("/api/users", singUp);
router.post("/api/users/auth", logIn);
router.patch("/api/users", update);
router.use(function (req: any, res: any) {
    res.status(404);
    res.send({ erro_code: 'URL_NOT_FOUND', msg: "Lame, can't find that" });
    res.end();
  });  

export default router;