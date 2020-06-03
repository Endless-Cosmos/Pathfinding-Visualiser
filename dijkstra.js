import { removeFromArray, speed, calcDist, setOccupation, path } from "./main.js";
import animate from "./animate.js";

const nodesToAnimate = [];

export function addToAnimationNodes(node) {
    nodesToAnimate.push(node)
}
    
export default async function dijkstra(start, goal) {
    let openSet = [];
    start.setG(0);
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.shift();
        if(current === goal) { 
            await path(current)
            console.log("reached");
            animate(nodesToAnimate)
            return 1;
        }
        removeFromArray(openSet, current);
        current.searched = true;
        addToAnimationNodes({...current });
        current.hasBeenCurrent = true;
        addToAnimationNodes({ ...current });
        current.isInClosedSet = true;
        current.neighbors.forEach(neighbor => {
            if(!neighbor.searched && !neighbor.wall) {
                let temp = calcDist(current, neighbor) + current.g;
                if(openSet.includes(neighbor) && neighbor.g > temp) {
                    neighbor.setG(temp);
                    neighbor.parent = current;
                } else {
                    neighbor.setG(calcDist(neighbor, current) + current.g);
                    openSet.push(neighbor);
                    addToAnimationNodes({ ...neighbor })
                    neighbor.parent = current;
                }
            }
        });
            openSet.sort((a, b) => a.g - b.g);
    }
    console.log("Not reached");
    setOccupation(false);
    return -1;
} 

