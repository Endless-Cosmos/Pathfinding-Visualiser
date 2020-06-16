import { removeFromArray, calcDist, calcManhattenDist, path } from "./main.js";
import animate, { initialiseAnimationArray, addToAnimationNodes } from "./animate.js"

const nodesToAnimate = initialiseAnimationArray();

export default function greedBestFirst(start, goal) {
    let openSet = [];
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.shift();
        if(current === goal) { 
            path(current);
            animate(nodesToAnimate);
            console.log("reached");
            return 1;
        }
        removeFromArray(openSet, current);
        current.searched = true;
        addToAnimationNodes({ ...current });
        current.hasBeenCurrent = true;
        addToAnimationNodes({ ...current });
        current.isInClosedSet = true;
        current.neighbors.forEach(neighbor => {
            if(!neighbor.searched && !neighbor.wall) {                
                openSet.push(neighbor);
                addToAnimationNodes({ ...neighbor });
                neighbor.setH(calcDist(neighbor, goal) + neighbor.weight);
                neighbor.parent = current;
            }
        });
            openSet.sort((a, b) => a.h - b.h);
    }
    animate(nodesToAnimate);
    console.log("Not reached");
    return -1;
} 

