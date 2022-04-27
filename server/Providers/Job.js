import moment from "moment-timezone";
import { agenda } from "../agenda";

const { TIMEZONE } = process.env;

// Abstract Job class
export default class Job {
  /**
   * Abstract Class Job constructor
   * @param {object} options
   */
  constructor(options = { priority: "normal", concurrency: 5 }) {
    this.options = options;
    this.scheduleTime = null;
  }

  /**
   * Set schedule time
   * @param {string} schedule datestring - example. Wed Dec 04 2019 11:00:00 GMT+0200
   * @param {string} timeZone
   */
  schedule(schedule, timeZone = null) {
    // Convert schedule time to server timzeone
    let date = moment.tz(schedule, TIMEZONE);

    const [hours, minutes] = [date.hours(), date.minutes()];

    if (!schedule) {
      return this;
    }

    // If timezone passed, need to convert to
    // passed timezone and set hours/minutes
    // and convert back to server timezone
    if (timeZone) {
      date = date
        .clone()
        .tz(timeZone)
        .hours(hours)
        .minutes(minutes)
        .tz(TIMEZONE);
    }

    this.scheduleTime = date.format();

    return this;
  }

  /**
   * Job name
   */
  name() {
    throw new Error("You have to implement the method name.");
  }

  /**
   * Job handle function
   */
  handle() {
    throw new Error("You have to implement the method handle.");
  }

  /**
   * Set job options
   * @param {object} options
   */
  setOptions(options) {
    this.options = options;
  }

  /**
   * Job handle functions
   * @param {object} data
   * @param {string} delay
   */
  async dispatch(data) {
    const job = agenda.create(this.name(), data);

    if (this.scheduleTime) {
      job.schedule(this.scheduleTime, this.name(), data);
      await job.save();
    } else {
      job.run();
    }
  }
}
