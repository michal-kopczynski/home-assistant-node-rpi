const debug = require('debug')('pms7003');
const Sensor = require('./sensor');
const Plantower = require('hazyair-plantower');
const gpiop = require('rpi-gpio').promise;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Pms7003 extends Sensor {
  constructor(config) {
    super(config)

    this.sleepPin = config.options.sleepPin;
    this.plantower = new Plantower('PMS7003', config.device);
  }

  async init() {
    debug('init')
    await gpiop.setup(this.sleepPin, gpiop.DIR_OUT);
  }

  async wakeup() {
    debug('wakeup')

    await gpiop.write(this.sleepPin, true);

    await sleep(30000);
  }
  
  async sleep() {
    debug('sleep')

    await gpiop.write(this.sleepPin, false);
  }

  parse(data) {
    return {
      pms1_0: data['concentration_pm1.0_atmos'].value,
      pms2_5: data['concentration_pm2.5_atmos'].value,
      pms10: data['concentration_pm10_atmos'].value
    }
  }

  async read() {
    debug('read')

    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        debug(`Read timed out after 5s`)
        reject(new Error(`Read timed out after 5s`));
      }, 5000);

      this.plantower.read().then((data) => {
        debug(data)
        debug('read ok')
        clearTimeout(timeout);
        return resolve(this.parse(data));
      }).catch((error) => {
        debug(`error: ${error}`)
        clearTimeout(timeout);
        return reject(error);
      });
    });
  }
}

module.exports = Pms7003
