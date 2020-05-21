import { sleep, removeFromArray, speed, calcDist, calcManhattenDist, path } from "./main.js";

export default async function greedBestFirst(start, goal) {
    let openSet = [];
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.shift();
        current.element.classList.add("current")
        if(current === goal) { 
            path(current)
            console.log("reached")
            return 1;
        }
        removeFromArray(openSet, current);
        current.searched = true;
        current.element.classList.remove("open-set");
        current.element.classList.add("closed-set");
        await sleep(speed);
        current.element.classList.remove("current")
        current.neighbors.forEach(neighbor => {
            if(!neighbor.searched && !neighbor.wall) {                
                openSet.push(neighbor);
                neighbor.element.classList.add("open-set")
                neighbor.setH(calcDist(neighbor, goal))
                neighbor.parent = current;
            }
        });
            openSet.sort((a, b) => a.h - b.h);
            await sleep(speed);
    }
    console.log("Not reached");
    return -1;
} 
