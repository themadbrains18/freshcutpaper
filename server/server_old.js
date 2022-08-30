import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import mount from "koa-mount";
import serve from "koa-static";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import * as handlers from "./handlers/index";
import Cookies from "universal-cookie";
import http2 from "http2";
import fs from "fs";

import apiRouter from "./routes";
import ShopifyApi from "./Services/api/Shopify";
import Shop from "./Models/Shop";
import ShopAccessToken from "./Models/ShopAccessToken";

const chalk = require("chalk");

const mongoose = require("mongoose");

const cookies = new Cookies();

dotenv.config();
const serverPort = process.env.NODE_PORT || 8081;
const serverUseSSL = process.env.NODE_USE_SSL || false;
const serverSSLCert = process.env.NODE_SSL_CERT || null;
const serverSSLKey = process.env.NODE_SSL_KEY || null;
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, JEST_WORKER_ID, DB_URL, HOST, SCRIPT_PATH} = process.env;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(cors());
  server.use(bodyParser());
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;

        const redirectUrl = `https://${shop}/admin/apps/${SHOPIFY_API_KEY}`;

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

        if (script_tags.length === 0) {
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "APP_UNINSTALLED",
            "/webhooks/app/uninstalled",
            ApiVersion.July19
          );
          await handlers.registerWebhooks(
            shop,
            accessToken,
            "SHOP_UPDATE",
            "/webhooks/shop/update",
            ApiVersion.July19
          );
        }


        const existingShopModel = await Shop.findByDomain(shop);

        // Save Shop Access Token or update existing
        if (existingShopModel) {
          await ShopAccessToken.findOneAndUpdate(
            { shop: existingShopModel },
            { access_token: accessToken },
            { upsert: true, new: true }
          ).exec();
          // TODO: Should check if necassery to register webhooks
          // Register webhooks
          // await RegisterWebhoooks.schedule(
          //   dayjs().add(15, "second").format()
          // ).dispatch({ shop, accessToken, shopId: existingShopModel._id });
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
            .then(async () => {
            })
            .catch(async (err) => {
              console.log( "After saving store data", err)
            });

          // Redirects to shopify app
          ctx.redirect(redirectUrl);
        } catch (err) {
          console.log(err);
          //logger.error(err);
        }
      },
    })
  );

  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );

  router.get("(.*)", verifyRequest(), async (ctx) => {

    if (typeof ctx.cookies.get('shopOrigin') === "undefined" && typeof ctx.session.shop !== "undefined") {
      ctx.cookies.set('shopOrigin', ctx.session.shop, { httpOnly: false, sameSite: 'none', secure: true });
      ctx.redirect(ctx.req.url);
      return;
    }

    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;

  });

  server
    .use(mount("/public", serve("./public")))
    .use(apiRouter.routes())
    .use(router.routes());


  /**
   * Open connection to mongoose databse
   */
  mongoose.connect(
    DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  );
  /**
   * Mongoose connection on open callback
   */
  mongoose.connection.once("open", () => {
    console.log(chalk.green("[✅] Database connection established"));
    //logger.info("[Mongoose] connection established");
  });
  /**
   * Mongoose connection on error callback
   */
  mongoose.connection.on("error", (error) => {
    console.log(chalk.green("[❌] Error while connecting to database"));
    //logger.error(error);
  });
  /**
   * Server ready callback
   */


  if (serverUseSSL) {
    if (null === serverSSLKey || null === serverSSLCert) {
      throw 'HTTPS certificate or key is not defined';
    }

    const options = {
      cert: fs.readFileSync(serverSSLCert),
      key: fs.readFileSync(serverSSLKey),
      allowHTTP1: true
    };

    const h2Server = http2.createSecureServer(options, server.callback());

    h2Server.on('error', err => console.error(err));

    h2Server.listen(serverPort, () => {
      console.log(chalk.green(`[✅] Ready on https://0.0.0.0:${serverPort}/ using HTTP/2`));
    });
  } else {
    server.listen(serverPort, () => {
      console.log(chalk.green(`[✅] Ready on http://localhost:${serverPort}`));
    });
  }

});
