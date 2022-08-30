import { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import ApiRequestException from "../../Exceptions/ApiRequestException";
import ShopifyRequest from "../instances/ShopifyRequest";
import dotenv from "dotenv";
dotenv.config();

const { HOST, SCRIPT_PATH } = process.env;

const shopifyApiUrl = shop => `https://${shop}/admin/api/2021-01`;

export default {
   /**
   * Returns a Shop details
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @throws ApiRequestException
   * @returns json
   */
    fetchShopAsync(shop, token) {
      return new Promise(async (resolve, reject) => {
        try {
          const { statusCode, body } = await ShopifyRequest(token).get(
            `${shopifyApiUrl(shop)}/shop.json`
          );

          resolve({ statusCode, payload: body });
        } catch (error) {
          reject(
            new ApiRequestException(
              `Error while fetching Shop details: ${error.message}`
            )
          );
        }
      });
    },

  /**
   * Creates a new script tag
   *
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @param  {string} url Script url
   * @param  {string} event Script load event
   * @throws ApiRequestException
   */
  createScriptTagAsync(shop, token, url, event = "onload") {
    return new Promise(async (resolve, reject) => {
      try {
        const { statusCode, body } = await ShopifyRequest(token).post(
          `${shopifyApiUrl(shop)}/script_tags.json`,
          {
            json: {
              script_tag: {
                event: event,
                src: url
              }
            }
          }
        );

        resolve({ statusCode, payload: body });
      } catch (error) {
        reject(
          new ApiRequestException(
            `Error while adding script tag to Shop: ${error.message}`
          )
        );
      }
    });
  },

  /**
   * View all webhooks
   *
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @throws ApiRequestException
   */
   getAllWebhooks(shop, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const { statusCode, body } = await ShopifyRequest(token).get(
          `${shopifyApiUrl(shop)}/webhooks.json`
        );
        resolve({ statusCode, payload: body });
      } catch (error) {
        resolve({ statusCode: 403, payload: { script_tags: [0] } });
      }
    });
  },

  /**
   * Retrieve a list of all script tags with a particular URL
   * By default Accesibility App Script path
   *
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @param  {string} src Script script tags with this URL.
   * @throws ApiRequestException
   */
  fetchAppScriptTags(shop, token, src = `${HOST}${SCRIPT_PATH}`) {
    return new Promise(async (resolve, reject) => {
      try {
        const { statusCode, body } = await ShopifyRequest(token).get(
          `${shopifyApiUrl(shop)}/script_tags.json?src=${src}`
        );

        resolve({ statusCode, payload: body });
      } catch (error) {
        resolve({ statusCode: 403, payload: { script_tags: [0] } });
        // reject(
        //   new ApiRequestException(
        //     `Error while fetching script tag to Shop: ${error.message}`
        //   )
        // );
      }
    });
  },

  /**
   * Removes script tag by id
   *
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @param  {string} scriptId Script url
   * @param  {string} event Script load event
   * @throws ApiRequestException
   */
  removeScriptTagAsync(shop, token, scriptId) {
    return new Promise(async (resolve, reject) => {
      try {
        const { statusCode, body } = await ShopifyRequest(token).delete(
          `${shopifyApiUrl(shop)}/script_tags/${scriptId}.json`
        );
        resolve({ statusCode, payload: body });
      } catch (error) {
        reject(
          new ApiRequestException(
            `Error while removing script tag to Shop: ${error.message}`
          )
        );
      }
    });
  },

   /**
   * Get Single Order
   *
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @throws ApiRequestException
   */
    getSingleOrder(id, shop, token) {
      return new Promise(async (resolve, reject) => {
        try {
          const { statusCode, body } = await ShopifyRequest(token).get(
            `${shopifyApiUrl(shop)}/orders/${id}.json`
          );
          resolve({ statusCode, payload: body });
        } catch (error) {
          console.log(error);
          resolve({ statusCode: 403, payload: error });
        }
      });
    },

    /**
   * Get Single Order using order name
   *
   * @param  {string} shop Shop name
   * @param  {string} token Shop token
   * @throws ApiRequestException
   */
     getSingleOrderByName(id, shop, token) {
      return new Promise(async (resolve, reject) => {
        try {
          const { statusCode, body } = await ShopifyRequest(token).get(
            `${shopifyApiUrl(shop)}/orders/${id}.json`
          );
          resolve({ statusCode, payload: body });
        } catch (error) {
          console.log(error);
          resolve({ statusCode: 403, payload: error });
        }
      });
    },

}
