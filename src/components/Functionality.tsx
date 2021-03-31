import {useState, useEffect} from 'react';

//The following hook is created by Divjoy's Gabe Ragland: https://twitter.com/gabe_ragland. 
//I am using it to help make dynamic window functions easier. I have modified it slightly
//to include functionality for full page heights to make modals behave better
function useWindowSize() {
    interface PageWindow {
        width: number|undefined;
        height: number|undefined;
        pageHeight: number|undefined
    }
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<PageWindow>({
      width: undefined,
      height: undefined,
      pageHeight: undefined
    });
  
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
          pageHeight: document.documentElement.offsetHeight
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
  
    return windowSize;
  }

function deepClone(value: any): any{
    if (Array.isArray(value)){
        return value.map(deepClone);
    } else if ((typeof value) == "object"){
        let obj: any = {};
        for (let key in value){
            obj[key] = deepClone(value[key]);
        }
        return obj;
    } else {
        return value;
    }
}
export {deepClone, useWindowSize};