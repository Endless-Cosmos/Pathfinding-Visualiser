
    import dijkstra from "./dijkstra.js";  
    import aStar from "./a-star.js";  
    import bfs from "/breadth-first-search.js";
    import greedyBestFirst from "./greedy-best-first-search.js";

    const cellContainer = document.getElementById("cell-grid");
    const startButton = document.getElementById("start-button");
    const clearWallsButton = document.getElementById("clear-walls-button")

    //switch these
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
            this.g = g;
        }
        setH(h) {
            this.h = h;
        }
        addWeight(amt) {
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
            grid[i][j].element.setAttribute("data-index1", `${i}`)
            grid[i][j].element.setAttribute("data-index2", `${j}`)
            grid[i][j].element.classList.add("cell");
            cellContainer.appendChild(grid[i][j].element);
            if(grid[i][j].wall) {
                grid[i][j].element.classList.add("wall")
            }
        }
    }
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            grid[i][j].setNeighbors(grid);
        }
    }

    let start, end, pressed, overStart, overEnd
    let gridOccupied = false;
    

    setStart(5, 5);
    setEnd(10, 20);


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

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            grid[i][j].element.addEventListener("mousemove", handleMoveStart);
            grid[i][j].element.addEventListener("mousemove", handleMoveEnd);
            grid[i][j].element.addEventListener("mousemove", handlePlaceWallClick);
        }
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
        }
    }
    function handlePlaceWallClick(e) {
        e.preventDefault()
        if(pressed && !gridOccupied) {
            const nodeElement = e.target;
            if(!nodeElement.classList.contains("start") && !nodeElement.classList.contains("end")) {
                nodeElement.classList.add("wall");
                grid[nodeElement.dataset.index1][nodeElement.dataset.index2].setWall(true);
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
        grid[i][j].element.classList.add("start")
    }
    function setEnd(i, j) {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(grid[i][j].end === true) {
                    grid[i][j].end = false;
                    grid[i][j].element.classList.remove("end")
                }
            }
        }
        grid[i][j].end = true;
        end = grid[i][j];
        grid[i][j].element.classList.add("end")
    }
    
    startButton.addEventListener("click", () => {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                grid[i][j].searched = false;
            }
        }
        if(!gridOccupied) {
            gridOccupied = true;
            aStar(start, end);
        }
    })

