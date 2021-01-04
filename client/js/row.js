class Row {
    constructor(id, stones, x, y) {
        this.id = id;
        this.stones = stones;
        this.x = x;
        this.y = y;

        this.stones.forEach(stone => {
            stone.rowID = this.id;
        });

        Row.LastRowID = this.id > Row.LastRowID ? this.id : Row.LastRowID;
        Row.IDMapping[this.id] = this;
    }

    receiveStone(stone, insertIndex = 0) {
        if (this.id == stone.rowID) {
            const currentPosition = this.stones.findIndex(stoneItterator => stoneItterator.id == stone.id);
            const targetPosition = insertIndex;
            if (currentPosition < targetPosition) {
                Row.IDMapping[stone.rowID].removeStone(stone);
                this.addStone(stone, insertIndex - 1);
                stone.rowID = this.id;
                return;
            }
        }

        if (stone.rowID != null) {
            Row.IDMapping[stone.rowID].removeStone(stone);
        }
        this.addStone(stone, insertIndex);
        stone.rowID = this.id;
    }

    removeStone(stoneToRemove) {
        this.stones = this.stones.filter(stone => stone.id != stoneToRemove.id);
    }

    addStone(stone, index) {
        this.stones.splice(index, 0, stone);
    }

    createDOM(isInventory) {
        const row = document.createElement("div");
        row.classList.add("scroll-row");
        row.dataset.id = this.id;
        row.ondrop = (event) => {
            if (document.activeElement == null || !document.activeElement.classList.contains("stone") || !document.activeElement.draggable) {
                return;
            }

            const row = Row.IDMapping[event.currentTarget.dataset.id];

            const stones = Array.from(document.elementsFromPoint(event.clientX, event.clientY))
                .filter(element => element.classList.contains("buttonwrapper"))
                .map(element => element.querySelector(".stone"))
                .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);

            let insertIndex = Row.FindInsertPosition(row.stones, stones, event.clientX, event.clientY);

            event.preventDefault();
            event.stopPropagation();

            row.receiveStone(Stone.IDMapping[event.dataTransfer.getData("stoneID")], insertIndex);

            rebuild();
        };
        row.ondragover = allowDrop;
        if (!isInventory) {
            row.setAttribute("draggable", "true");
        }

        let lastDragStart = [];
        row.ondragstart = (event) => {
            if (document.activeElement != null && document.activeElement.classList.contains("stone") && document.activeElement.draggable) {
                return;
            }

            lastDragStart = [event.pageX, event.pageY];
        };
        row.ondragend = (event) => {
            if (document.activeElement != null && document.activeElement.classList.contains("stone") && document.activeElement.draggable) {
                return;
            }

            const offset = [event.pageX - lastDragStart[0], event.pageY - lastDragStart[1]];

            const affectedRow = Row.IDMapping[event.currentTarget.dataset.id];
            affectedRow.x += offset[0];
            affectedRow.y += offset[1];
            rebuild();
        };
        this.stones.forEach(stone => {
            row.appendChild(stone.createDOM());
        });
        if (!isInventory) {
            row.style.position = "absolute";
            row.style.left = this.x + "px";
            row.style.top = this.y + "px";
        }
        return row;
    }
};

Row.IDMapping = {};
Row.LastRowID = -1;
Row.FindInsertPosition = (stonesInRow, hoveredStones, clientX, clientY) => {
    if (hoveredStones.length == 0) {
        return stonesInRow.length;
    }

    const leftMostStoneID = hoveredStones[0].dataset.id;

    if (hoveredStones.length == 1) {
        if (stonesInRow.length == 1) {
            const diffToLeft = Math.abs(clientX - hoveredStones[0].getBoundingClientRect().left);
            const diffToRight = Math.abs(clientX - hoveredStones[0].getBoundingClientRect().right);
            if (diffToLeft < diffToRight) {
                return 0;
            }
            return 1;
        }
        if (leftMostStoneID == stonesInRow[0].id) {
            return 0;
        }
        if (leftMostStoneID == stonesInRow[stonesInRow.length - 1].id) {
            return stonesInRow.length;
        }
        throw new Exception("Unexpected left-most stone: " + leftMostStoneID);
    }

    if (hoveredStones.length == 2) {
        return stonesInRow.findIndex(stone => stone.id == leftMostStoneID) + 1;
    }
    throw new Exception("Unexpected stone length: " + hoveredStones.length);
};

window.addEventListener("load", () => {
    document.getElementById("playingfield").ondrop = (event) => {
        if (document.activeElement == null || !document.activeElement.classList.contains("stone") || !document.activeElement.draggable) {
            return;
        }

        var stoneBoundings = event.target.getBoundingClientRect();
        var x = event.pageX - stoneBoundings.left - event.dataTransfer.getData("offsetX");
        var y = event.pageY - stoneBoundings.top - event.dataTransfer.getData("offsetY");

        const newRow = new Row(++Row.LastRowID, [], x, y);
        newRow.receiveStone(Stone.IDMapping[event.dataTransfer.getData("stoneID")]);
        map.push(newRow);

        rebuild();
    };
});
