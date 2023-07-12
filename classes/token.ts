import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string ="semilla-para-generar-token-tp-server";
    private static caducidad: string = '1d';

    constructor() {}

    static getJwtToken( payload: any ): string {
        return jwt.sign(
            {usuario: payload}, 
            this.seed, 
            {expiresIn: this.caducidad}
        );
    }

    static comprobarToken( userToken: string ) {
        return new Promise( (resolve, reject) => {
            jwt.verify(userToken, this.seed, (err: any, decoded: any) => {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        } );
    }

    static decodeToken( token: string = '') {
        var decoded = jwt.decode(token);
        // get the decoded payload and header
        // var decoded = jwt.decode(token, {complete: true});
        return jwt.decode(token);
    }
}