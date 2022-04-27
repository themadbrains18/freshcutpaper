/**
 * Shopify Instance
 *
 * Configure a new got instance with default Shopify options for making requests.
 * Automatically adds Shopify access token headers.
 */
import got from "got";

export default token => {
  return got.extend({
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json"
    },
    responseType: "json"
  });
};
