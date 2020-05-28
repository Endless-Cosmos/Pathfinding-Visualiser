
    import dijkstra from "./dijkstra.js";  
    import aStar from "./a-star.js";  
    import bfs from "/breadth-first-search.js";
    import greedyBestFirst from "./greedy-best-first-search.js";
    import dfs from "./depth-first-search.js"

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
    const dropdown = document.getElementById("dropdown-menu");
    const dropdownButton = document.getElementById("dropdown-button");

    const rows = 20;
    const cols = 40;
    export const speed = 10;


    export function calcDist(node1, node2) {
        return Math.sqrt(Math.pow((node2.i - node1.i), 2) + Math.pow((node2.j - node1.j), 2))
    }
    export function calcManhattenDist(node1, node2) {
        return Math.abs(node1.i - node2.i) + Math.abs(node1.j - node2.j);
    } 
    export async function sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    } 
    export function removeFromArray(arr, el) {
        for(let i = arr.length - 1; i >= 0; i--) {
            if(arr[i] === el) {
                arr.splice(i, 1);    
            }
        }
    }
    export async function path(current) {
        const path = []; 
            while(current.parent != null) {
                path.push(current);
                current.element.classList.add("path")
                current = current.parent;
                await sleep(speed);
            }
    }

    class Node {
        constructor(i, j) {
            this.i = i;
            this.j = j;
            this.searched = null;
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
                this.neighbors.push(grid[this.i - 1][this.j]);
            }
            if(this.j > 0) {
                this.neighbors.push(grid[this.i][this.j - 1])
            }
            if(this.i < rows - 1) {
                this.neighbors.push(grid[this.i + 1][this.j])
            }
            if(this.j < cols - 1) {
                this.neighbors.push(grid[this.i][this.j + 1])
            }
        }
        setG(g) {
            this.g = g + this.weight;
        }
        setH(h) {
            this.h = h;
        }
        setWeight(amt) {
            this.weight = amt;
        }
        setWall(boolean) {
            this.wall = boolean;
        }
    }

    function create2dArray(rows, cols) {
        let arr = new Array(rows)
        for(let i = 0; i < rows; i++) {
            arr[i] = new Array(cols);
        }
        return arr;
    }
    let grid = create2dArray(rows, cols);

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            grid[i][j] = new Node(i, j);
            grid[i][j].element = document.createElement("div");
            grid[i][j].element.setAttribute("data-index1", `${i}`);
            grid[i][j].element.setAttribute("data-index2", `${j}`);
            grid[i][j].element.classList.add("cell");
            cellContainer.appendChild(grid[i][j].element);
            if(grid[i][j].wall) {
                grid[i][j].element.classList.add("wall");
            }
        }
    }
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            grid[i][j].setNeighbors(grid);
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
    })
    document.body.addEventListener("mousedown", e => {
        if(e.target.classList.contains("end")) {
            overEnd = true;
        }
    })
    dropdownButton.addEventListener("click", () => {
        dropdown.classList.toggle("show");
        dropdownButton.classList.toggle("dropdown-active");
    })
    dropdownButton.addEventListener("focusout", () => {
        dropdown.classList.remove("show");
        dropdownButton.classList.remove("dropdown-active");

    })
    weightsButton.addEventListener("click", () => {
        isWeight = !isWeight;
    })

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

    })
    aStarButton.addEventListener("click", () => {
        isDijkstra = false;
        isAStar = true;
        isBreadthFirst = false;
        isGreedyBestFirst = false;
        isDepthFirst = false;
    })
    BreadthFirstButton.addEventListener("click", () => {
        isDijkstra = false;
        isAStar = false;
        isBreadthFirst = true;
        isGreedyBestFirst = false;
        isDepthFirst = false;
    })
    greedyBestFirstButton.addEventListener("click", () => {
        isDijkstra = false;
        isAStar = false;
        isBreadthFirst = false;
        isGreedyBestFirst = true;
        isDepthFirst = false;

    })
    DepthFirstButton.addEventListener("click", () => {
        isDijkstra = false;
        isAStar = false;
        isBreadthFirst = false;
        isGreedyBestFirst = false;
        isDepthFirst = true;
    })

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            grid[i][j].element.addEventListener("mouseenter", handleMoveStart);
            grid[i][j].element.addEventListener("mouseenter", handleMoveEnd);
            grid[i][j].element.addEventListener("mouseenter", handleAddWeight);
            grid[i][j].element.addEventListener("mouseenter", handlePlaceWall);
            grid[i][j].element.addEventListener("mouseleave", handleRemoveJustPlaced);
            grid[i][j].element.addEventListener("mouseenter", handleRemoveWall);
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
            setStart(nodeElement.dataset.index1, nodeElement.dataset.index2);           
        }
    }
    function handleMoveEnd(e) {
        e.preventDefault();
        const nodeElement = e.target;
        if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("wall") && overEnd && !gridOccupied) {
            setEnd(nodeElement.dataset.index1, nodeElement.dataset.index2); 
            console.log("hello")          
        }
    }
    function handlePlaceWall(e) {
        e.preventDefault()
        if(pressed && !gridOccupied) {
            const nodeElement = e.target;
            if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("end") && !nodeElement.classList.contains("wall") && !isWeight) {
                nodeElement.classList.add("wall");
                nodeElement.classList.remove("weight");
                nodeElement.setAttribute("data-just-placed", "true")
                console.log(nodeElement.dataset.justPlaced)
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWall(true);
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWeight(0);
            }
        }  
    }
    function handleAddWeight(e) {
        e.preventDefault()
        if(pressed && isWeight && !gridOccupied) {
            const nodeElement = e.target;
            if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("end") && !nodeElement.classList.contains("weight")) {
                nodeElement.classList.add("weight");
                nodeElement.classList.remove("wall");
                nodeElement.setAttribute("data-just-placed", "true")
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWall(false);;
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWeight(2);
            }
        }  
    }
    function handleRemoveWall(e) {
        e.preventDefault()
        if(pressed && !gridOccupied) {
            const nodeElement = e.target;
            if(!nodeElement.dataset.justPlaced) {
                nodeElement.classList.remove("wall");
                nodeElement.classList.remove("weight");
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWall(false);
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWeight(0);
            }
        }  
    }
    clearWallsButton.addEventListener("click", () => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(grid[i][j].wall) {
                    grid[i][j].setWall(false);
                    grid[i][j].element.classList.remove("wall");
                }
            }
        }
    });
    clearWeightsButton.addEventListener("click", () => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(grid[i][j].weight > 0) {
                    grid[i][j].setWeight(0);
                    grid[i][j].element.classList.remove("weight");
                }
            }
        }
    });

   
    function setStart(i, j) {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(grid[i][j].start === true) {
                    grid[i][j].start = false;
                    grid[i][j].element.classList.remove("start");
                }
            }
        }
        grid[i][j].start = true;
        start = grid[i][j];
        grid[i][j].element.classList.add("start");
    }
    function setEnd(i, j) {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(grid[i][j].end === true) {
                    grid[i][j].end = false;
                    grid[i][j].element.classList.remove("end");
                }
            }
        }
        grid[i][j].end = true;
        end = grid[i][j];
        grid[i][j].element.classList.add("end")
    }
    function run() {
        if(gridOccupied === false) {
            for(let i = 0; i < rows; i++) {
                for(let j = 0; j < cols; j++) {
                    grid[i][j].searched = false;
                    grid[i][j].element.classList.remove("closed-set");
                    grid[i][j].element.classList.remove("open-set");
                    grid[i][j].element.classList.remove("path");
                    grid[i][j].element.classList.remove("current");
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
                console.log("Select an algorithm")
            }
        }
    }
    run();

    startButton.addEventListener("click", run);
    