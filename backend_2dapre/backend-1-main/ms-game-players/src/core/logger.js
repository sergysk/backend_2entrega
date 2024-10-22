import { createLogger, format, transports } from 'winston';

// ref: https://stackoverflow.com/questions/51012150/winston-3-0-colorize-whole-output-on-console
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Only logging to stdout
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        logFormat
    ),
    transports: [
        new transports.Console()
    ]
});

export default logger;