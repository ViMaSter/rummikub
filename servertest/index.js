const ws = require('websocket').client;
const client = new ws();
client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    if (connection.connected) {
        connection.send(JSON.stringify({
            "command": "createSession",
            "sessionData":
            {
                "endTimeInMS": 1262304000
            },
            "playerData":
            {
                "name": "__unset__"
            }
        }));
    }
});

client.connect('ws://localhost:7000');