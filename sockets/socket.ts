import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { getTurnosDia } from '../controllers/turnos.controller';


export const desconectar = ( cliente: Socket) => {

    cliente.on('disconnect', () => {
        console.log('cliente desconectado');
    });
}

export const cambiarTurno = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('cambio-turno', (payload) => {
        
        console.log('el nuevo turno es: ' + payload);

        io.emit( 'nuevo-turno', payload);
    });
}

export const getListadoTurnos = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('turnos-updated', (dia) => {
       let turnos: Array<any>;
       let enEspera = 0;
       // emitimos la lista con los nuevos
        getTurnosDia(dia)
            .then( (data: any)  => {
                turnos = data;
                enEspera = turnos.filter( x => x.estado == 1).length;
                io.emit('listado-turnos', data);
                io.emit('en-espera', enEspera);
            });
    });
    
    
       
   
}