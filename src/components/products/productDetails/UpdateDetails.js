import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/loading/Loading';
import { Button } from 'react-bootstrap';
import { Axios } from '../../../Api/Axios';

function UpdateProductdetails() {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [images, setImages] = useState([]);
    const [sizes, setsizes] = useState([]);
    const [disable, setDisable] = useState(false);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [originalPrice, setoriginalPrice] = useState('');
    const [description, setdescription] = useState('');
    const [descriptionEn, setdescriptionEn] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [disableAddSize, setDisableAddSize] = useState(true); 


    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        Axios.get(`/ProductDetails/${id}`)
            .then((data) => {
                setProductId(data.data.productId);
                setdescription(data.data.description);
                setdescriptionEn(data.data.descriptionEn);
                setsizes(data.data.sizes);
                setoriginalPrice(data.data.originalPrice);
                setImages(data.data.images.map(imgUrl => ({ url: imgUrl, isNew: false })));
            })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (originalPrice && description && sizes.length > 0 && images.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [originalPrice, description, sizes, images]);

    useEffect(() => {
        if (productId) {
            const timer = setTimeout(() => {
                Axios.get(`/AdminProduct/${productId}`)
                    .then((data) => {
                        setProductName(data.data.name);
                    })
                    .catch((err) => console.log(err));
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [productId]);

    const nav = useNavigate();
    const openImage = useRef(null);

    function handleOpenImage() {
        openImage.current.click();
    }

    useEffect(() => {
        if (sizes.length === 0 || sizes[sizes.length - 1] !== '') {
            setDisableAddSize(false);
        } else {
            setDisableAddSize(true);
        }
    }, [sizes]);


    console.log(images)
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('originalPrice', originalPrice);
            formData.append('description', description);
            formData.append('descriptionEn', descriptionEn);
            sizes.forEach(size => {
                formData.append('sizes', size);
            });
    
            const newImages = images.filter(img => img.isNew).map(img => img.file);
            const oldImagesUrls = images.filter(img => !img.isNew).map(img => img.url);
    
            newImages.forEach(file => {
                formData.append('images', file);
            });
    
            oldImagesUrls.forEach(url => {
                formData.append('oldImages', url);
            });
    
            const res = await Axios.put(`/ProductDetails/${id}`, formData);
    
            if (res.status === 200) {
                nav(`/dashboard/products/product-details-forone/${id}`);
            }
        } catch (err) {
            console.log(err);
            setErr('An error occurred while submitting the form');
        } finally {
            setLoading(false);
        }
    }
    
    function handleDeleteImage(index) {
        setImages(prev => prev.filter((_, i) => i !== index));
    }
    

    const imgShow = images.map((img, key) =>
        <div className='border w-100 p-2' key={key}>
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-start gap-2 '>
                    <img src={img.isNew ? URL.createObjectURL(img.file) : img.url} width='100px' alt={`uploaded-img-${key}`} />
                    <div>
                        <p className='mb-0'>{img.isNew ? img.file.name : `Image ${key + 1}`}</p>
                        {img.isNew && <p>{img.file.size / 1024 < 1000 ? (img.file.size / 1024).toFixed(2) + 'KB' : (img.file.size / (1024 * 1024)).toFixed(2) + 'MB'}</p>}
                    </div>
                </div>
                <Button className='mb-4' variant='danger' onClick={() => handleDeleteImage(key)}>Delete</Button>
            </div>
        </div>
    );

    function handleUploadImages(e) {
        const newImages = Array.from(e.target.files).map(file => ({ file, isNew: true }));
        setImages((prev) => [...prev, ...newImages]);
    }

    function handleSizeChange(index, event) {
        const newSizes = sizes.map((size, sizeIndex) => {
            if (index === sizeIndex) {
                return event.target.value;
            }
            return size;
        });
        setsizes(newSizes);
    }

    function addSizeField() {
        setsizes([...sizes, '']);
    }

    function removeSizeField(index) {
        const newSizes = sizes.filter((_, sizeIndex) => index !== sizeIndex);
        setsizes(newSizes);
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
                        <Form.Control disabled name='originalPrice' type="number" value={originalPrice} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Label>Arabic Description:</Form.Label>
                        <Form.Control disabled={disable} as={'textarea'} type="text" name='description' value={description} onChange={(e) => setdescription(e.target.value)} placeholder="Arabic description.." />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput33">
                        <Form.Label>English Description:</Form.Label>
                        <Form.Control disabled={disable} as={'textarea'} type="text" name='descriptionEn' value={descriptionEn} onChange={(e) => setdescriptionEn(e.target.value)} placeholder="English description.." />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex flex-col" controlId="exampleForm.ControlInput4">
                        <Form.Label>Sizes:</Form.Label>
                        {sizes.map((size, index) => (
                            <div key={index} className='d-flex align-items-center mb-2'>
                                <Form.Control
                                    disabled={disable}
                                    type="text"
                                    value={size}
                                    onChange={(e) => handleSizeChange(index, e)}
                                    placeholder={`Size ${index + 1}`}
                                    className='me-2'
                                />
                                <Button variant='danger' onClick={() => removeSizeField(index)}>Remove</Button>
                            </div>
                        ))}
                        <Button variant='primary' onClick={addSizeField} disabled={disableAddSize}  className='mt-2 w-[100%]'>Add Size</Button>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                        <Form.Label>Images:</Form.Label>
                        <Form.Control disabled={disable} ref={openImage} hidden type="file" multiple onChange={handleUploadImages} />
                        <div className='d-flex align-items-center justify-content-center gap-2 flex-column py-3 rounded mb-2 w-100'
                            style={{ border: disable ? '2px dashed gray' : '2px dashed #0086fe', cursor: !disable && 'pointer' }}
                            onClick={handleOpenImage}>
                            <img src={require('../../../Assets/upload.png')} width='150px' style={{ filter: disable && 'grayscale(1)' }} alt="upload" />
                            <p className='fw-bold' style={{ color: disable ? 'gray' : '#0086fe' }}>Upload Here</p>
                        </div>
                    </Form.Group>
                    <div className='d-flex align-items-start gap-2 flex-column'>
                        {imgShow}
                    </div>
                    {err !== '' && <span className="error">{err}</span>}
                    <div className="d-flex align-items-center justify-content-between">
                        <button style={{ marginTop: '0.5rem' }} className={`btn btn-primary `} type="submit" disabled={disabled}>Submit</button>
                        <button style={{ marginTop: '0.5rem' }}
                            className='btn btn-primary'
                            onClick={() => nav(`/dashboard/products/product-details-showing/${id}`, { replace: true })}
                        >Cancel</button>
                    </div>
                </Form>
            }
        </>
    );
}

export default UpdateProductdetails;
