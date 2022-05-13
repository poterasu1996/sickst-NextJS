module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'https://779c-86-124-174-194.eu.ngrok.io',
  app: {
    keys: env.array('APP_KEYS'),
  },
});
