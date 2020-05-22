import { sleep, removeFromArray, speed, path } from "./main.js";
    
export default async function dfs(start, goal) {
    let openSet = [];
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.pop();
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
                    neighbor.parent = current
                    neighbor.element.classList.add("open-set");
                }
                
        });
            await sleep(speed);
    }
    console.log("Not reached");
    return -1;
} 

