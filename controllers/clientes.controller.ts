import {Request, Response} from 'express';
import MySQL from '../db/mysql';
import Token from '../classes/token';
import logger from '../logger/logger';

export const getClienteTurnoActual = (req: Request, res: Response ) => {

    const { dia } = req.params;  // nos llega el dia 
    
    const query = `SELECT c.apyn as cliente
                   FROM tfg_cliente as c
                   WHERE c.id = (SELECT cliente_id 
                                FROM tfg_turno
                                WHERE DATE(hora_llamada) = '${dia}'
                                ORDER BY numero DESC
                                LIMIT 1
                                )`;

    MySQL.ejecutarMainQuery(query, [], (err: any, turno: Object) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                error: err 
            });
        } else {
            res.status(200).json({
                payload: turno
            });
        }
    });     
}