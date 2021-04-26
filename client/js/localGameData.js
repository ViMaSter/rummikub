class LocalGameData extends GameData {
    constructor() {
        super();

        this.players = [
            new Row(++Row.LastRowID, [], 0, 0),
            new Row(++Row.LastRowID, [], 0, 0)
        ];
    }
}