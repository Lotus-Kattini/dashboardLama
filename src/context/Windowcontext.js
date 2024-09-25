import { createContext, useEffect, useState } from "react"

export const WindowSize=createContext('')

function Windowcontext({children}) {
    const [windowSize,setwindowSize]=useState(window.innerWidth);

    useEffect(()=>{
        function setwindowWidth(){
            setwindowSize(window.innerWidth)
        }

        window.addEventListener('resize',setwindowWidth);

        return() =>{
            window.removeEventListener('resize',setwindowWidth)
        }
    },[])


  return (
    <WindowSize.Provider value={{windowSize,setwindowSize}}>{children}</WindowSize.Provider>
  )
}

export default Windowcontext