var NodeHelper = require('node_helper');
const got = require('got');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-FPL-Standings helper, started...');

        // Set up the local values
        this.result = null;
    },


    getFplStandingsData: function (url) {
        let that = this;
        this.url = url;

        got.get(this.url, {
            responseType: 'json'
        }).then(response => {
            // console.debug('MMM-FPL-Standings - Status code:' + response.statusCode);
            // console.debug('MMM-FPL-Standings - response:' + response);
            // console.debug('MMM-FPL-Standings - body:' + JSON.stringify(response.body));
            that.result = response.body;
            that.sendSocketNotification('GOT-FPL-STATUS', {'url': that.url, 'result': that.result});
        }).catch(error => {
            console.error('MMM-FPL-Standings - Status code:' + error.response.statusCode);
            that.result = null;
            that.sendSocketNotification('GOT-FPL-STATUS', {'url': that.url, 'result': that.result});
        });
    },

    socketNotificationReceived: function (notification, payload) {
        // Check this is for us
        if (notification === 'GET-FPL-STATUS') {
            this.getFplStandingsData(payload);
        }
    }

});
