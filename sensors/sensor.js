const debug = require('debug')('sensor');

class Sensor {
  constructor(config) {
    this.parameters = config.parameters;
    this.device = config.device;
  }

  async init() {
    debug('init')
  }

  async sleep() {
    debug('sleep')
  }

  async wakeup() {
    debug('wakeup')
  }

  parse() {
    debug('parse')
  }

  async read() {
    debug('read')
  }
}

module.exports = Sensor;