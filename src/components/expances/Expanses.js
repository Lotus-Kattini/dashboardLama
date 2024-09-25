import { Axios } from '../../Api/Axios';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../loading/Loading';

function Expances() {
    const [cost,setcost]=useState()
    const [currency, setcurrency] = useState('')
    const [description, setdescription] = useState('')
    const [details, setdetails] = useState('')
    const [loading,setloading]=useState(false)
    const [disabled,setdisabled]=useState(true)


    const nav=useNavigate()
    useEffect(() => {
      if (cost && currency ) {
          setdisabled(false);
      } else {
        setdisabled(true);
      }
  }, [cost, currency]);


    async function Handelsubmit(e){
      e.preventDefault();
      
      setloading(true)
      try{
        let res=await Axios.post(`/Expenses`,{
          cost:cost,
          currency:currency,
          description:description,
          details:details
        })
        nav('/dashboard/expences')
        setloading(false)
      }catch(error){
        console.log(error)
        setloading(false)
      }
    }

  return (
    <>
    { loading ? <LoadingPage/> : <Form className='bg-white w-full mx-2 p-3' onSubmit={Handelsubmit}>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Cost:</Form.Label>
        <Form.Control  type="number" name='cost' maxLength={12} value={cost} onChange={(e)=>setcost(e.target.value)} placeholder="Cost.." />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="currency">
                        <Form.Label>Currency:</Form.Label>
                        <Form.Select 
                            name='currency' 
                            value={currency} 
                            onChange={(e) => setcurrency(e.target.value)}
                        >
                            <option value="">Select Currency</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="GBP">SYP</option>
                            <option value="GBP">EGP</option>
                            <option value="GBP">TRY</option>
                        </Form.Select>
                    </Form.Group>
      <Form.Group  className="mb-3" controlId="exampleForm.ControlInput5">
        <Form.Label>Details:</Form.Label>
        <Form.Control  type="text" as="textarea" name='details' value={details} onChange={(e)=>setdetails(e.target.value)}  placeholder="Details.." />
      </Form.Group>
      <Form.Group  className="mb-3" controlId="exampleForm.ControlInput3">
        <Form.Label>Description:</Form.Label>
        <Form.Control  type="text" as="textarea" name='description' value={description} onChange={(e)=>setdescription(e.target.value)}  placeholder="description.." />
      </Form.Group>
    
      
      <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={disabled}
        >Add</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/expences', { replace: true })}
        >Cancel</button>
      </div>
    </Form>}
    </>
  )
}

export default Expances