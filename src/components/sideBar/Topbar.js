
import { useContext,useState } from 'react'
import { Menu } from '../../context/Menucontext'
import { FaBarsStaggered } from "react-icons/fa6";
import { Button } from 'react-bootstrap';
import Cookie from 'cookie-universal'
import { useNavigate } from 'react-router-dom';
import { Axios } from '../../Api/Axios';
import { ToastContainer, toast } from 'react-toastify';
import { IoLogOutOutline } from "react-icons/io5";



function TopBar() {
  const menu=useContext(Menu);
  const setisopen=menu.setisopen;
  const nav=useNavigate()  

  const cookie=Cookie()
  const email=cookie.get('email')

  const notify = () => toast.success(`Loged out successfully`,{
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  async function HandelLogout(){
    try{
      let res=await Axios.post(`/Account/LogOut`)
      cookie.remove('token')
      console.log(res)
      notify()
      nav('/')
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
    <div className='top-bar flex items-center justify-between'>
      <div className='d-flex items-center gap-3'>
      <h3>Lamar Dashboard</h3>
      <FaBarsStaggered onClick={()=>{setisopen((prev)=>!prev)}} cursor={'pointer'} icon={''} />
      </div>
      <div className='d-flex align-items-center gap-2 '>
        <p className='text-[gray]'>{email}</p>
        <IoLogOutOutline onClick={HandelLogout} size={23} style={{cursor:'pointer'}}/>
      </div>

    </div>
      <ToastContainer />
    </>
  )
}

export default TopBar