import { sleep, removeFromArray, speed, setOccupation, path } from "./main.js";
    
export default async function bfs(start, goal) {
    let openSet = [];
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.shift();
        current.element.classList.add("current")
        if(current === goal) { 
            await path(current)
            console.log("reached")
            setOccupation(false);
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
    setOccupation(false)
    return -1;
} 

