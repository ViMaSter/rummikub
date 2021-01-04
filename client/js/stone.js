
class Stone {
    constructor(id, color, number) {
        this.id = id;
        this.color = color;
        this.number = number;
        this.rowID = null;
        Stone.IDMapping[this.id] = this;
    }

    createDOM() {
        const button = document.createElement("button");
        button.dataset.id = this.id;
        button.setAttribute("type", "button");
        button.classList.add("stone", "btn", "text-" + Stone.ColorToClassMapping[this.color]);
        button.innerText = this.number;
        button.ondragstart = (event) => {
            event.dataTransfer.setData("stoneID", event.currentTarget.dataset.id);

            var stoneBoundings = event.target.getBoundingClientRect();
            var x = event.pageX - stoneBoundings.left;
            var y = event.pageY - stoneBoundings.top;

            event.dataTransfer.setData("offsetX", x);
            event.dataTransfer.setData("offsetY", y);

            document.body.classList.add("drag-in-progress");
        };
        button.ondragend = (event) => {
            document.body.classList.remove("drag-in-progress");
            event.preventDefault();
            event.stopPropagation();
        };
        button.onclick = () => {
            button.setAttribute("draggable", "true");
        };
        button.ontouch = () => {
            button.setAttribute("draggable", "true");
        };
        button.onblur = () => {
            button.setAttribute("draggable", "false");
        };
        const wrapper = document.createElement("div");
        wrapper.classList.add("buttonwrapper");
        wrapper.appendChild(button);
        return wrapper;
    }
};

Stone.IDMapping = {};
Stone.ColorToClassMapping = {
    "red": "danger",
    "yellow": "secondary",
    "blue": "primary",
    "black": "very-dark"
};