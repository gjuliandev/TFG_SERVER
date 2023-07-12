import express, { urlencoded } from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { Server , Socket } from 'socket.io';
import * as socket from '../sockets/socket';
import fs from 'fs';

import usuariosRoutes from '../routes/usuarios.route';
import turnosRoutes from '../routes/turnos.route';
import clientesRoutes from '../routes/clientes.route';


class Servidor {
    
    public httpServer: http.Server;
    public httpsServer: https.Server;

    private static _instance: Servidor;

    // CERTIFICADOS CERTBOT
    private credentials = {
        key: fs.readFileSync('/home/gabrieljuliancuellar/.certbot/config/live/api.tfg.gabrieljuliancuellar.es/privkey.pem'),
        cert: fs.readFileSync('/home/gabrieljuliancuellar/.certbot/config/live/api.tfg.gabrieljuliancuellar.es/fullchain.pem'),
        ca: fs.readFileSync('/home/gabrieljuliancuellar/.certbot/config/live/api.tfg.gabrieljuliancuellar.es/chain.pem')
      };
    private app: express.Application;
    private port: string;

    public io;
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT ||'16149';
        this.httpServer = new http.Server(this.app);
        this.httpsServer = new https.Server(this.credentials, this.app);

        this.io = new Server( this.httpsServer, { 
            cors: {
                origin: "*",
                credentials: true
            } 
        });
        
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Escuchamos Sockets
        this.escucharSockets()
    }


    private escucharSockets() {
        console.log('escuchando sockets');
        
        
        
        this.io.on("connection", (cliente) => {
                console.log('cliente conectado');

                // Desconectar
                socket.desconectar( cliente );

                // Cambio de Turno
                socket.cambiarTurno( cliente, this.io );

                // Add Turno devuelve el turno que se va recibir
                socket.getListadoTurnos( cliente, this.io );
        });
    }

    public static get instance() {
        return this._instance || (this._instance = new this() );
    }

    middlewares() {

        // CORS
        this.app.use( cors() );


        //Lectura y parseo del body
        this.app.use( express.json() );
        this.app.use( urlencoded ({extended: true }));

        //Directorio público
        this.app.use(express.static('public'));
    }
    
    routes() {
       this.app.use('/api/users',    usuariosRoutes);
       this.app.use('/api/turnos',   turnosRoutes);
       this.app.use('/api/clientes', clientesRoutes);
    }

    listenHttp()  {

        this.httpServer.listen(this.port , () => {
            console.log('servidor corriendo en el puerto ' + this.port);
        });
    }

    listenHttps()  {

        this.httpsServer.listen(this.port , () => {
            console.log('servidor corriendo en el puerto ' + this.port);
        });
    }
    
}

export default Servidor;