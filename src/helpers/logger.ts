import winston from 'winston';

export type Logger = winston.Logger & {
    child: (opts: { type: string }) => Logger;
};

/**
 * Crée un logger Winston custom avec un "type" (nom) pour chaque logger/enfant.
 * @param type Le nom/type du logger (ex: "SERVER", "DB", "API"…)
 */
export function makeLogger(type: string): Logger {
    const customFormat = winston.format.printf(({ timestamp, level, message, type }) => {
        return `[${type || 'APP'}] [${level}] [${timestamp}] ${message}`;
    });

    const baseLogger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format((info) => {
                info.type = type;
                return info;
            })(),
            customFormat
        ),
        transports: [new winston.transports.Console()],
    }) as Logger;

    baseLogger.child = function ({ type: childType }: { type: string }) {
        return makeLogger(childType);
    };

    return baseLogger;
}
