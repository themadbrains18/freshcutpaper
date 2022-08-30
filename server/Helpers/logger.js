import * as winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf } = winston.format;

const errorStackTracerFormat = winston.format((info) => {
  if (info.meta && info.meta instanceof Error) {
    info.message = `${info.message} ${info.meta.stack}`;
  }
  return info;
});

export const logger = winston.createLogger({
  level: "error",
  format: combine(
    timestamp(),
    winston.format.splat(),
    errorStackTracerFormat(),
    winston.format.simple()
  ),
  defaultMeta: {},
  transports: [
    // - Write to all logs with level `debug` and below to `all.log`
    // - Write all logs error (and below) to `error.log`.

    new winston.transports.DailyRotateFile({
      datePattern: "DD-MM-YYYY",
      filename: `logs/error.log`,
      level: "error",
    }),
    new winston.transports.DailyRotateFile({
      datePattern: "DD-MM-YYYY",
      filename: `logs/all.log`,
      level: "debug",
    }),
  ],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
