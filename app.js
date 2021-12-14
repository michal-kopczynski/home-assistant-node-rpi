require('dotenv').config()
const debug = require('debug')('app');
const Node = require('./node');

debug('env')
debug(process.env.DEBUG)
debug(process.env.MQTT_URL)
debug(process.env.LOCATION)

const config = {
  name: process.env.LOCATION,
  mqttUrl: process.env.MQTT_URL,
  sensors: [
    {
      name: 'HTU21D',
      type: 'temp_hum',
      parameters: [
        'temperature',
        'humidity',
      ],
      device: 1
    },
    {
      name: 'PMS7003',
      type: 'pms',
      parameters: [ 
        'pms1_0',
        'pms2_5',
        'pms10',
      ],
      device: '/dev/serial0',
      options: {
        sleepPin: '11',
      }
    },
  ],
  sensorsSchedule: '* * * * *',
}

const node = new Node(config)
node.init();
node.start();
