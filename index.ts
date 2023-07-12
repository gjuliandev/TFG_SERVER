import dotenv from 'dotenv';
import Servidor from './classes/servidor';

// Configurar dotenv
dotenv.config();

const servidor = new Servidor();

// servidor.listenHttp();
servidor.listenHttps();
