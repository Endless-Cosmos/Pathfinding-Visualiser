import { removeFromArray, speed, path } from "./main.js";
import animate, { addToAnimationNodes, initialiseAnimationArray } from "./animate.js";

const nodesToAnimate = initialiseAnimationArray();
    
export default async function bfs(start, goal) {
    let openSet = [];
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.shift();
        if(current === goal) { 
            path(current);
            animate(nodesToAnimate)
            console.log("reached")
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
                    neighbor.parent = current
                }
                
        });
    }
    console.log("Not reached");
    animate(nodesToAnimate);
    return -1;
} 

