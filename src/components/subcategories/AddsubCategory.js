import { Axios } from '../../Api/Axios';
import { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import LoadingPage from "../loading/Loading"


function AddsubCategory() {
    const [nameEn,setnameEn]=useState('')
    const [nameAr,setnameAr]=useState('')
    const [err,seterr]=useState('')
    const [loading,setloading]=useState(false)
    const [categoryId,setcategoryId]=useState('')
    const [categories,setcategories]=useState([])
    const [Disabled,setDisabled]=useState(true)


    useEffect(() => {
      if (nameAr && nameEn && categoryId) {
          setDisabled(false);
      } else {
          setDisabled(true);
      }
  }, [nameAr,nameEn,categoryId]);

    const nav=useNavigate()

    const {id}=useParams()

    useEffect(() => {
      Axios.get(`/Categories`)
      .then((data) => {
        setcategories(data.data);
      })
      .catch((error) => {
        console.log(error);
      })
    }, []);
    const CategoriesShow=categories.map((item,key)=> <option key={key} value={item.categoryId} >{item.nameEn}</option>)
    
    
    const focus=useRef(null);
    useEffect(()=>{
        focus.current.focus();
    },[])


    async function HandelSubmit(e){
        e.preventDefault();
        setloading(true)
        try{
            const res=await Axios.post(`/SubCategories`,{
              nameEn:nameEn,
              nameAr:nameAr,
              categoryId:categoryId,
            })
            setloading(false)
            nav('/dashboard/sub-categories')
        }
        catch(err){
            console.log(err)
            setloading(false)
            if(nameAr==='' || nameEn===''){
                seterr('Please Fill name Fields..')
            }
        }
        
    }
  return (
    <>
      {loading ? <LoadingPage/> : <Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Select value={categoryId} onChange={(e)=> setcategoryId(e.target.value)}>
          <option disabled value={''}>Select Category:</option>
          {CategoriesShow}
      </Form.Select>
      </Form.Group>
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
        disabled={Disabled}
        >Add</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/sub-categories', { replace: true })}
        >Cancel</button>
      </div>
    </Form>}
    </>
  )
}

export default AddsubCategory