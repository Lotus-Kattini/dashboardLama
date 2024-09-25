import { Axios } from '../../Api/Axios';
import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import LoadingPage from "../loading/Loading"

function Updateproduct() {
  const [name, setname] = useState('')
  const [price, setprice] = useState('')
  const [originalprice, setoriginalprice] = useState('')
  const [subcategoryId, setsubcategoryId] = useState('')
  const [subcategoryIdshow, setsubcategoryIdshow] = useState([])
  const [categories,setcategories]=useState([])
  const [date, setdate] = useState('')
  const [image, setimage] = useState(null)
  const [oldImage, setoldImage] = useState('')
  const [err, seterr] = useState('')
  const [loading, setloading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [categoryId, setcategoryId] = useState('')
  const [newImageURL, setNewImageURL] = useState('')
  const [pricecurrency, setpricecurrency] = useState('')
  const [ORGpricecurrency, setORGpricecurrency] = useState('')

  const { id } = useParams();
  const nav = useNavigate();


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
      .then((data) => setsubcategoryIdshow(data.data))
      .catch((err) => console.log(err))
  }, [categoryId,categories])

  useEffect(() => {
    if (name && price && originalprice && date && pricecurrency && ORGpricecurrency ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, price, originalprice, date, pricecurrency, ORGpricecurrency  ]);

 
  
  useEffect(() => {
    Axios.get(`/AdminProduct/${id}`)
      .then((data) => {
        console.log(data.data)
        setname(data.data.name)
        setprice(data.data.price)
        setoriginalprice(data.data.originalPrice)
        setsubcategoryId(data.data.subCategoryId)
        setcategoryId(data.data.categoryId)
        setoldImage(data.data.mainImage)
        setpricecurrency(data.data.priceCurrency)
        setORGpricecurrency(data.data.originalPriceCurrency)
        setcategoryId(data.data.subCategory?.categoryId)
        
        const isoDateString = data.data.expiredDate;
        const dateObject = new Date(isoDateString);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setdate(formattedDate);
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [id])


  const CategoriesShow=categories.map((item,key)=> <option key={key} value={item.categoryId} >{item.nameEn}</option>)
  const filter=subcategoryIdshow.map((item)=>item.categoryId == categoryId ? <option value={item.subCategoryId}>{item.nameEn}</option> : '')

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setimage(file);
    setNewImageURL(URL.createObjectURL(file));
  };


  async function HandelSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('categoryId',categoryId)
    form.append('productId', id);
    form.append('price', price);
    form.append('type',2);
    form.append('expiredDate', date);
    form.append('originalPrice', originalprice);
    form.append('SubCategoryId', subcategoryId);
    form.append('priceCurrency', pricecurrency);
    form.append('originalPriceCurrency', ORGpricecurrency);

    if (image) {
      form.append('mainImage', image);
    } 
    else if (oldImage) {
      form.append('mainImage', oldImage);
    }

    setloading(true)
    try {
      const res = await Axios.put(`/AdminProduct/${id}`, form)
      console.log(res)
      setloading(false)
      nav('/dashboard/products')
    }
    catch (err) {
      console.log(err)
      setloading(false)
      if (name === '') {
        seterr('Please Fill Name Field..')
      }
    }
  }


  return (
    <>
      {loading ? <LoadingPage /> : <Form className='bg-white w-100 mx-2 p-3' onSubmit={HandelSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>Category:</Form.Label>
      <Form.Select value={categoryId} onChange={(e)=> setcategoryId(e.target.value)}>
      <option disabled value={''}>Select Category:</option>
          {CategoriesShow}
      </Form.Select>
      </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Subcategory:</Form.Label>
          <Form.Select value={subcategoryId} onChange={(e) => setsubcategoryId(e.target.value)}>
          <option  value={''}>Select SubCategory:</option>
            {filter}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name:</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder=" Name.." />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Price:</Form.Label>
          <Form.Control type="number" value={price} onChange={(e) => setprice(e.target.value)} placeholder=" Price.." />
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
            <option value="SYP">SYP</option>
            <option value="EGP">EGP</option>
            <option value="TRY">TRY</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Original Price:</Form.Label>
          <Form.Control type="number" value={originalprice} onChange={(e) => setoriginalprice(e.target.value)} placeholder="Original Price.." />
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
            <option value="SYP">SYP</option>
            <option value="EGP">EGP</option>
            <option value="TRY">TRY</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label> Expired Date:</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setdate(e.target.value)} placeholder="Expired Date.." />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label> Image:</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        {(newImageURL || oldImage ) && (
          <div className='border w-100 p-2'>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center justify-content-start gap-2'>
                <img src={ newImageURL || oldImage } width='100px' alt="product" />
                <div>
                  <p className='mb-0'>{newImageURL ? image.name : 'Old Image'}</p>
                  {newImageURL && <p>{image.size / 1024 < 1000 ? (image.size / 1024).toFixed(2) + 'KB' : (image.size / (1024 * 1024)).toFixed(2) + 'MB'}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
        {err !== '' && <span className="error">{err}</span>}
        <div className="d-flex align-items-center justify-content-between">
          <button style={{ marginTop: '0.5rem' }}
            className='btn btn-primary'
            disabled={disabled}
          >Update</button>
          <button style={{ marginTop: '0.5rem' }}
            className='btn btn-primary'
            onClick={() => nav('/dashboard/products', { replace: true })}
            >Cancel</button>
        </div>
      </Form>}
    </>
  )
}

export default Updateproduct;
