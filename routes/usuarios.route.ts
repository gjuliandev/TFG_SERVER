
import { Router } from 'express';
import { loginUsuario, resetPassword } from '../controllers/usuarios.controller';

const router = Router();

router.put  ('/reset-password/:id', resetPassword);
router.post ('/login',              loginUsuario);

export default router;