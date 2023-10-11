var NodeHelper = require('node_helper');
const got = require('got');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-FPL-Standings helper, started...');

        // Set up the local values
        this.result = null;
    },


    getFplStandingsData: function (payload) {
        let that = this;
        this.url = payload;

        got.get(this.url, {
                responseType: 'json'
            }
        ).then(response => {
            that.result = null;
            if(response.statusCode === 200) {
                that.result = response;
            }
            // We have the response figured out so lets fire off the notification
            that.sendSocketNotification('GOT-FPL-STATUS', {'url': that.url, 'result': that.result});
        }).catch(error => {
            that.result = null;
            // We have the response figured out so lets fire off the notification
            that.sendSocketNotification('GOT-FPL-STATUS', {'url': that.url, 'result': that.result});
        });



        // request({url: this.url, method: 'GET'}, function (error, response, body) {
        //     // Lets convert the body into JSON
        //     var result = JSON.parse(body);
        //
        //     // Check to see if we are error free and got an OK response
        //     if (!error && response.statusCode === 200) {
        //         // Let's get the data
        //         that.result = result;
        //     } else {
        //         // In all other cases it's some other error
        //         that.result = null;
        //     }
        //
        //     // We have the response figured out so lets fire off the notification
        //     that.sendSocketNotification('GOT-FPL-STATUS', {'url': that.url, 'result': that.result});
        // });
    },


    socketNotificationReceived: function (notification, payload) {
        // Check this is for us
        if (notification === 'GET-FPL-STATUS') {
            this.getFplStandingsData(payload);
        }
    }

});
