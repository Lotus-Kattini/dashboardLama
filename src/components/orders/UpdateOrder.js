import { Axios } from '../../Api/Axios';
import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import LoadingPage from "../loading/Loading"

function UpdateOrder() {
    const [address,setaddress]=useState('')
    const [status,setstatus]=useState('')
    const [comment,setcomment]=useState('')
    const [err,seterr]=useState('')
    const [loading,setloading]=useState(false)
    const [deleveryDate, setdeleveryDate] = useState('')

    const {id}=useParams();

    useEffect(()=>{
        Axios.get(`/Order/${id}`)
        .then((data)=>{
            setaddress(data.data.address)
            setstatus(data.data.status)
            setcomment(data.data.comment)
        })
        .catch((error)=>{
          console.log(error)
        })
    },[])


    const nav=useNavigate()

    async function HandelSubmit(e){
        e.preventDefault();
        setloading(true)
        try{
            const res=await Axios.put(`/Order/${id}`,
              {
                orderStatus:status,
                comment:comment,
                // deleveryDate:deleveryDate,
              }
            )
            console.log(res)
            setloading(false)
            nav('/dashboard/orders')
        }
        catch(err){
            console.log(err)
            setloading(false)
        }
        
    }
  return (
    <>
    {loading ? <LoadingPage/> : <Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
    
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Address:</Form.Label>
        <Form.Control type="text" value={address} disabled/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <Form.Label>Staus:</Form.Label>
      <Form.Select value={status} onChange={(e)=> setstatus(e.target.value)}>
          <option disabled value={''}>Update Status</option>
          <option  value={'paid'}>Paid</option>
          <option  value={'refunded'}>Refunded</option>
          <option  value={'deleverd'}>Deleverd</option>
          <option  value={'booked'}>Booked</option>
          <option  value={'cancelled'}>Cancelled</option>
      </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Comments:</Form.Label>
        <Form.Control type="text" as={'textarea'} value={comment} onChange={(e)=> setcomment(e.target.value)} placeholder="Update Comment.." />
      </Form.Group>

      { status === 'booked' && <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Estemate delevery date:</Form.Label>
        <Form.Control type="date"  value={deleveryDate} onChange={(e)=> setdeleveryDate(e.target.value)} placeholder="delevery date.." />
      </Form.Group>}
      
      {err !== '' && <span className="error">{err}</span>}
      <div className="d-flex align-items-center justify-content-between">
          <button style={{ marginTop: '0.5rem' }}
            className='btn btn-primary'
            disabled={status === '' && 'disable'}
          >Update</button>
          <button style={{ marginTop: '0.5rem' }}
            className='btn btn-primary'
            onClick={() => nav('/dashboard/orders', { replace: true })}
            >Cancel</button>
        </div>   
         </Form>}
    </>
  )
}

export default UpdateOrder