import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../loading/Loading';
import { Button } from 'react-bootstrap';
import { Axios } from '../../../Api/Axios';

function Productdetails() {
    const [form, setForm] = useState({
        originalPrice: '',
        description: '',
        descriptionEn: '',
        sizes: [] 
    });

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [images, setImages] = useState([]);
    const [disable, setDisable] = useState(true);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [disableAddSize, setDisableAddSize] = useState(true); 

    const { id } = useParams();

    useEffect(() => {
        Axios.get(`/AdminProduct/${id}`)
            .then((data) => {
                setProductId(data.data.productId);
                setProductName(data.data.name);
            })
            .catch((err) => console.log(err));
    }, [id]);

    useEffect(() => {
        if (form.originalPrice && form.description && form.sizes.length && images.length) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }, [form, images]);

    useEffect(() => {
        if (form.sizes.length === 0 || form.sizes[form.sizes.length - 1] !== '') {
            setDisableAddSize(false);
        } else {
            setDisableAddSize(true);
        }
    }, [form.sizes]);

    const nav = useNavigate();
    const openImage = useRef(null);

    function handleOpenImage() {
        openImage.current.click();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('originalPrice', form.originalPrice);
            formData.append('description', form.description);
            formData.append('descriptionEn', form.descriptionEn);
            form.sizes.forEach(size=>{
                formData.append('sizes',size)
            })
            images.forEach(image => {
                formData.append('images', image);
            });

            const res = await Axios.post(`/ProductDetails`, formData);

            if (res.status === 200) {
                nav(`/dashboard/products/product-details-showing/${id}`);
            }
        } catch (err) {
            console.log(err);
            setErr('An error occurred while submitting the form');
        } finally {
            setLoading(false);
        }
    }

    function handleDeleteImage(index) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    const imgShow = images.map((img, key) =>
        <div className='border w-100 p-2' key={key}>
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-start gap-2 '>
                    <img src={URL.createObjectURL(img)} width='100px' alt={`uploaded-img-${key}`} />
                    <div>
                        <p className='mb-0'>{img.name}</p>
                        <p>{img.size / 1024 < 1000 ? (img.size / 1024).toFixed(2) + 'KB' : (img.size / (1024 * 1024)).toFixed(2) + 'MB'}</p>
                    </div>
                </div>
                <Button className='mb-4' variant='danger' onClick={() => handleDeleteImage(key)}>Delete</Button>
            </div>
        </div>
    );

    function handleForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setDisable(false);
    }

    function handleUploadImages(e) {
        setImages((prev) => [...prev, ...Array.from(e.target.files)]);
    }

    function handleSizeChange(index, event) {
        const newSizes = form.sizes.map((size, sizeIndex) => {
            if (index === sizeIndex) {
                return event.target.value;
            }
            return size;
        });
        setForm({ ...form, sizes: newSizes });
    }

    function addSizeField() {
        if (form.sizes.length === 0 || form.sizes[form.sizes.length - 1] !== '') {
            setForm({ ...form, sizes: [...form.sizes, ''] });
        }
    }

    function removeSizeField(index) {
        const newSizes = form.sizes.filter((_, sizeIndex) => index !== sizeIndex);
        setForm({ ...form, sizes: newSizes });
    }

    return (
        <>
            {loading ? <Loading /> : 
                <Form className='bg-white w-100 mx-2 p-3' onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                    <Form.Label>Product Name:</Form.Label>
                    <Form.Control disabled type="text" name='id' value={productName} />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Original Price:</Form.Label>
                    <Form.Control name='originalPrice' type="number" value={form.originalPrice} onChange={handleForm} maxLength={10} placeholder="original Price.." />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                    <Form.Label>Arabic Description:</Form.Label>
                    <Form.Control as={'textarea'} type="text" name='description' value={form.description} onChange={handleForm} placeholder="description in arabic.." />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                    <Form.Label>English Description:</Form.Label>
                    <Form.Control as={'textarea'} type="text" name='descriptionEn' value={form.descriptionEn} onChange={handleForm} placeholder="description in english.." />
                </Form.Group>
                <Form.Group className="mb-3 d-flex flex-col" controlId="exampleForm.ControlInput4">
                    <Form.Label>Sizes:</Form.Label>
                    {form.sizes.map((size, index) => (
                        <div key={index} className='d-flex align-items-center mb-2'>
                            <Form.Control
                                type="text"
                                value={size}
                                onChange={(e) => handleSizeChange(index, e)}
                                placeholder={`Size ${index + 1}`}
                                className='me-2'
                            />
                            <Button variant='danger' onClick={() => removeSizeField(index)}>Remove</Button>
                        </div>
                    ))}
                    <Button variant='primary' onClick={addSizeField} disabled={disableAddSize} className='mt-2 w-[100%]'>Add Size</Button>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                    <Form.Label>Images:</Form.Label>
                    <Form.Control ref={openImage} hidden type="file" multiple onChange={handleUploadImages} />
                    <div className='d-flex align-items-center justify-content-center gap-2 flex-column py-3 rounded mb-2 w-100'
                        style={{ border: '2px dashed #0086fe', cursor:'pointer' }}
                        onClick={handleOpenImage}>
                        <img src={require('../../../Assets/upload.png')} width='150px' alt="upload" />
                        <p className='fw-bold' >Upload Here</p>
                    </div>
                </Form.Group>
                <div className='d-flex align-items-start gap-2 flex-column'>
                    {imgShow}
                </div>
                {err !== '' && <span className="error">{err}</span>}
                <div className="d-flex align-items-center justify-content-between">
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        disabled={disable}
        >Add</button>
      <button style={{marginTop:'0.5rem'}}
        className='btn btn-primary'
        onClick={() => nav(`/dashboard/products/product-details-showing/${id}`, { replace: true })}
        >Cancel</button>
      </div>
            </Form> 
            
            }
        </>
    );
}

export default Productdetails;
