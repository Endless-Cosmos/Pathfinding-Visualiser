    import { sleep, removeFromArray, speed, calcDist, calcManhattenDist, setOccupation, path } from "./main.js";

    export default async function aStar(start, goal) {
        let openSet = [];
        start.setG(0);
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
                    let temp = calcDist(current, neighbor) + current.g;
                    if(openSet.includes(neighbor) && neighbor.g > temp) {
                        neighbor.setG(temp);
                        neighbor.parent = current;
                    } else {
                        neighbor.setG(calcDist(neighbor, current) + current.g)
                        openSet.push(neighbor);
                        neighbor.element.classList.add("open-set")
                        neighbor.setH(calcDist(neighbor, goal))
                        neighbor.parent = current;
                    }
                    neighbor.f = neighbor.g + neighbor.h;
                }
            });
                openSet.sort((a, b) => a.f - b.f);
                await sleep(speed);
        }
        console.log("Not reached");
        setOccupation(false);
        return -1;
    } 

