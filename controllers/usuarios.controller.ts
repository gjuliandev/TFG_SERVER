import {Request, Response} from 'express';
import MySQL from '../db/mysql';
import md5 from 'md5';
import Token from '../classes/token';
import logger from '../logger/logger';
import path from 'path';
import fs from 'fs';

export const loginUsuario = (req: Request, res: Response ) => {

    const { body } = req;
    const username = body.credentials.login || '';
    const password = body.credentials.password || '';

    const query = `SELECT username, password FROM tfg_user
                   WHERE username = '${username}' 
                   LIMIT 1` ;

    MySQL.ejecutarMainQuery(query, [], (err: any, usuarioDB: any[]) => {
        
        if ( err ) {
            logger.info(Date()+';'+'Error'+';'+`/api/usuarios/login;usuario=${username}`);
            return res.status(400).json({
                ok: false,
                error: err
            });
        } else {

            if (!usuarioDB[0]) {
                logger.info(Date()+';'+'Error'+';'+`/api/usuarios/login;usuario=${username}`);
                return res.status(401).json ({
                    ok: false,
                    error: 'credenciales incorrectas nombre usuario',
                    body: body
                });
            }
        
          
            if ( md5(password) !==  usuarioDB[0].password) {
                logger.info(Date()+';'+'Error'+';'+`/api/usuarios/login;usuario=${username}`);
                return res.status(401).json({
                    ok: false,
                    error: 'credenciales incorrectas password',
                    body: body
                });

            }
           
            const userToken = Token.getJwtToken({
                data: usuarioDB[0]
            });
            const user = { 
                nombre: usuarioDB[0].username,
                email: usuarioDB[0].email,
                role: usuarioDB[0].role,
            }

            logger.info(Date()+';'+'Success'+';'+`/api/usuarios/login;usuario=${username}`);
            return res.status(200).json({
                payload: user,
                token: userToken            
            });
        }
    });  
}

export const resetPassword = (req: Request, res: Response ) => {

    const idUsuario = Number(req.params.id); // Obtenemos el id del usuario que vamos a actualizar.
    const { body } = req;                   // En el body están todos los datos del usuario.abs
    const password = md5(body.password);
    const query = 'UPDATE tfg_user SET password = ? WHERE id = ?';
    const campos = [password, idUsuario];

    MySQL.ejecutarMainQuery(query, campos, (err: any, usuarioDB: Object) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.status(200).json({
                ok: true,
                payload: usuarioDB
            });
        }
    });     
}