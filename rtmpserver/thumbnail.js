const CronJob = require('cron').CronJob;
const request = require('request');
const helpers = require('../routes/streaming/rtmp/helpers.js');
const config = require('./index.js');
const port = config.rtmp_server.http.port;
 
const job = new CronJob('*/5 * * * * *', () => {
    request
        .get('http://127.0.0.1:' + port + '/api/streams', (error, response, body) => {
            let streams = JSON.parse(body);
            console.log(streams);
            if (typeof (streams['live'] !== undefined)) {
                let live_streams = streams['live'];
                console.log("live_streams :", live_streams);
                for (let stream in live_streams) {
                    if (!live_streams.hasOwnProperty(stream)) continue;
                    console.log("run");
                    helpers.generateStreamThumbnail(stream);
                }
            }
        });
}, null, true);
 
module.exports = job;