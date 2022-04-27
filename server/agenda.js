import Agenda from "agenda";
import RegisterWebhoooks from "./Jobs/RegisterWebhooks";
import { logger } from "./Helpers/logger";

const { DB_URL } = process.env;

// An instance of an agenda
const agenda = new Agenda({ db: { address: DB_URL } });

// Jobs
agenda.define("auth::register webhooks", RegisterWebhoooks.handle);

/**
 * Agenda locks the task down until done() is called or you manually unlock it.
 * The easiest way to unlock all the tasks at once is to intercept the SIGTERM and/or SIGINT signals
 * that the process may receive, and stop all running tasks:
 */
const stopAgendaJobs = async () => {
  logger.info("[SIGTERM/SIGINT][Agenda] stop all locked jobs");

  agenda.stop(function () {
    console.log("[Worker] Agenda stopped.");
    process.exit(0);
  });
};

process.on("SIGTERM", stopAgendaJobs);
process.on("SIGINT", stopAgendaJobs);

export { agenda };
