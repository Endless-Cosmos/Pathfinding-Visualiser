import { cols, rows, sleep, removeFromArray, speed, calcDist } from "./main.js";
    
export default async function bfs(grid, start, goal) {
    let openSet = [];
    let closedSet = [];
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
                    openSet.push(neighbor);
                    neighbor.parent = current
                    neighbor.element.classList.add("open-set");
                }
                
        });
            await sleep(speed);
    }
    console.log("Not reached");
    return -1;
} 

