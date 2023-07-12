const winston = require('winston');
require('winston-daily-rotate-file');

import fs from 'fs';
import path from 'path';
const logDir = process.cwd() + '/logs';

// Comprobamos que exista el directorio de logs.
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var transport = new winston.transports.DailyRotateFile( {
    filename : '%DATE%-trackin.log',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir,
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '90d'
});

const logger = winston.createLogger({
    transports:  [
        new winston.transports.Console(),
        transport
    ]
});

export = logger;