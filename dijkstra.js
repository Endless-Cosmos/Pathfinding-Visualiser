{
    const cellContainer = document.getElementById("cell-grid");
    const dijkstraButton = document.getElementById("dijkstra");

    const size = 20;
    const cols = 30;
    const rows = 60;

    function calcDist(node1, node2) {
        return Math.sqrt(((node1.i - node2.i) * (node1.i - node2.i)) + ((node1.j - node2.j) * (node1.j - node2.j)))
    }
    function calcManhattenDist(node1, node2) {
        return Math.abs(node1.i )
    } 
    async function sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    } 
    function removeFromArray(arr, el) {
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
            this.distance = this.weight;
            this.weight = 0;
            this.element = null;
            this.parent = null;
            this.wall = false;
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
        setDist(dist) {
            this.distance = dist;
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

    const speed = 10;

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
                    }
                }
            }
        }
    }

    let gridOccupied = false;
    
    async function Djkstras(grid, start, goal) {
        let openSet = [];
        let closedSet = [];
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                grid[i][j].setDist(Infinity);
            }
        }
        start.setDist(0);
        openSet.push(start);
        let current;
        while(openSet.length > 0) {
            current = openSet.shift();
            current.element.classList.add("current")
            if(current === goal) { 
                const path = []; 
                while(current.parent != null) {
                    path.push(current);
                    current.element.classList.add("path")
                    current = current.parent;
                    await sleep(10);
                }
                console.log("reached")
                return 1;
            }
            removeFromArray(openSet, current);
            closedSet.push(current);
            current.element.classList.remove("open-set");
            current.element.classList.add("closed-set");
            await sleep(speed);
            current.element.classList.remove("current")
            let neighbors = [];
            current.neighbors.forEach(neighbor => {
                if(neighbor.distance == Infinity && !neighbor.wall) {
                    let temp = calcDist(current, neighbor) + current.distance;
                    neighbor.parent = current;
                    if(openSet.includes(neighbor) && neighbor.distance > temp) {
                        neighbor.setDist(temp);
                    } else {
                        neighbor.setDist(calcDist(neighbor, current) + current.distance)
                        neighbors.push(neighbor);
                    }
                    console.log(neighbor)
                }
            });
            if(neighbors.length > 0) {
                neighbors.sort((a, b) => a.distance - b.distance);
                neighbors.forEach(neighbor => {
                    openSet.push(neighbor);
                    neighbor.element.classList.add("open-set")
                });
                await sleep(speed);
            }

        }
        console.log("Not reached");
        return -1;
    } 

    dijkstraButton.addEventListener("click", () => {
        if(!gridOccupied) {
            gridOccupied = true;
            Djkstras(grid, grid[cols - 1][rows - 1], grid[0][0]);
        }
    })
     
}