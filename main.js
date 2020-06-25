
import dijkstra from "./dijkstra.js";  
import aStar from "./a-star.js";  
import bfs from "./breadth-first-search.js";
import greedyBestFirst from "./greedy-best-first-search.js";
import dfs from "./depth-first-search.js";
import { addToAnimationNodes } from "./animate.js"

const cellContainer = document.getElementById("cell-grid");
const startButton = document.getElementById("start-button");
const clearWallsButton = document.getElementById("clear-walls-button");
const clearWeightsButton = document.getElementById("clear-weights-button");
const weightsButton = document.getElementById("add-weights-button");
const dijkstraButton = document.getElementById("dijkstra")
const aStarButton = document.getElementById("a-star")
const BreadthFirstButton = document.getElementById("breadth-first");
const greedyBestFirstButton = document.getElementById("greedy-best-first");
const DepthFirstButton = document.getElementById("depth-first");
const algorithmsDropdown = document.getElementById("algorithms-dropdown-menu");
const algorithmsDropdownButton = document.getElementById("algorithm-dropdown-button");
const speedDropdownButton = document.getElementById("speed-dropdown-button");
const speedDropdown = document.getElementById("speed-dropdown-menu");
const modal = document.getElementById("modal-select-algorithm");
const modalButton = document.getElementById("modal-button");
const currentAlgorithm = document.getElementById("current-algorithm");
const currentSpeed = document.getElementById("current-speed");
const verySlow = document.getElementById("very-slow");
const slow = document.getElementById("slow");
const medium = document.getElementById("medium");
const fast = document.getElementById("fast");
const veryFast = document.getElementById("very-fast");
const overlay = document.getElementById("overlay");

const rows = 20;
const cols = 40;
export let speed = 5;

export function calcDist(node1, node2) {
    return Math.sqrt(Math.pow((node2.i - node1.i), 2) + Math.pow((node2.j - node1.j), 2));
}
export function calcManhattenDist(node1, node2) {
    return Math.abs(node1.i - node2.i) + Math.abs(node1.j - node2.j);
} 
export function removeFromArray(arr, el) {
    for(let i = arr.length - 1; i >= 0; i--) {
        if(arr[i] === el) {
            arr.splice(i, 1);    
        }
    }
}
export function path(current) {
    const path = []; 
        while(current.parent != null) {
            path.push(current);
            addToAnimationNodes(current);
            current = current.parent;
        }
}

class Node {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.searched = false;
        this.hasBeenCurrent = false;
        this.isInClosedSet = false;
        this.neighbors = [];
        this.weight = 0;
        this.g = Infinity;
        this.element = null;
        this.parent = null;
        this.wall = false;
        this.start = false;
        this.end = false;
        this.h = Infinity;
        this.f = Infinity;
    }
    setNeighbors(grid) {
        if(this.i > 0) {
            this.neighbors.push(grid[this.j + (this.i - 1) * cols]);
        }
        if(this.j > 0) {
            this.neighbors.push(grid[(this.j - 1) + this.i * cols]);
        }
        if(this.i < rows - 1) {
            this.neighbors.push(grid[this.j + (this.i + 1) * cols]);
        }
        if(this.j < cols - 1) {
            this.neighbors.push(grid[(this.j + 1) + this.i * cols]);
        }
    }
    setG(g) {
        this.g = g + this.weight;
    }
    setH(h) {
        this.h = h;
    }
    setF(f) {
        this.f = f;
    }
    setWeight(amt) {
        this.weight = amt;
    }
    setWall(boolean) {
        this.wall = boolean;
    }
}

const grid = [];


for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        grid[j + i * cols] = new Node(i, j);
        grid[j + i * cols].element = document.createElement("div");
        grid[j + i * cols].element.setAttribute("data-index1", `${i}`);
        grid[j + i * cols].element.setAttribute("data-index2", `${j}`);
        grid[j + i * cols].element.classList.add("cell");
        cellContainer.appendChild(grid[j + i * cols].element);
        if(grid[j + i * cols].wall) {
            grid[j + i * cols].element.classList.add("wall");
        }
    }
}
for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        grid[j + i * cols].setNeighbors(grid);
    }
}

let start, end, pressed, overStart, overEnd;
let isWeight = false;
let gridOccupied = false;

export function setOccupation(a) {
    gridOccupied = a;
}
    

setStart(5, 5);
setEnd(10, 20);

window.addEventListener("mousemove", e => {
    e.preventDefault()
})

document.body.addEventListener("mousedown", () => {
    pressed = true;
})
document.body.addEventListener("mouseup", () => {
    pressed = false;
    overStart = false;
    overEnd = false;
})
document.body.addEventListener("mousedown", e => {
    if(e.target.classList.contains("start")) {
        overStart = true;
    }
});
document.body.addEventListener("mousedown", e => {
    if(e.target.classList.contains("end")) {
        overEnd = true;
    }
});
algorithmsDropdownButton.addEventListener("click", () => {
    algorithmsDropdown.classList.toggle("show");
    algorithmsDropdownButton.classList.toggle("active");
});
algorithmsDropdownButton.addEventListener("focusout", () => {
    algorithmsDropdown.classList.remove("show");
    algorithmsDropdownButton.classList.remove("active");
});
speedDropdownButton.addEventListener("click", () => {
    speedDropdown.classList.toggle("show");
    speedDropdownButton.classList.toggle("active");
});
speedDropdownButton.addEventListener("focusout", () => {
    speedDropdown.classList.remove("show");
    speedDropdownButton.classList.remove("active");
})
weightsButton.addEventListener("click", () => {
    isWeight = !isWeight;
    weightsButton.classList.toggle("active");
});
verySlow.addEventListener("click", () => {
    speed = 20;
    currentSpeed.innerText = "Very Slow";
});
slow.addEventListener("click", () => {
    speed = 10;
    currentSpeed.innerText = "Slow";
});
medium.addEventListener("click", () => {
    speed = 4;
    currentSpeed.innerText = "Medium";
});
fast.addEventListener("click", () => {
    speed = 1;
    currentSpeed.innerText = "Fast";
});
veryFast.addEventListener("click", () => {
    speed = .5;
    currentSpeed.innerText = "Very Fast";
});

let isDijkstra = false;
let isAStar = false;
let isBreadthFirst = false;
let isGreedyBestFirst = false;
let isDepthFirst = false;

dijkstraButton.addEventListener("click", () => {
    isDijkstra = true;
    isAStar = false;
    isBreadthFirst = false;
    isGreedyBestFirst = false;
    isDepthFirst = false;
    currentAlgorithm.innerText = "Dikjstra";

})
aStarButton.addEventListener("click", () => {
    isDijkstra = false;
    isAStar = true;
    isBreadthFirst = false;
    isGreedyBestFirst = false;
    isDepthFirst = false;
    currentAlgorithm.innerText = "A-Star";
})
BreadthFirstButton.addEventListener("click", () => {
    isDijkstra = false;
    isAStar = false;
    isBreadthFirst = true;
    isGreedyBestFirst = false;
    isDepthFirst = false;
    currentAlgorithm.innerText = "Breadth First Search";
})
greedyBestFirstButton.addEventListener("click", () => {
    isDijkstra = false;
    isAStar = false;
    isBreadthFirst = false;
    isGreedyBestFirst = true;
    isDepthFirst = false;
    currentAlgorithm.innerText = "Greedy Best First Search";

})
DepthFirstButton.addEventListener("click", () => {
    isDijkstra = false;
    isAStar = false;
    isBreadthFirst = false;
    isGreedyBestFirst = false;
    isDepthFirst = true;
    currentAlgorithm.innerText = "Depth First Search";
})

for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        grid[j + i * cols].element.addEventListener("mouseenter", handleMoveStart);
        grid[j + i * cols].element.addEventListener("mouseenter", handleMoveEnd);
        grid[j + i * cols].element.addEventListener("mouseenter", handleAddWeight);
        grid[j + i * cols].element.addEventListener("mouseenter", handlePlaceWall);
        grid[j + i * cols].element.addEventListener("mouseleave", handleRemoveJustPlaced);
        grid[j + i * cols].element.addEventListener("mouseenter", handleRemoveWall);
    }
}
function handleRemoveJustPlaced(e) {
    e.preventDefault();
    e.target.setAttribute("data-just-placed", "");
}
function handleMoveStart(e) {
    e.preventDefault();
    const nodeElement = e.target;
    if(!nodeElement.classList.contains("end") && !nodeElement.classList.contains("wall") && overStart && !gridOccupied) {
        setStart(+nodeElement.dataset.index1, +nodeElement.dataset.index2);           
    }
}
function handleMoveEnd(e) {
    e.preventDefault();
    const nodeElement = e.target;
    if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("wall") && overEnd && !gridOccupied) {
        setEnd(+nodeElement.dataset.index1, +nodeElement.dataset.index2); 
    }
}
function handlePlaceWall(e) {
    e.preventDefault();
    if(pressed && !gridOccupied) {
        const nodeElement = e.target;
        if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("end") && !nodeElement.classList.contains("wall") && !isWeight) {
            nodeElement.classList.add("wall");
            nodeElement.classList.remove("weight");
            nodeElement.setAttribute("data-just-placed", "true");
            console.log(nodeElement.dataset.justPlaced);
            grid[+nodeElement.dataset.index2 + +nodeElement.dataset.index1 * cols].setWall(true);
            grid[+nodeElement.dataset.index2 + +nodeElement.dataset.index1 * cols].setWeight(0);
        }
    }  
}
function handleAddWeight(e) {
    e.preventDefault();
    if(pressed && isWeight && !gridOccupied) {
        const nodeElement = e.target;
        if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("end") && !nodeElement.classList.contains("weight")) {
            nodeElement.classList.add("weight");
            nodeElement.classList.remove("wall");
            nodeElement.setAttribute("data-just-placed", "true")
            grid[+nodeElement.dataset.index2 + +nodeElement.dataset.index1 * cols].setWall(false);;
            grid[+nodeElement.dataset.index2 + +nodeElement.dataset.index1 * cols].setWeight(2);
        }
    }  
}
function handleRemoveWall(e) {
    e.preventDefault();
    if(pressed && !gridOccupied) {
        const nodeElement = e.target;
        if(!nodeElement.dataset.justPlaced) {
            nodeElement.classList.remove("wall");
            nodeElement.classList.remove("weight");
            grid[+nodeElement.dataset.index2 + +nodeElement.dataset.index1 * cols].setWall(false);
            grid[+nodeElement.dataset.index2 + +nodeElement.dataset.index1 * cols].setWeight(0);
        }
    }  
}
clearWallsButton.addEventListener("click", () => {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(grid[j + i * cols].wall) {
                grid[j + i * cols].setWall(false);
                grid[j + i * cols].element.classList.remove("wall");
            }
        }
    }
});
clearWeightsButton.addEventListener("click", () => {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(grid[j + i * cols].weight > 0) {
                grid[j + i * cols].setWeight(0);
                grid[j + i * cols].element.classList.remove("weight");
            }
        }
    }
});
modalButton.addEventListener("click", () => {
    modal.classList.add("hide");
    overlay.classList.add("hide");
})


function setStart(i, j) {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(grid[j + i * cols].start === true) {
                grid[j + i * cols].start = false;
                grid[j + i * cols].element.classList.remove("start");
            }
        }
    }
    grid[j + i * cols].start = true;
    start = grid[j + i * cols];
    grid[j + i * cols].element.classList.add("start");
}
function setEnd(i, j) {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(grid[j + i * cols].end === true) {
                grid[j + i * cols].end = false;
                grid[j + i * cols].element.classList.remove("end");
            }
        }
    }
    grid[j + i * cols].end = true;
    end = grid[j + i * cols];
    grid[j + i * cols].element.classList.add("end");
    console.log(i, j)
}
function run() {
    if(!gridOccupied) {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                grid[j + i * cols].searched = false;
                grid[j + i * cols].hasBeenCurrent = false;
                grid[j + i * cols].isInClosedSet = false;
                grid[j + i * cols].setG(Infinity);
                grid[j + i * cols].setH(Infinity);
                grid[j + i * cols].setF(Infinity);
                grid[j + i * cols].parent = null;
                grid[j + i * cols].element.classList.remove("closed-set");
                grid[j + i * cols].element.classList.remove("open-set");
                grid[j + i * cols].element.classList.remove("path");
                grid[j + i * cols].element.classList.remove("current");
            }
        }
        if(isDijkstra) {
            gridOccupied = true;
            dijkstra(start, end);
        } else if(isAStar) {
            gridOccupied = true;
            aStar(start, end);
        } else if(isBreadthFirst) {
            gridOccupied = true;
            bfs(start, end);
        } else if(isGreedyBestFirst) {
            gridOccupied = true;
            greedyBestFirst(start, end);
        } else if(isDepthFirst) {
            gridOccupied = true;
            dfs(start, end)
        } else {
            modal.classList.remove("hide");
            overlay.classList.remove("hide");
        }
    }
}
startButton.addEventListener("click", run);
