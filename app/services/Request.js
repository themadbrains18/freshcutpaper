/**
 * Quick Singleton Request class
 * to wrap axios instance and append request headers
 * so we wouldn't need to pass session cookies in each getInitialProps
 */
import axios from "axios";

let instance = null;

const config = {
  baseURL: `${typeof HOST !== "undefined" ? HOST : "localhost"}/api`,
  headers: {
    "Content-Type": "application/json"
  }
};
class Request {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.request = axios.create(config);

    return instance;
  }

  setHeader(key, value) {
    this.request.defaults.headers[key] = value;
  }

  request() {
    return this.request;
  }
}

export default Request;
