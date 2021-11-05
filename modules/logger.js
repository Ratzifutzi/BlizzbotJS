import winston from "winston";
import "winston-daily-rotate-file";

const { createLogger, format, transports } = winston;

const logger = createLogger({
    level: "silly",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    defaultMeta: { service: "blizzbot" },
    transports: [
        new transports.File({
            filename: "error.log",
            dirname: "logs",
            level: "error",
        }),
        new transports.DailyRotateFile({
            dirname: "logs",
            createSymlink: true,
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD_HH",
            zippedArchive: true,
            maxFiles: "14d",
            symlinkName: "latest.log",
        }),
    ],
});

logger.add(new transports.Console({
    format: format.combine(
        format.colorize(),
        format.simple(),
    ),
    level: "info",
}));
process.on("uncaughtException", error => logger.log("error", error));

export default logger;