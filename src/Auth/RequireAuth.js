import axios from 'axios';
import Cookie from 'cookie-universal'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

function RequireAuth() {
    const cookie=Cookie();
    const token=cookie.get('token')

    const nav=useNavigate()

    

  return (
    <>
        {token ?<Outlet/> : <Navigate to={'/'} replace={true}/>}
    </>
  )
}

export default RequireAuth