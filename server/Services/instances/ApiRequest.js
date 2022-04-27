/**
 * Api Instance
 *
 * Configure a new got instance with default options for making requests to Shop backend.
 * The options are merged with the parent instance's defaults.options using got.mergeOptions.
 */
import got from "got";

export default () => {
  return got.extend({
    headers: {
      "Content-Type": "application/json"
    },
    responseType: "json",
    resolveBodyOnly: true
  });
};
