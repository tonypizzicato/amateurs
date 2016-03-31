import consoleStamp from 'console-stamp';

/**
 * Extending default console.* output
 */
export function initConsole() {
    consoleStamp(console, {
        pattern : "dd/mm/yyyy HH:MM:ss.l",
        metadata: () => "[" + (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + "MB]",
        colors:   {
            stamp:    "yellow",
            label:    "white",
            metadata: "green"
        }
    });
};
