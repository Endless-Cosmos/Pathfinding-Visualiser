
    import dijkstra from "./dijkstra.js";  
    import aStar from "./a-star.js";  

    const cellContainer = document.getElementById("cell-grid");
    const dijkstraButton = document.getElementById("dijkstra");
    const clearWallsButton = document.getElementById("clear-walls")

    //switch these
    export const cols = 30;
    export const rows = 60;
    export const speed = 10;


    export function calcDist(node1, node2) {
        return Math.sqrt(((node1.i - node2.i) * (node1.i - node2.i)) + ((node1.j - node2.j) * (node1.j - node2.j)))
    }
    // function calcManhattenDist(node1, node2) {
    //     return Math.abs(node1.i )
    // } 
    export async function sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    } 
    export function removeFromArray(arr, el) {
        for(let i = arr.length - 1; i > 0; i--) {
            if(arr[i] === el) {
                arr.splice(i, 1);
                
            }
        }
    }

    class Node {
        constructor(i, j) {
            this.i = i;
            this.j = j;
            this.neighbors = [];
            this.g = this.weight;
            this.weight = 0;
            this.element = null;
            this.parent = null;
            this.wall = false;
            this.start = false;
            this.end = false;
            this.h = 0;
            this.f = 0;
        }
        setNeighbors(grid) {
            if(this.i > 0) {
                this.neighbors.push(grid[this.i - 1][this.j]);
            }
            if(this.j > 0) {
                this.neighbors.push(grid[this.i][this.j - 1])
            }
            if(this.i < cols - 1) {
                this.neighbors.push(grid[this.i + 1][this.j])
            }
            if(this.j < rows - 1) {
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



    function create2dArray(cols, rows) {
        let arr = new Array(cols)
        for(let i = 0; i < cols; i++) {
            arr[i] = new Array(rows);
        }
        return arr;
    }
    let grid = create2dArray(cols, rows);

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j] = new Node(i, j);
            grid[i][j].element = document.createElement("div");
            grid[i][j].element.classList.add("cell");
            cellContainer.appendChild(grid[i][j].element);
            if(grid[i][j].wall) {
                grid[i][j].element.classList.add("wall")
            }
        }
    }
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].setNeighbors(grid);
        }
    }
    let pressed = false;

    document.body.addEventListener("mousedown", () => {
        pressed = true;
        console.log(pressed)
    })
    document.body.addEventListener("mouseup", () => {
        pressed = false;
        console.log(pressed)
    })

    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
                grid[i][j].element.addEventListener("mousemove", handleClick);
        }
    }
    function handleClick(e) {
        if(pressed) {
            const node = e.target;
            node.classList.add("wall");
            for(let i = 0; i < cols; i++) {
                for(let j = 0; j < rows; j++) {
                    if(grid[i][j].element.classList.contains("wall")) {
                        grid[i][j].setWall(true);
                        console.log("wall")
                    }
                }
            }
        }
    }
    clearWallsButton.addEventListener("click", () => {
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                if(grid[i][j].wall) {
                    grid[i][j].setWall(false);
                    grid[i][j].element.classList.remove("wall");
                }
            }
        }
    })

    let gridOccupied = false;

    let start, end;

    function setStart(i, j) {
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                if(grid[i][j].start = true) {
                    grid[i][j].start = false;
                    grid[i][j].element.classList.remove("start")
                }
            }
        }
        grid[i][j].start = true;
        start = grid[i][j];
        grid[i][j].element.classList.add("start")
    }
    function setEnd(i, j) {
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                if(grid[i][j].end = true) {
                    grid[i][j].end = false;
                    grid[i][j].element.classList.remove("end")
                }
            }
        }
        grid[i][j].end = true;
        end = grid[i][j];
        grid[i][j].element.classList.add("end")
    }

    setStart(0, 0);
    setEnd(20, 20);
    

    dijkstraButton.addEventListener("click", () => {
        if(!gridOccupied) {
            gridOccupied = true;
            aStar(grid, start, end);
        }
    })

