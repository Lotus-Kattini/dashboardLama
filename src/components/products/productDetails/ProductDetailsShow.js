import React, { useEffect, useState, useMemo } from 'react';
import { Axios } from '../../../Api/Axios';
import { IoAddCircle } from "react-icons/io5";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import LoadingPage from '../../loading/Loading';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function ProductDetailsShow() {
  const [productdetails, setProductsdetails] = useState([]);
  const [productdetailsId, setProductsdetailsId] = useState('');
  const [onDelete, setOnDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productName, setproductName] = useState('')

  const {id}=useParams()
  const nav=useNavigate()

  
  useEffect(() => {
    setLoading(true);
    Axios.get(`/ProductDetails/GetAllDetailsForOneProduct/${id}`)
      .then((data) => {
        setProductsdetails(data.data);
        setProductsdetailsId(data.data.productDetailsId)
        setOnDelete(false);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [onDelete]);

  useEffect(() => {
    Axios.get(`/AdminProduct/${id}`)
      .then((data) => {
        setproductName(data.data.name)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [id])

  

  console.log(productdetails)
  

  const productDetailsData = productdetails.map((product, index) => ({
    description: product.description,
    descriptionEn: product.descriptionEn,
    originalPrice: product.originalPrice,
    images: product.images,
    sizes:product.sizes,
    productId:product.productId,
    productDetailsId:product.productDetailsId,
  }));

  const columnDefs = useMemo(() => [
    { headerName: 'Arabic Description', field: 'description', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'English Description', field: 'descriptionEn', filter: 'agTextColumnFilter', floatingFilter: true },
    {
        headerName: 'Images',
        field: 'images',
        filter: false,
        autoHeight: true,
        cellRenderer: (params) => (
          <div className=' custom-image'>
            {params.value.map((image, idx) => (
              <img key={idx} src={image} alt={`Product ${idx}`} className='product-image' />
            ))}
          </div>
          
        )
      },
    { headerName: 'Original price', field: 'originalPrice', filter: 'agNumberColumnFilter', floatingFilter: true },
    {
      headerName: 'Sizes',
      field: 'sizes',
      filter: false,
      cellRenderer: (params) => (
        <div className='d-flex align-items-center justify-content-center'>
          {params.value.map((size, idx) => (
            <p key={idx}>{size},</p>
          ))}
        </div>
      )
    },
    { headerName: 'Details', field: 'productDetails',filter:false, cellRenderer: (params) => <Link className='detailsBtn' to={`/dashboard/products/product-details-forone/${params.data.productDetailsId}`}>Detail</Link> },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
  }), []);

  return (
    <>
      {loading ? <LoadingPage /> : (
        <div className="bg-white w-100 p-2">
          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 className='text-xl ml-5 font-bold'><span className='text-primary font-bold text-[1.5rem]'>{productName}</span> Details Page:</h1>
            <Link className="btn custom-bg-btn flex items-center gap-1" to={`/dashboard/products/product-details-add/${id}`}>
              <IoAddCircle className="icon-add" /> Add Details
            </Link>
          </div>
          
          <div className='ag-theme-alpine w-[96%] ml-5' style={{ height: 500 }}>
            <AgGridReact
              rowData={productDetailsData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          </div>

          <div className="d-flex align-items-center justify-content-end mr-3">
          <button style={{ marginTop: '0.5rem' }}
            className='btn btn-primary'
            onClick={() => nav('/dashboard/products', { replace: true })}
            >Cancel</button>
        </div> 
        </div>
      )}
    </>
  )
}

export default ProductDetailsShow;
