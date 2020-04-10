    import { cols, rows, sleep, removeFromArray, speed, calcDist } from "./main.js";

    export default async function aStar(grid, start, goal) {
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
            current.neighbors.forEach(neighbor => {
                if(!closedSet.includes(neighbor) && !neighbor.wall) {
                    let temp = calcDist(current, neighbor) + current.distance;
                    neighbor.parent = current;
                    if(openSet.includes(neighbor) && neighbor.g > temp) {
                        neighbor.setG(temp);
                    } else {
                        neighbor.setG(calcDist(neighbor, current) + current.g)
                        openSet.push(neighbor);
                        neighbor.element.classList.add("open-set")
                        neighbor.setH(calcDist(neighbor, goal))
                    }
                    neighbor.f = neighbor.g + neighbor.h;
                }
            });
                openSet.sort((a, b) => a.f - b.f);
                await sleep(speed);
        }
        console.log("Not reached");
        return -1;
    } 

