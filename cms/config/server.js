module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1338),
  app: {
    keys: env.array("APP_KEYS"),
  },
  proxy: env.bool("IS_PROXY"),
  url: env("PUBLIC_URL", "https://sickst.ro/cms/"),
});
