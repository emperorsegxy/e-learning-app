import winston, { format, createLogger, transports } from 'winston'

const { printf, timestamp, combine, colorize } = format

const customFormat =
    printf(({ level, message, label, timestamp }) => {
        // label = `${!!label ? `[${label.toUpperCase()}]` : ''}`
        return `${timestamp} ${label} ${level}: ${message}`.trim()
    })

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

export type LoggerLevel = keyof typeof levels

const level = (): LoggerLevel => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const transportsList = [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log' })
]

export default createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        colorize({ all: true }),
        customFormat
    ),
    level: level(),
    levels,
    transports: transportsList
})
