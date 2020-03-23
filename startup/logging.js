require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');

module.exports = function () {
    // This is a replacement for process.on('uncaughtException', handler)
    winston.exceptions.handle(new winston.transports.File({
        filename: 'exceptions.log'
    }));

    //This is done to call winston exception handler in case of UnHandled Rejections too.
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
    winston.add(new winston.transports.File({
        filename: 'logFile.log'
    }));
    // winston.add(new winston.transports.MongoDB({
    //     db: config.get("db")
    // }));
};