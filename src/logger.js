const winston = require('winston');
const path = require('path');
const fs = require('fs-extra');
const { time } = require('console');

const LOG_DIR = path.join(__dirname, '../logs');

// Ensure logs directory exists
fs.ensureDirSync(LOG_DIR);

// Create logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(LOG_DIR, `${new Date().toISOString().split("T")[0]}.log`),
            maxsize: 5 * 1024 * 1024,
            maxFiles: 7,
        }),
    ],
});

/**
 * Logs an informational message.
 * @param {string} message - The message to log.
 */
function logInfo(message) {
    logger.info(message);
}

/**
 * Logs a warning message.
 * @param {string} message - The warning message to log.
 */
function logWarning(message) {
    logger.warn(message);
}

/**
 * Logs an error message.
 * @param {string} message - The error message to log.
 */
function logError(message) {
    logger.error(message);
}

module.exports = { logInfo, logWarning, logError };