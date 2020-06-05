import { removeFromArray, speed, path } from "./main.js";
import animate, { addToAnimationNodes, initialiseAnimationArray } from "./animate.js"

const nodesToAnimate = initialiseAnimationArray()
    
export default function dfs(start, goal) {
    let openSet = [];
    openSet.push(start);
    let current;
    while(openSet.length > 0) {
        current = openSet.pop();
        current.element.classList.add("current")
        if(current === goal) { 
            path(current)
            console.log("reached");
            animate(nodesToAnimate);
            return 1;
        }
        removeFromArray(openSet, current);
        current.searched = true;
        addToAnimationNodes({ ...current });
        current.hasBeenCurrent = true;
        addToAnimationNodes({ ...current });
        current.isInClosedSet = true;
        current.element.classList.remove("current")
        current.neighbors.forEach(neighbor => {
            if(!neighbor.searched && !neighbor.wall) {
                    openSet.push(neighbor);
                    addToAnimationNodes({ ...neighbor });
                    neighbor.parent = current;
                }
                
        });
    }
    animate(nodesToAnimate);
    console.log("Not reached");
    return -1;
} 

