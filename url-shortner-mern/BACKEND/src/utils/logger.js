// src/utils/logger.js
import pino from "pino";
import pretty from "pino-pretty";
import chalk from "chalk";

const isDev = process.env.NODE_ENV !== "production";

let stream;

if (isDev) {
  stream = pretty({
    colorize: true,
    // Color the level labels (INFO, WARN, etc.)
    customColors: {
      info: "green",
      warn: "yellow",
      error: "red",
      debug: "blue",
    },

    // ─── Custom message format ───────────────────────────────
    messageFormat: (log, messageKey) => {
      const msg = log[messageKey] || "";

      // 1. Choose colour for the entire message based on log level
      let coloredMsg;
      if (log.level === 30) {
        // info
        coloredMsg = chalk.green(msg);
      } else if (log.level === 40) {
        // warn
        coloredMsg = chalk.yellow(msg);
      } else if (log.level === 50) {
        // error
        coloredMsg = chalk.red(msg);
      } else if (log.level === 20) {
        // debug
        coloredMsg = chalk.blue(msg);
      } else {
        coloredMsg = msg; // fallback (trace, etc.)
      }

      // 2. Add visual prefix based on error type (if the log contains it)
      if (log.isOperational === true) {
        return `⚠️  ${coloredMsg}`;
      }
      if (log.isOperational === false) {
        return `🔥 ${coloredMsg}`;
      }
      // Normal success messages (no error info)
      return `   ${coloredMsg}`;
    },

    // Optional: hide pid & hostname for a cleaner look
    ignore: "pid,hostname",
  });
} else {
  // Production → raw JSON, no colouring
  stream = process.stdout;
}

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
  },
  stream
);
