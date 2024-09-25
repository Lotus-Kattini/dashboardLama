
import React, { useContext} from 'react'
import { NavLink} from 'react-router-dom'
import { Menu } from '../../context/Menucontext'
import { WindowSize } from '../../context/Windowcontext'
import {Links} from './Links'

function SideBar() {
  const menu=useContext(Menu);
  const isopen=menu.isopen;

  const windowSizeee=useContext(WindowSize);

  const windowsizestate=windowSizeee.windowSize;


  return (
    <>
    <div style={{position:'fixed',
      top:'70px',left:'0',
      width:'100%',height:'100vh',
      backgroundColor:'rgba(0,0,0,0.5)',
      display:windowsizestate <'600' && isopen ? 'block' :'none',
    }}></div>
    <div className='side-bar pt-3' style={{
      width: isopen ? '220px' :'fit-content',
      left : windowsizestate < '600' ? (isopen ? 0 :'-100%') :'0',
      position: windowsizestate <'600' ? 'fixed' : 'sticky',

    }}>
      {Links.map((link,index)=>(
        
        <NavLink key={index} to={link.path}  className='flex items-center gap-2 side-bar-link'>
        <div style={{
          padding : isopen ? '10px 8px 10px 15px':'10px 13px'
        }} icon={''}>

        {link.icon}
        </div>
          <p className='m-0' style={{
            display: isopen ? 'block' : 'none'
          }}>{link.name}</p>
        </NavLink>
      ))}
    </div>
    </>
  )
}

export default SideBar