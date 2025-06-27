type LogLevel = "success" | "error" | "info" | "warn" | "step" | "debug";

interface LoggerConfig {
  silent: boolean;
  minLevel: LogLevel;
  showTimestamp: boolean;
  showIcons: boolean;
  useColors: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  silent: false,
  minLevel: "info",
  showTimestamp: true,
  showIcons: true,
  useColors: process.env.NODE_ENV !== 'production'
};

const LOG_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  step: 2,
  warn: 3,
  success: 4,
  error: 5
};

const LOG_SYMBOLS: Record<LogLevel, string> = {
  success: "✓",
  error: "✗",
  info: "ℹ",
  warn: "⚠",
  step: "→",
  debug: "•"
};

// Colors for development mode only
const getColorizer = (level: LogLevel) => {
  if (!config.useColors) return (text: string) => text;

  let colorize: (text: string) => string;
  try {
    // Only import chalk if colors are enabled
    const chalk = require('chalk');

    const colorMap: Record<LogLevel, any> = {
      success: chalk.green.bold,
      error: chalk.red.bold,
      info: chalk.blue.bold,
      warn: chalk.yellow.bold,
      step: chalk.cyan.bold,
      debug: chalk.gray
    };

    colorize = colorMap[level];
  } catch (e) {
    // Fallback if chalk is not available
    colorize = (text: string) => text;
  }

  return colorize;
};

let config: LoggerConfig = { ...DEFAULT_CONFIG };

export const configureLogger = (newConfig: Partial<LoggerConfig>): void => {
  config = { ...config, ...newConfig };
};

export const setLoggerSilent = (value: boolean): void => {
  config.silent = value;
};

const getTimestamp = (): string => {
  const timestamp = `[${new Date().toLocaleTimeString()}]`;
  return config.useColors ? getColorizer('debug')(timestamp) : timestamp;
};

const getPrefix = (level: LogLevel): string => {
  const symbol = config.showIcons ? LOG_SYMBOLS[level] : '';
  const prefixText = `${symbol} ${level.toUpperCase()}`;
  return getColorizer(level)(prefixText);
};

const formatMessage = (level: LogLevel, message: string, tag?: string): string => {
  const timestamp = config.showTimestamp ? `${getTimestamp()} ` : '';
  const tagStr = tag ? (config.useColors ? getColorizer('info')(`[${tag}] `) : `[${tag}] `) : '';
  return `${timestamp}${getPrefix(level)} ${message} ${tagStr}`;
};

const shouldLog = (level: LogLevel): boolean => {
  if (config.silent) return false;
  return LOG_PRIORITIES[level] >= LOG_PRIORITIES[config.minLevel];
};

export const logger = {
  success: (message: string, tag?: string): void => {
    if (shouldLog('success')) {
      console.log(formatMessage('success', message, tag));
    }
  },
  error: (message: string, error?: Error | unknown, tag?: string): void => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, tag));
      if (error) {
        const errorDetails = error instanceof Error
          ? error.stack || error.message
          : String(error);
        console.error(config.useColors ? getColorizer('error')(errorDetails) : errorDetails);
      }
    }
  },
  info: (message: string, tag?: string): void => {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message, tag));
    }
  },
  warn: (message: string, tag?: string): void => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, tag));
    }
  },
  step: (message: string, tag?: string): void => {
    if (shouldLog('step')) {
      console.log(formatMessage('step', message, tag));
    }
  },
  debug: (message: string, tag?: string): void => {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', message, tag));
    }
  }
};

export const log = logger;