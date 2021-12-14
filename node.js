const debug = require('debug')('node');
const cron = require('node-cron');
const { createSensor, initSensors, getSensorsValues } = require('./sensors/sensors');
const Mqtt = require('./mqtt')

class Node {
  constructor(config) {
    this.name = config.name;
    this.url = config.mqttUrl;
    this.schedule = config.sensorsSchedule;
    debug('Config:')
    debug(config)
    this.sensors = config.sensors.flatMap(createSensor);
  }

  async init () {
    debug('init')
    await initSensors(this.sensors);

    this.mqtt = new Mqtt(process.env.MQTT_URL);
    await this.mqtt.init()

    this.mqtt.post(`/nodes/${this.name}/status`, JSON.stringify({
      location: this.name,
      status: 'UP',
    }))
  }

  start () {
    debug('start');

    this.task = cron.schedule(this.schedule, async () => {
      debug('running periodic task');
  
      const sensorsData = await getSensorsValues(this.sensors)
      const data = {
        location: this.name,
        timestamp: new Date(),
        sensors: sensorsData,
      }
    
      debug('read done')
      this.mqtt.post(`/nodes/${this.name}/data`, JSON.stringify(data))
    });
  }

  stop () {
    debug('stop');

    this.task.destroy();
  }
  
}

module.exports = Node;
