import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import LoadingPage from "../loading/Loading"
import { Axios } from '../../Api/Axios';

function Updatecategory() {
    const [categoryE,setcategoryE]=useState('')
    const [categoryA,setcategoryA]=useState('')
    const [disable,setdisable]=useState(true)
    const [err,seterr]=useState('')
    const [loading,setloading]=useState(false)


    
    const {id}=useParams();

    useEffect(()=>{
        Axios.get(`/Categories/${id}`)
        .then((data)=>{
            setcategoryE(data.data.nameEn)
            setcategoryA(data.data.nameAr)
        })
        .then(()=>setdisable(false))
        .catch((error)=>{
          console.log(error)
        })
    },[])

    const nav=useNavigate()

    async function HandelSubmit(e){
        e.preventDefault();
        setloading(true)
        try{
            const res=await Axios.put(`/Categories/${id}`,
              {
                nameEn:categoryE,
                nameAr:categoryA
              }
            )
            console.log(res)
            setloading(false)
            nav('/dashboard/categories')
        }
        catch(err){
            console.log(err)
            setloading(false)
            if(categoryA==='' || categoryE===''){
                seterr('Please Fill Name Field..')
            }
        }
        
    }
  return (
    <>
    {loading ? <LoadingPage/> : <Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Category English name:</Form.Label>
        <Form.Control type="text" value={categoryE} onChange={(e)=> setcategoryE(e.target.value)} placeholder="Update category name ENGLISH.." />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Category Arabic name:</Form.Label>
        <Form.Control type="text" value={categoryA} onChange={(e)=> setcategoryA(e.target.value)} placeholder="Update category name ARABIC.." />
      </Form.Group>
      
      {err !== '' && <span className="error">{err}</span>}
      <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={disable}
        >Update</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/categories', { replace: true })}
        >Cancel</button>
      </div>    </Form>}
    </>
  )
}

export default Updatecategory