const JOBS = {
  // Auth
  AUTH_APPEND_SCRIPTS: "auth::append script tags",
  AUTH_APPEND_DRAFTS: "auth::append drafts",
  AUTH_REGISTER_WEBHOOKS: "auth::register webhooks",
};

const APP_NAME = process.env.APP_NAME ? process.env.APP_NAME : "giftcard";

export { JOBS, APP_NAME };
