import { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import LoadingPage from "../loading/Loading"
import { Axios } from '../../Api/Axios';
import ConfirmationModal from "../helpers/ConfirmationModal";
import Popup from "../helpers/Popup";



function Categories() {
    const [nameEn,setnameEn]=useState('')
    const [nameAr,setnameAr]=useState('')
    const [image,setimage]=useState('')
    const [err,seterr]=useState('')
    const [loading,setloading]=useState(false)
    const [showModal, setShowModal] = useState(false);


    const nav=useNavigate()

    
    
    const focus=useRef(null);
    useEffect(()=>{
        focus.current.focus();
    },[])


    async function HandelSubmit(e){
        e.preventDefault();
        setloading(true)
        try{
            const res=await Axios.post(`/Categories`,{
              nameEn:nameEn,
              nameAr:nameAr,
            })
            setloading(false)
            nav('/dashboard/categories')
        }
        catch(err){
            console.log(err)
            setloading(false)
            
            if(nameAr==='' || nameEn===''){
                seterr('Please Fill name Fielda..')
            }
            if(err.response?.status===400){
              setShowModal(true)
            }
        }
        
    }
  return (
    <>
      {loading ? <LoadingPage/> : <Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name in English:</Form.Label>
        <Form.Control type="text" value={nameEn} onChange={(e)=> setnameEn(e.target.value)} placeholder="Enter the name.." ref={focus}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name in Arabic:</Form.Label>
        <Form.Control type="text" value={nameAr} onChange={(e)=> setnameAr(e.target.value)} placeholder="Enter the name.." ref={focus}/>
      </Form.Group>
      

      
      {err !== '' && <span className="error">{err}</span>}
      <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={(nameEn.length>1 && nameAr.length >1) ? false: true}
        >Add</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/categories', { replace: true })}
        >Cancel</button>
      </div>
    </Form>}
      <Popup
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Error"
        body="This Category is already exist"
      />
    </>
  )
}

export default Categories