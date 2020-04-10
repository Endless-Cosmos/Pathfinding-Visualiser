    import { cols, rows, sleep, removeFromArray, speed, calcDist } from "./main.js";
    
    export default async function dijkstra(grid, start, goal) {
        let openSet = [];
        let closedSet = [];
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                grid[i][j].setG(Infinity);
            }
        }
        start.setG(0);
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
                if(neighbor.g == Infinity && !neighbor.wall) {
                    let temp = calcDist(current, neighbor) + current.g;
                    neighbor.parent = current;
                    if(openSet.includes(neighbor) && neighbor.g > temp) {
                        neighbor.setG(temp);
                    } else {
                        neighbor.setG(calcDist(neighbor, current) + current.g)
                        neighbors.push(neighbor);
                    }
                }
            });
            if(neighbors.length > 0) {
                neighbors.sort((a, b) => a.g - b.g);
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

