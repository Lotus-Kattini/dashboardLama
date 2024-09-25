import { Axios } from '../../Api/Axios';
import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import LoadingPage from "../loading/Loading"

function UpdateSubcategory() {
    const [subcategoryE,setsubcategoryE]=useState('')
    const [subcategoryA,setsubcategoryA]=useState('')
    const [disable,setdisable]=useState(true)
    const [err,seterr]=useState('')
    const [loading,setloading]=useState(false)
    const [categories,setcategories]=useState([])
    const [categoryId,setcategoryId]=useState('')

    const {id}=useParams();

    useEffect(() => {
      if (subcategoryE && subcategoryA && categoryId) {
          setdisable(false);
      } else {
          setdisable(true);
      }
  }, [subcategoryE,subcategoryA,categoryId]);

    useEffect(()=>{
        Axios.get(`/SubCategories/${id}`)
        .then((data)=>{
            setsubcategoryE(data.data.nameEn)
            setsubcategoryA(data.data.nameAr)
            setcategoryId(data.data.categoryId)
            console.log(data)
        })
        .catch((error)=>{
          console.log(error)
        })
    },[])

    const nav=useNavigate()

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
    console.log(categoryId)

    async function HandelSubmit(e){
        e.preventDefault();
        setloading(true)
        try{
            const res=await Axios.put(`/SubCategories/${id}`,
              {         
                categoryId:categoryId,
                nameEn:subcategoryE,
                nameAr:subcategoryA
              }
            )
            console.log(res)
            setloading(false)
            nav('/dashboard/sub-categories')
        }
        catch(err){
            console.log(err)
            setloading(false)
            if(subcategoryA==='' || subcategoryE===''){
                seterr('Please Fill Name Field..')
            }
        }
        
    }
  return (
    <>
    {loading ? <LoadingPage/> : <Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <Form.Label>Update Category:</Form.Label>
      <Form.Select value={categoryId} onChange={(e)=> setcategoryId(e.target.value)}>
          {CategoriesShow}
      </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Sub Category English name:</Form.Label>
        <Form.Control type="text" value={subcategoryE} onChange={(e)=> setsubcategoryE(e.target.value)} placeholder="Update category name ENGLISH.." />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Sub Category Arabic name:</Form.Label>
        <Form.Control type="text" value={subcategoryA} onChange={(e)=> setsubcategoryA(e.target.value)} placeholder="Update category name ARABIC.." />
      </Form.Group>
      
      {err !== '' && <span className="error">{err}</span>}
      <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={disable}
        >Update</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/sub-categories', { replace: true })}
        >Cancel</button>
      </div>    </Form>}
    </>
  )
}

export default UpdateSubcategory