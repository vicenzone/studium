const winston = require('winston')

module.exports = winston.createLogger({
    exitOnError: false,
    transports: [new winston.transports.Console({
        stderrLevels: ['error'],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
                format: 'DD/MM/YYYY HH:mm:ss.SSS',
            }),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
    })],
})