class GameData {
    constructor(currentPlayerName) {
        this.bag = [];
        this.map = [];
        this.inventories = {};
        this.players = [];

        this.currentPlayerName = currentPlayerName;
    }

    restartRound() {
        this.map = [];
        this.players.forEach(playerName => {
            this.inventories[playerName] = [
                new Row(++Row.LastRowID, [], 0, 0),
                new Row(++Row.LastRowID, [], 0, 0)
            ];
        });

        this.bag = [];
        let stoneID = -1;
        for (let duplicates = 0; duplicates < numberDuplicates; ++duplicates) {
            for (const color in Stone.ColorToClassMapping) {
                for (let i = numbersPerColor[0]; i <= numbersPerColor[1]; ++i) {
                    bag.push(new Stone(++stoneID, color, i));
                }
            }
        }

        this.bag.push(new Stone(++stoneID, "red", "☺"));
        this.bag.push(new Stone(++stoneID, "black", "☺"));

        this.bag.shuffle();
    }

    addPlayer(playerName) {
        this.players.push(playerName);
        this.inventories[playerName].push([
            new Row(++Row.LastRowID, [], 0, 0),
            new Row(++Row.LastRowID, [], 0, 0)
        ]);
    }

    removePlayer(playerName) {
        const stones = this.inventories[playerName][0].concat(this.inventories[playerName][1]);
        console.log("Player %s left; reintroducing the following stones: %o", playerName, stones);
        this.bag.push(stones);
    }

    pullFromBag() {
        if (bag.length <= 0) {
            return;
        }
        const targetInventory = this.inventories[playerName][1].stones.length > this.inventories[playerName][0].stones.length ? this.inventories[playerName][0] : this.inventories[playerName][1];
        targetInventory.receiveStone(bag.pop(), targetInventory.stones.length);
        console.log("left in bag (%d): %O", bag.length, bag);

        if (bag.length <= 0) {
            document.getElementById("pullFromBag").disabled = true;
        }
    }
}