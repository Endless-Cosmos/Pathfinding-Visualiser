{
    const cellContainer = document.getElementById("cell-grid");

    const size = 20;
    const cols = 30;
    const rows = 30;

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
            this.distance = 0;
            this.weight = 0;
            this.element = null;
            this.parent = null;
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
        }
    }
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].setNeighbors(grid);
        }
    }
    
    async function Djkstras(grid, start, goal) {
        let path = [];
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
            if(current === goal) {
                
                if(this.parent != null) {
                    
                }
                return 1;
            }
            removeFromArray(openSet, current);
            closedSet.push(current);
            current.element.classList.remove("open-set");
            current.element.classList.add("closed-set");
            await sleep(15);
            let neighbors = [];
            current.neighbors.forEach(neighbor => {
                if(neighbor.distance == Infinity && !closedSet.includes(neighbor)) {
                    neighbor.setDist(calcDist(start, neighbor));
                    neighbors.push(neighbor);
                }
            });
            if(neighbors.length > 0) {
                neighbors.sort((a, b) => a.distance - b.distance);
                neighbors.forEach(neighbor => {
                    openSet.push(neighbor);
                    neighbor.element.classList.add("open-set")
                });
                await sleep(15);
            }

        }
        console.log("Not reached");
        return -1;
    } 
    Djkstras(grid, grid[cols / 2][rows / 2], grid[0][0]);
     
}