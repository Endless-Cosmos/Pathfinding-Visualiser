import { setOccupation } from "./main.js";

const nodesToAnimate = [];

export default function animate(nodesToAnimate) {
    console.log(nodesToAnimate)
    for(let i = 0; i < nodesToAnimate.length; i++) {
        setTimeout(() => {
            if(nodesToAnimate[i].searched && !nodesToAnimate[i].hasBeenCurrent) {
                nodesToAnimate[i].element.classList.remove("open-set");
                nodesToAnimate[i].element.classList.add("current");
            } else if(nodesToAnimate[i].hasBeenCurrent && !nodesToAnimate[i].isInClosedSet) {
                nodesToAnimate[i].element.classList.remove("current");
                nodesToAnimate[i].element.classList.add("closed-set");
            } else if(!nodesToAnimate[i].searched) {
                nodesToAnimate[i].element.classList.add("open-set");
            } else {
                nodesToAnimate[i].element.classList.add("path");
                console.log("hello")
            }
            if(i === nodesToAnimate.length - 1) {
                nodesToAnimate.splice(0, nodesToAnimate.length);
                setOccupation(false);
            }
        }, 2 * i + 1);
    }
}
export function initialiseAnimationArray() {
    return nodesToAnimate;
}

export function addToAnimationNodes(node) {
    nodesToAnimate.push(node)
}