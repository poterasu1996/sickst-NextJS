module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://sickst.ro'),
  app: {
    proxy: env.bool("IS_PROXY"),
    keys: env.array('APP_KEYS'),
  },
});
