
const debug = require('debug')('htu21d');
const Sensor = require('./sensor');
const SensorHtu21d = require('sensor-htu21d');

class Htu21d extends Sensor {
  constructor(config) {
    super(config)
    this.propMap = {
      temp: 'temperature',
      hum: 'humidity'
    }

  }

  parse(data) {
    return {
      temperature: data.temperature,
      humidity: data.humidity
    }
  }
  
  async read() {
    debug('read')

    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        debug(`Read timed out after 5s`)
        reject(new Error(`Read timed out after 5s`));
      }, 5000);


      let htu = new SensorHtu21d(this.device, 1000);
      htu.start();

      htu.on('readout-complete', (data) => {
        debug(data);    // e.g. { temperature: 26.39, humidity: 16.45 }
        clearTimeout(timeout);
        htu.stop();
        return resolve(this.parse(data));
      });

      htu.on('error', (error) => {
        debug(error);
        clearTimeout(timeout);
        htu.stop();
        return reject(error);
      });
    });
  }
}

module.exports = Htu21d
