class RemoteGameData extends GameData {
    constructor(host, port, playerName, sessionID) {
        super();

        this.playerName = playerName;
        this.websocket = new WebSocket(`ws://${host}:${port}/`);
        this.websocket.onopen = this.messageHandler.onOpen;
        this.websocket.onmessage = this.messageHandler.onMessage;
        this.websocket.onclose = this.messageHandler.onClose;
        this.websocket.onerror = this.messageHandler.onError;

        this.messageHandler = new MessageHandler(this);
    }

    restartRound() {
        super.restartRound();
        this.sendUpdate();
    }

    pullFromBag() {
        super.pullFromBag();
        this.sendUpdate();
    }

    sendUpdate() {
        this.websocket.send({
            command: "updateSession",
            sessionData: {
                bag: this.bad,
                map: this.map,
                inventories: this.inventories
            }
        })
    }
}
RemoteGameData.MessageHandler = class {
    constructor(gameData) {
        this.gameData = gameData;
    }

    onMessage(message) {
        if (!this[message.command]) {
            throw {
                code: 3,
                stack: new Error(),
                data: message.command
            };
        }

        this[message.command](message);
    }

    sessionJoin(message) {
        console.log("Joined session " + message.sessionID);
        websocket.send({
            "command": "updatePlayer",
            "playerData": {
                "name": this.playerName
            }
        });
    }

    onOpen() {
        if (sessionID) {
            gameData.websocket.send({
                "command": "joinSession",
                "sessionID": sessionID
            });
            return;
        }

        gameData.websocket.send({
            "command": "createSession",
            "sessionData":
            {
                "bag": [],
                "map": [],
                "inventories": {}
            },
            "playerData":
            {
                "name": "__unset__"
            }
        });
    }

    onClose() {
        throw {
            code: 1,
            stack: new Error()
        };
    }
    onError() {
        throw {
            code: 2,
            stack: new Error()
        };
    }
};