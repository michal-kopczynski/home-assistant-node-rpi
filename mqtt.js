const debug = require('debug')('mqttclient');
const MQTT = require('async-mqtt');

class Mqtt {
  constructor(url) {
    this.url = url;
  }

  init = async function() {
    debug('init')
    this.client  = await MQTT.connectAsync(this.url)
  }
 
  post = function(topic, data) {
    debug('post')
    this.client.publish(topic, data);
  }
  
}

module.exports = Mqtt;
