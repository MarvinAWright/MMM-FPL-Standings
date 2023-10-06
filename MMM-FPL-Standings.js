Module.register('MMM-FPL-Standings', {

    defaults: {
        leagueId: "643642",
        interval: 600000 // Every 10 minutes
    },


    start: function () {
        Log.log('Starting module: ' + this.name);

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.url = 'https://fantasy.premierleague.com/api/leagues-classic/" + this.config.leagueId + "/standings/';
        this.location = '';
        this.result = null;

        // Trigger the first request
        this.getFplStandingsData(this);
    },


    getStyles: function () {
        return ['fpl-standings.css', 'font-awesome.css', 'modules/MMM-FPL-Standings/node_modules/@mdi/font/css/materialdesignicons.min.css'];
    },


    getFplStandingsData: function (that) {
        // Make the initial request to the helper then set up the timer to perform the updates
        that.sendSocketNotification('GET-FPL-STATUS', that.url);
        setTimeout(that.getFplStandingsData, that.config.interval, that);
    },


    getDom: function () {
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


        // Set up the local wrapper
        var wrapper = document.createElement('div');

        // If we have some data to display then build the results table
        if (this.loaded) {
            if (this.result !== null) {
                fplResults = document.createElement('table');
                fplResults.setAttribute('cellspacing', 0);
                fplResults.setAttribute('cellpadding', 2);


                leagueNameRow = document.createElement('tr');
                leagueName = document.createElement('td');
                leagueName.setAttribute("colspan", "5");
                leagueName.innerHTML = this.result.league.name;
                leagueName.class = 'bright xsmall';
                leagueNameRow.appendChild(leagueName);
                fplResults.appendChild(leagueNameRow);

                rowHeader = document.createElement('tr');
                rankHeader = document.createElement('td');
                rankHeader.innerHTML = 'Rank';
                teamHeader = document.createElement('td');
                teamHeader.innerHTML = 'Team';
                managerHeader = document.createElement('td');
                managerHeader.innerHTML = 'Manager';
                gameWeekHeader = document.createElement('td');
                gameWeekHeader.innerHTML = 'GW';
                totalHeader = document.createElement('td');
                totalHeader.innerHTML = 'Total';

                rowHeader.appendChild(rankHeader);
                rowHeader.appendChild(teamHeader);
                rowHeader.appendChild(managerHeader);
                rowHeader.appendChild(gameWeekHeader);
                rowHeader.appendChild(totalHeader);
                fplResults.appendChild(rowHeader);

                for (var i = 0; i < this.result.standings.results.length; i++) {
                    standingRow = document.createElement('tr');
                    standingRow.className = 'bright xsmall';

                    rank = document.createElement('td');
                    if (this.result.standings.results[i].rank < this.result.standings.results[i].last_rank) {
                        rank.innerHTML = '<i class=\'mdi mdi-arrow-up-bold\' style=\'color:green\'></i>' + this.result.standings.results[i].rank;
                    } else if (this.result.standings.results[i].rank > this.result.standings.results[i].last_rank) {
                        rank.innerHTML = '<i class=\'mdi mdi-arrow-down-bold\' style=\'color:red\'></i>' + this.result.standings.results[i].rank;
                    } else {
                        rank.innerHTML = '<i class=\'mdi mdi-circle-medium\' style=\'color:grey\'></i>' + this.result.standings.results[i].rank;
                    }

                    team = document.createElement('td');
                    team.innerHTML = this.result.standings.results[i].entry_name + ' ';

                    manager = document.createElement('td');
                    manager.innerHTML = this.result.standings.results[i].player_name + ' ';

                    gameWeek = document.createElement('td');
                    gameWeek.innerHTML = this.result.standings.results[i].event_total;

                    total = document.createElement('td');
                    total.innerHTML = this.result.standings.results[i].total;


                    standingRow.appendChild(rank);
                    standingRow.appendChild(team);
                    standingRow.appendChild(manager);
                    standingRow.appendChild(gameWeek);
                    standingRow.appendChild(total);

                    fplResults.appendChild(standingRow);
                }

                var date = date = new Date(this.result.last_updated_data);

                leagueNameRow = document.createElement('tr');
                leagueName = document.createElement('td');
                leagueName.setAttribute("colspan", "5");
                leagueName.innerHTML = 'Last updated : ' + weekday[date.getDay()] + ' ' + date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getHours() + ':' + date.getMinutes();
                leagueName.class = 'bright xsmall';
                leagueNameRow.appendChild(leagueName);
                fplResults.appendChild(leagueNameRow);

                wrapper.appendChild(fplResults);
            } else {
                // Otherwise lets just use a simple div
                wrapper.innerHTML = 'Error getting FPL standings.';
            }
        } else {
            // Otherwise lets just use a simple div
            wrapper.innerHTML = 'Loading FPL standings...';
        }

        return wrapper;
    },


    socketNotificationReceived: function (notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-FPL-STATUS' && payload.url === this.url) {
            // we got some data so set the flag, stash the data to display then request the dom update
            this.loaded = true;
            this.result = payload.result;
            this.updateDom(1000);
        }
    }
});
