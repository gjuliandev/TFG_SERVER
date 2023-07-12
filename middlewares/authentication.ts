import { Response, NextFunction } from 'express';
import Token from '../classes/token';

export const verificaToken = (req: any, res: Response, next: NextFunction) => {

    // const userToken = req.get('x-token') || '';
    let userToken = req.headers['authorization'] || req.get('x-token');
    
    if (userToken && userToken.startsWith('Bearer ')) {
        // Remove Bearer from string
        userToken = userToken.slice(7, userToken.length);
      }
  
    Token.comprobarToken( userToken)
    .then( (decoded: any) => {
        req.usuario = decoded.usuario;
        next();
    })
    .catch ( (error) => {
        res.json({
            ok: false,
            mensaje: error
        })
    });
}