const debug = require('debug')('sensor');
const Pms7003 = require('./pms7003');
const Htu21d = require('./htu21d');

const createSensor = (sensor) => {
  switch (sensor.type) {
    case 'temp_hum':
      switch (sensor.name) {
        case 'HTU21D':
          return [ new Htu21d(sensor) ];
        default:
          debug(`Unsupported sensor: ${sensor.name}.`);
      }
      break;
    case 'pms':
      switch (sensor.name) {
        case 'PMS7003':
          return [ new Pms7003(sensor) ];
        default:
          debug(`Unsupported sensor: ${sensor.name}.`);
      }
      break;
    default:
      debug(`Unsupported sensor type: ${sensor.type}.`);
  }
  return [];
}

const initSensors = async (sensors) => {
  debug('initSensors')
  await sensors.forEach((sensor) => sensor.init())
}

const getSensorsValues = async (sensors) => {
  debug('getSensorsValues')

  const sensorsReadActions = sensors.map(async (sensor) => {
    await sensor.wakeup();
    const values = await sensor.read().catch((err) => {debug(err)})
    await sensor.sleep();

    return values;
  });

  return await Promise.allSettled(sensorsReadActions).then((results) => {
    debug(results)
    return Object.assign(...results.map(o => o.value))
  });
}

module.exports = {createSensor, initSensors, getSensorsValues};