import pino from "pino";

const transport = pino.transport({
  targets: [
    { level: "trace", target: "pino/file", options: { destination: `./logs/new.log` } },
    {
      level: "trace",
      target: "pino-pretty",
    },
  ],
});
const logger = pino(transport);
export default logger;
