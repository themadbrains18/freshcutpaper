import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import shopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import mount from "koa-mount";
import serve from "koa-static";
import session from "koa-session";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import apiRouter from "./routes";
import ShopifyApi from "./Services/api/Shopify";
import http2 from "http2";
import fs from "fs";

// import RedisStore from './Helpers/redis-store';
import * as handlers from "./handlers/index";

import ShopController from "./Http/Controllers/Api/ShopController";

// Models
import Shop from "./Models/Shop";
import ShopAccessToken from "./Models/ShopAccessToken";

const mongoose = require("mongoose");

const chalk = require("chalk");

// const cookies = new Cookies();

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const serverPort = process.env.NODE_PORT || 8081;
const serverUseSSL = process.env.NODE_USE_SSL || false;
const serverSSLCert = process.env.NODE_SSL_CERT || null;
const serverSSLKey = process.env.NODE_SSL_KEY || null;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

// const sessionStorage = new RedisStore();
const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  HOST,
  SCRIPT_PATH,
  DB_URL,
  SCOPES,
} = process.env;

console.log('server IP Address',HOST);

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(cors());
  server.use(bodyParser());

  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );

  server.use(
    shopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      accessMode: "offline",
      async afterAuth(ctx) {
        const { shop, accessToken, scope } = ctx.state.shopify;
        console.log("afterAuth ", shop);
        const host = ctx.query.host;
        console.log("host", host);
        const redirectUrl = `/?shop=${shop}&host=${host}`;

        // Access token and shop available in ctx.state.shopify
        ACTIVE_SHOPIFY_SHOPS[shop] = true;

        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        const scriptTagResponse = await ShopifyApi.fetchAppScriptTags(
          shop,
          accessToken
        );

        const { script_tags } = scriptTagResponse.payload;
          console.log('======',SCRIPT_PATH,'=========');
        if (script_tags.length === 0) {
          console.log('======',SCRIPT_PATH);
          await ShopifyApi.createScriptTagAsync(
            shop,
            accessToken,
            `${HOST}${SCRIPT_PATH}`
          );
        }

        const existingShopModel = await Shop.findByDomain(shop);

        if (existingShopModel) {
          await ShopAccessToken.findOneAndUpdate(
            { shop: existingShopModel },
            { access_token: accessToken },
            { upsert: true, new: true }
          ).exec();

          await handlers.registerWebhooks(
            shop,
            accessToken,
            "ORDERS_CREATE",
            `/api/webhooks/order-created`,
            ApiVersion.July19
          );

          // Register webhooks
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "ORDERS_FULFILLED",
            `/api/webhooks/order-fullfilled`,
            ApiVersion.July19
          );

          await handlers.registerWebhooks(
            shop,
            accessToken,
            "APP_UNINSTALLED",
            `/api/webhooks/app-uninstalled`,
            ApiVersion.July19
          );
        }

        if (existingShopModel) {
          ctx.redirect(redirectUrl);
          return;
        }

        try {
          // Fetch Shop Details
          const shopDetails = await ShopifyApi.fetchShopAsync(
            shop,
            accessToken
          );

          let data = new Shop({
            shop: shop,
            accessToken: accessToken,
            store_info: shopDetails.payload.shop,
          });

          data
            .save()
            .then(async () => {})
            .catch(async (err) => {});

          // Register webhooks
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "ORDERS_CREATE",
            `/api/webhooks/order-created`,
            ApiVersion.July19
          );

          // Register webhooks
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "ORDERS_FULFILLED",
            `/api/webhooks/order-fullfilled`,
            ApiVersion.July19
          );

          await handlers.registerWebhooks(
            shop,
            accessToken,
            "APP_UNINSTALLED",
            `/api/webhooks/app-uninstalled`,
            ApiVersion.July19
          );

          // Redirects to shopify app
          ctx.redirect(redirectUrl);
        } catch (err) {
          // console.log(err);
          //logger.error(err);
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(redirectUrl);
      },
    })
  );

  const handleRequest = async (ctx) => {
    console.log('check handle request=========');
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear

  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );

  // router.get("(.*)", async (ctx) => {
  //   let shop = ctx.query.shop;
  //   await handleRequest(ctx);
  //   // This shop hasn't been seen yet, go through OAuth to create a session
  //   // if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
  //   //   ctx.redirect(`/auth?shop=${shop}`);
  //   // } else {
  //   //   await handleRequest(ctx);
  //   // }
  // });

  server.use(router.allowedMethods());
  server.use(mount("/public", serve("./public")));
  server.use(apiRouter.routes());
  server.use(router.routes());
  if (serverUseSSL) {
    if (null === serverSSLKey || null === serverSSLCert) {
      throw "HTTPS certificate or key is not defined";
    }

    // const privateKey = fs.readFileSync('/etc/letsencrypt/live/mdbtesting.xyz/privkey.pem', 'utf8'); // key
    // const certificate = fs.readFileSync('/etc/letsencrypt/live/mdbtesting.xyz/cert.pem', 'utf8'); // certificate
    // const ca = fs.readFileSync('/etc/letsencrypt/live/mdbtesting.xyz/chain.pem', 'utf8');

    // const options = {
    //   cert: certificate, //fs.readFileSync(serverSSLCert),
    //   key: privateKey, ///fs.readFileSync(serverSSLKey),
    //   ca: ca,
    //   allowHTTP1: true,
    // };

    const options = {
      cert: fs.readFileSync(serverSSLCert),
      key: fs.readFileSync(serverSSLKey),
      allowHTTP1: true,
    };

    const h2Server = http2.createSecureServer(options, server.callback());

    h2Server.on("error", (err) => console.error(err));

    h2Server.listen(serverPort,"127.0.0.1", () => {
      console.log(
        chalk.green(
          `[✅] Ready on https://127.0.0.1:${serverPort}/ using HTTP/2 server`
        )
      );
    });
  } else {
    server.listen(serverPort, () => {
      console.log(chalk.green(`[✅] Ready on http://localhost:${serverPort}`));
    });
  }
});
/**
 * Open connection to mongoose databse
 */
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

console.log(DB_URL)

/**
 * Mongoose connection on open callback
 */
mongoose.connection.once("open", () => {
  console.log("Database connection established");
});
/**
 * Mongoose connection on error callback
 */
mongoose.connection.on("error", (error) => {
  console.log("Error while connecting to database", error);
});
