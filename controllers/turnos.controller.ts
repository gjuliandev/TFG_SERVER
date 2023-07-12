import {Request, Response} from 'express';
import MySQL from '../db/mysql';
import Token from '../classes/token';
import logger from '../logger/logger';

export const getTurnosByDia = (req: Request, res: Response ) => {

    const { dia } = req.params;  // nos llega el dia 
    
    const query = `SELECT t.id, t.numero, GROUP_CONCAT(s.nombre) as servicios, t.created_at as hora_asignacion, 
                    TIMESTAMPDIFF(MINUTE, t.created_at, t.hora_llamada) as tiempo_espera
                    FROM tfg_turno t
                    INNER JOIN tfg_turno_servicios ts
                    ON t.id = ts.turno_id
                    INNER JOIN tfg_servicio s
                    ON s.id = ts.servicio_id
                    WHERE DATE(t.created_at) = '${dia}'
                    GROUP BY t.numero
                    ORDER BY t.numero DESC`;

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

export const getTurnoActual = (req: Request, res: Response ) => { 
    
    const query = `SELECT MAX(numero) as turno
                   FROM tfg_turno 
                   WHERE DATE(hora_llamada) = DATE(NOW())`;

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

export const getSiguienteTurno = (req: Request, res: Response ) => {

    const { dia } = req.params;  // nos llega el dia 
    
    const query = `SELECT MAX(numero) + 1 AS turno
                   FROM tfg_turno 
                   WHERE DATE(created_at) = '${dia}'`;

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

export const nuevoTurno = (req: Request, res: Response ) => {

    const { clienteID } = req.body;  // nos llega el dia 

    const query = `INSERT INTO tfg_turno (cliente_id, estado )
                    VALUES (${clienteID}, 1); `;
    // const query = `call sp_add_turno(?)`;
    // const campos = [clienteID]

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

export const actualizarTurno = (req: Request, res: Response ) => {

    const { numero, fecha } = req.body;  // nos llega el dia
    
    const query = `UPDATE tfg_turno SET estado = 2, hora_llamada='${fecha}'
                     WHERE id=${numero}`;
    
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

export const getClientesEnEspera = (req: Request, res: Response ) => {

    const { dia } = req.params;  // nos llega el dia 
    
    const query = `SELECT count(id) as nClientes
                   FROM tfg_turno 
                   WHERE DATE(created_at) = '${dia}' AND estado = 1 `;

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

export const getServicios = (req: Request, res: Response ) => {

    const { dia } = req.body;  // nos llega el dia 
    
    const query = `SELECT id, nombre, duracion 
                   FROM tfg_servicio`;

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

export const addServicioTurno = (req: Request, res: Response ) => {

    const { turno_id, servicio_id } = req.body;  // nos llega el dia 
    
    const query = `INSERT INTO tfg_turno_servicios (turno_id, servicio_id)
                    VALUES (${turno_id}, ${servicio_id})`;

    console.log(req.body);
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

export const getTurnosDia = async (dia: string) => {

    return new Promise( (resolve, reject) => {
        const query = `SELECT t.id, t.numero, GROUP_CONCAT(s.nombre) as servicios, t.created_at as hora_asignacion, 
                    TIMESTAMPDIFF(MINUTE, t.created_at, t.hora_llamada) as tiempo_espera, t.estado
                    FROM tfg_turno t
                    INNER JOIN tfg_turno_servicios ts
                    ON t.id = ts.turno_id
                    INNER JOIN tfg_servicio s
                    ON s.id = ts.servicio_id
                    WHERE DATE(t.created_at) = '${dia}'
                    GROUP BY t.numero
                    ORDER BY t.numero DESC`;
                    
        MySQL.ejecutarMainQuery(query, [], (err: any, turnos: Object) => {
            if (err) {
                reject(err);
            }
            resolve(turnos);
        });
    });
}

