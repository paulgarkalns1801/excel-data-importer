let xlsx = require('node-xlsx');
const axios = require('axios')
let sleep = require('system-sleep');

let obj = xlsx.parse(__dirname + '/IoT POIC_2.xlsx', {'type': this.type, cellDates: true}); // parses a file

for (const room of obj) {
    let roomData = room.data
    let iterations = roomData.length
    // iterations = 3
    for (let i = 2; i < iterations; i++) {
        let sensorValueRow = roomData[i]
        createPostAndSend(room, sensorValueRow, 0).then(r => {})
        createPostAndSend(room, sensorValueRow, 5).then(r => {})
        createPostAndSend(room, sensorValueRow, 10).then(r => {})
    }
}

async function createPostAndSend(room, sensorValueRow, sensorIdx) {
    try {
        let sensorId = room.name.toString().charAt(room.name.toString().length - 1) + "0" + sensorIdx
        let date = sensorValueRow[sensorIdx].toISOString()
        let time = sensorValueRow[sensorIdx + 1].toISOString()
        let sensorInputValue = sensorValueRow[sensorIdx + 2]
        let dateTime = date.split("T")[0] + "T" + time.split("T")[1]

        postSensorValue(sensorId, sensorInputValue, dateTime)
        await sleep(10)
        console.log("I sleep")
    } catch (e) {
        console.log("Book:" + room.name.toString() + ", Row" + sensorValueRow)
        console.log(e);
    }
}

function postSensorValue(sensorId, sensorValue, dateTime) {
    axios
        .post('http://localhost:8080/sensors', {
            value: sensorValue.toString(),
            sensorId: sensorId,
            dateTime: dateTime
        }, {headers: {"Content-Type": "application/json"}})
        .then(res => {
            // console.log(res)
        })
        .catch(error => {
            console.error(error)
        })
}