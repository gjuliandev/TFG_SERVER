import { Router } from 'express';
import { getClientesEnEspera, getTurnoActual, nuevoTurno, getTurnosByDia, getServicios, actualizarTurno, getSiguienteTurno, addServicioTurno } from '../controllers/turnos.controller';

const router = Router();

router.get  ('/servicios',            getServicios        );
router.get  ('/turnos-list/:dia',     getTurnosByDia      );
router.get  ('/turno-actual',         getTurnoActual      );
router.get  ('/siguiente-turno/:dia', getSiguienteTurno   );
router.get  ('/clientes-espera/:dia', getClientesEnEspera );
router.put  ('/',                     actualizarTurno     );
router.post ('/',                     nuevoTurno          );
router.post ('/servicio-turno',       addServicioTurno    );
export default router;