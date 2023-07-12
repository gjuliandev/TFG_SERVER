import mysql, { createPoolCluster } from 'mysql';
import Token from '../classes/token';

class MySql {
    private static _instance: MySql;

    pool: mysql.Pool;
    conectado: boolean = false;

    constructor() {
        this.pool = mysql.createPool({
            host:               'mysql-5707.dinaserver.com',
            user:               'tfg_user',
            password:           'cPkxp9^9&13$',
            database:           'tfg_db',
            multipleStatements: true
        });
    }

    public static get instance() {
        return this._instance || (this._instance = new this() )
    }

    static async ejecutarMainQuery(query: string, params: any[], callback: Function) {

        this.instance.pool.getConnection( (err: any, connection: any)  => {
            if ( err ) {
                return callback( err );
            }

            this.instance.pool.query( query, params, (err, results, fields) => {
                if ( err ) {
                    connection.release();
                    return callback( err );
                }

                connection.release();
                callback(null, results, fields);
            });
        });
    }

    static async ejecutarClientQuery( token: any, query: string, params: any[], callback: Function) {

        let decodeToken: any = '';
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            decodeToken = ( Token.decodeToken(token.slice(7, token.length)) );
        }     
        const clientConnection = mysql.createConnection({
            host: decodeToken.usuario.data.bbddHost,
            database: decodeToken.usuario.data.bbddName,
            password: decodeToken.usuario.data.bbddPass,
            user: decodeToken.usuario.data.bbddUser
        });

        clientConnection.connect( (err) => {
            if(err){ 
                throw err;
            } else{
               console.log('Conexion correcta.');
            }
        });

       clientConnection.query(query, params, (error, results, fields) => {
        if (error ) {
            clientConnection.end();
            return callback(error);
        } else {
            clientConnection.end();
            return callback(null, results, fields);
        }
       });
    }
}


export default MySql;