import React, { useEffect, useState } from 'react';
import { Axios } from '../../../Api/Axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Carousel } from 'react-bootstrap';
import LoadingPage from '../../loading/Loading';
import './ProductDetailsShow.css';
import { IoAddCircle } from 'react-icons/io5';

function DetailsShow() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    setLoading(true);
    Axios.get(`/ProductDetails/${id}`)
      .then((data) => {
        console.log(data)
        const updatedProduct = {
          ...data.data,
          description: data.data.description.replace(/&nbsp;|&amp;/g, ' ')
        };
        setProduct(updatedProduct);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await Axios.delete(`/ProductDetails/${id}`);
      navigate('/dashboard/products');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <LoadingPage /> : (
        <Container>
          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 className='text-xl ml-5 font-bold'>Product Details Page:</h1>
            
          </div>
          {product ? (
            <Card>
              <Card.Body>
                <Card.Title className='text-primary'>Arabic Description</Card.Title>
                <Card.Text className="product-description">{product.description}</Card.Text>
                <Card.Title className='text-primary'>English Description</Card.Title>
                <Card.Text className="product-description">{product.descriptionEn}</Card.Text>
                { product.images.length > 0 &&
                  <div className='my-7'>
                    <Card.Title className='text-primary'>Images</Card.Title>
                <Carousel className="product-carousel">
                  {product.images.map((image, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`Product ${idx}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                  </div>
                }
                <Card.Title className='text-primary'>Original Price</Card.Title>
                <Card.Text className="product-price text-success">${product.originalPrice.toFixed(2)}</Card.Text>
                <Card.Title className='text-primary'>Sizes</Card.Title>
                <Card.Text className="product-sizes">{product.sizes.join(', ')}</Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="danger" onClick={deleteHandler}>Delete</Button>
                  <Link to={`/dashboard/products/product-details-update/${id}`} className="btn btn-primary">Edit</Link>
                </div>
              </Card.Body>
            </Card>
          ):<div className="d-flex h-[80%] flex-col align-items-center justify-content-center gap-3 my-3">
          <h1 className='text-xl ml-5 ' style={{color:'red'}}>No Details for this product</h1>
          <Link className="btn custom-bg-btn flex items-center gap-1" to={`/dashboard/products/product-details-add/${id}`}>
            <IoAddCircle className="icon-add" /> Add Details
          </Link>
        </div>}
        <div className="d-flex align-items-center justify-content-end">
      <button style={{marginTop:'0.5rem',marginRight:'1.2rem'}}
        className='btn btn-primary'
        onClick={() => navigate(`/dashboard/products/product-details-showing/${product.productId}`)}
        >Cancel</button>
      </div>
        </Container>
      )}
      
    </>
  );
}

export default DetailsShow;
