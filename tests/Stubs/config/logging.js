export default {
  /*
  |--------------------------------------------------------------------------
  | Default Log Channel
  |--------------------------------------------------------------------------
  |
  | This option defines the default log channel that gets used when writing
  | messages to the logs. The name specified in this option should match
  | one of the channels defined in the "channels" configuration object.
  |
  */

  default: 'console',

  /*
  |--------------------------------------------------------------------------
  | Log Channels
  |--------------------------------------------------------------------------
  |
  | Here you may configure the log channels for your application.
  |
  | Available Drivers:
  |   "console", "debug", "discord", "file", "null", "pino", "slack", "telegram".
  | Available Formatters:
  |   "cli", "simple", "nest", "json", "request", "message", "pino-pretty(only for pino driver)".
  |
  */

  channels: {
    console: {
      driver: 'null',
      formatter: 'cli',
      streamType: 'stdout',
      formatterConfig: {},
    },
    exception: {
      driver: 'console',
      formatter: 'none',
      streamType: 'stdout',
    },
  },
}
