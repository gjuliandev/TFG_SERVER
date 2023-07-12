import { Router } from 'express';
import { getClienteTurnoActual } from '../controllers/clientes.controller';

const router = Router();

router.get  ('/cliente-actual/:dia',  getClienteTurnoActual   );

export default router;