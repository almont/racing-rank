import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';


// Parse data
const parseData = (data) => {
    
    // Create laps table
    const table = [];

    // Breaking cells into objects
    // Splitting cells
    data.split('\n').map(
        (cell, key) => {
            // Eliminate first cell
            if (key > 0) {
                // Splitting columns
                const arr = cell.split(/\s+/);
                // Cleaning '-' character
                const evens = _.remove(arr, (n) => (n != '–'));
                // Push object into table
                table.push({
                    position: '',
                    pilotCod: evens[1],
                    pilotName: evens[2],
                    completedLaps: evens[3],
                    time: evens[4],
                    averageLaps: evens[5]
                });
            }
        }
    );

    // Group laps by pilot name
    const laps = _.chain(table)
                    .groupBy('pilotCod')
                    .map((value, key) => (value))
                    .value();

    // Order by completed lap DESC
    // const ranking = _.orderBy(laps, ['length'], ['desc']);
    
    // Building ranking table
    const rankingTable = [];
    
    // _.forEach(ranking, (value) => {
    _.forEach(laps, (value) => {
        
        let cell;
        let pilotCod;
        let pilotName;
        let completedLaps = 0;
        let time = '00:00:00.000';
        // let averageLaps;

        _.forEach(value, (obj) => {
            pilotCod = obj.pilotCod;
            pilotName = obj.pilotName;
            // Sum laps time
            time = moment.utc(moment.duration(time).add(`00:0${obj.time}`).asMilliseconds()).format("HH:mm:ss.SSS");
            completedLaps++;
        })

        cell = {
            pilotCod,
            pilotName,
            completedLaps,
            time
        };

        rankingTable.push(cell);
        
    });

    // Order by time lap ASC
    const ranking = _.orderBy(rankingTable, ['time'], ['asc']);

    render(ranking);
}


// Render result on page
const render = (data) => {
    // Create table rows and columns
    data.map((row, key) => {
        // Create pilot position column
        const tr = document.createElement('tr');
        const pilotPosition = document.createElement('td');
        pilotPosition.innerText = key + 1;
        tr.appendChild(pilotPosition);
        
        // Create [pilot code, pilot name, completed laps, time] columns
        _.forEach(row, (obj) => {
            const td = document.createElement('td');
            td.innerText = obj;
            tr.appendChild(td);
        })

        // Select table element
        const output = document.getElementById('table');
        // Insert into HTML element
        output.appendChild(tr);
    })
}


// Load data from TXT
axios.get('./data.txt').then(
    data => {
        parseData(data.data);
    }
);
