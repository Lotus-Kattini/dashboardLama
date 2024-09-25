import { Axios } from '../../Api/Axios';
import { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import LoadingPage from "../loading/Loading"


function Addproduct() {
    const [name,setname]=useState('')
    const [price,setprice]=useState('')
    const [originalprice,setoriginalprice]=useState('')
    const [categories,setcategories]=useState([])
    const [categoryId, setcategoryId] = useState('') 
    const [subcategoryId,setsubcategoryId]=useState('')
    const [getsubcategory,setgetsubcategory]=useState([])
    const [image,setimage]=useState('')
    const [err,seterr]=useState('')
    const [loading,setloading]=useState(false)
    const [disabled, setDisabled] = useState(true);
    const [subcat, setsubcat] = useState([]) 
    const [date,setdate]=useState('')
    const [pricecurrency,setpricecurrency]=useState('')
    const [ORGpricecurrency,setORGpricecurrency]=useState('')


    console.log(categoryId)


    const nav=useNavigate()

    
    const focus=useRef(null);
    useEffect(()=>{
        focus.current.focus();
    },[])

    useEffect(() => {
      Axios.get(`/Categories`)
      .then((data) => {
        setcategories(data.data);
      })
      .catch((error) => {
        console.log(error);
      })
    }, []);


    

    useEffect(() => {
      Axios.get(`/SubCategories`)
      .then((data) => {
        setsubcat(data.data)
        console.log(data.data)
      })
      .catch((error) => {
        console.log(error);
      })
    }, [categoryId,categories]);

    const validateDate = (selectedDate) => {
      const today = new Date();
      const selected = new Date(selectedDate);
      return selected >= today.setHours(0, 0, 0, 0);
  };

    useEffect(() => {
      if (name && price && originalprice && categoryId  && image) {
          setDisabled(false);
      } else {
          setDisabled(true);
      }
  }, [name, price, originalprice, categoryId, image]);


    const CategoriesShow=categories.map((item,key)=> <option key={key} value={item.categoryId} >{item.nameEn}</option>)
    const filter=subcat.map((item)=>item.categoryId == categoryId ? <option value={item.subCategoryId}>{item.nameEn}</option> : '')
    console.log(filter)

    async function HandelSubmit(e){
        e.preventDefault();
        if (!validateDate(date)) {
          seterr('Please select a date that is today or in the future.');
          return;
      }
        
        const form = new FormData();
        form.append('categoryId',categoryId)
        form.append('name',name);
        form.append('price',price);
        form.append('originalPrice',originalprice);
        form.append('expiredDate',date);
        form.append('type',2);
        form.append('mainImage',image);
        form.append('priceCurrency',pricecurrency);
        form.append('originalPriceCurrency',ORGpricecurrency);
        if(subcategoryId){
        form.append('subCategoryId',subcategoryId);
        }else{
        form.append('subCategoryId','');
        }
        setloading(true)

        try{
            const res=await Axios.post(`/AdminProduct`,form)
            console.log(res)
            nav('/dashboard/products')
            setloading(false)
        }
        catch(err){
            console.log(err)
            setloading(false)
            if(name===''){
                seterr('Please Fill Name Field..')
            }
        }
    }

    console.log(image)
    console.log(date)



  return (
    <>
    {loading ? <LoadingPage/> :<Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Select value={categoryId} onChange={(e)=> setcategoryId(e.target.value)}>
          <option disabled value={''}>Select Category:</option>
          {CategoriesShow}
      </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Select value={subcategoryId} onChange={(e)=> setsubcategoryId(e.target.value)}>
          <option disabled value={''}>Select SubCategory:</option>
          {filter}
          {(filter == '' || filter.length ==0) && <option disabled value={''}>there is no subCategories for this Category</option>}
      </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name:</Form.Label>
        <Form.Control type="text" value={name} onChange={(e)=> setname(e.target.value)} placeholder="Name.." ref={focus}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Price:</Form.Label>
        <Form.Control type="number" value={price} onChange={(e)=> setprice(e.target.value)} placeholder="Price.." />
      </Form.Group>
      <Form.Group className="mb-3" controlId="currency">
                        <Form.Label>Price Currency:</Form.Label>
                        <Form.Select 
                            name='pricecurrency' 
                            value={pricecurrency} 
                            onChange={(e) => setpricecurrency(e.target.value)}
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
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Original Price:</Form.Label>
        <Form.Control type="number" maxLength={10} value={originalprice} onChange={(e)=> setoriginalprice(e.target.value)} placeholder="Oiginal Price.." />
      </Form.Group>

      <Form.Group className="mb-3" controlId="currency">
                        <Form.Label>Original Price Currency:</Form.Label>
                        <Form.Select 
                            name='ORGpricecurrency' 
                            value={ORGpricecurrency} 
                            onChange={(e) => setORGpricecurrency(e.target.value)}
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
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Expired Date :</Form.Label>
        <Form.Control type="date" value={date} onChange={(e)=> setdate(e.target.value)} placeholder="Expired Date.." />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Image:</Form.Label>
        <Form.Control type="file" onChange={(e)=> setimage(e.target.files[0])}  />
      </Form.Group>

      
      {err !== '' && <span className="error">{err}</span>}
      <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={disabled}
        >Add</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav('/dashboard/products', { replace: true })}
        >Cancel</button>
      </div>
    </Form>}
    </>
  )
}


export default Addproduct