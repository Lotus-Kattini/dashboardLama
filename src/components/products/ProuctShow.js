
import React, { useEffect, useState, useMemo } from 'react';
import { Axios } from '../../Api/Axios';
import { IoAddCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import LoadingPage from '../loading/Loading';
import ActionCellComponent from '../table/ActionCellComponent';
import ConfirmationModal from '../helpers/ConfirmationModal';
import { BASEIMGURL } from '../../Api/Api';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function ProducShow() {
  const [products, setProducts] = useState([]);
  const [onDelete, setOnDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  

  useEffect(() => {
    setLoading(true);
    Axios.get(`/AdminProduct`)
      .then((response) => {
        const formattedProducts = response.data.map(product => {
          const isoDateString = product.expiredDate;
          const dateObject = new Date(isoDateString);
          const year = dateObject.getFullYear();
          const month = String(dateObject.getMonth() + 1).padStart(2, '0');
          const day = String(dateObject.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          return {
            ...product,
            expiredDate: formattedDate
          };
        });
        setProducts(formattedProducts);
        setOnDelete(false);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [onDelete]);

  const deleteHandler = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(`/AdminProduct/${selectedId}`);
      console.log(res);
      setOnDelete(prev => !prev);
      setLoading(false);
      setShowModal(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setShowModal(false);
    }
  };


  const productData = products.map((product) => ({
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    mainImage: product.mainImage,
    expiredDate: product.expiredDate,
    productId: product.productId,
    subcategory:product.subCategory?.nameEn,
    hasDetails:product.hasDetails,
    pricecurrency:product.priceCurrency,
    originalPriceCurrency:product.originalPriceCurrency,
    category:product.subCategory?.categories?.nameEn,
  }));


  const columnDefs = useMemo(() => [
    { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'Category', field: 'category', filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: (params) => {
      return params.value ? params.value : 'No Category';
    }
   },
    {
      headerName: 'Subcategory', field: 'subcategory', filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: (params) => {
        return params.value ? params.value : 'No subcategory';
      }
    },    
    {
      headerName: 'Image',
      field: 'mainImage',
      filter: false,
      cellRenderer: (params) => {
        return (
          <img src={params.value} alt={params.data.name} style={{ width: '50px', height: '50px' }} />
        );
      }
    },
    { headerName: 'Price', field: 'price', filter: 'agNumberColumnFilter', floatingFilter: true },
    { headerName: 'Price Currency', field: 'pricecurrency', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'Original price', field: 'originalPrice', filter: 'agNumberColumnFilter', floatingFilter: true },
    { headerName: 'Original price Currency', field: 'originalPriceCurrency', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'Expired Date', field: 'expiredDate', filter: 'agDateColumnFilter', floatingFilter: true, filterParams: {
      comparator: function (filterLocalDateAtMidnight, cellValue) {
        const cellDate = new Date(cellValue);
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        } else if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        } else {
          return 0;
        }
      }
    }},
    {
      headerName: 'Detail status', field: 'hasDetails', filter: 'agTextColumnFilter',floatingFilter: true, cellRenderer: (params) => {
        const color = params.value === 'Has Details' ? 'green' : 'red';
        return <span style={{color:color}}>{params.value}</span>;
      },
      valueGetter: (params) => (params.data.hasDetails === true ? 'Has Details' : 'No Details')
    },
    { headerName: 'Product Details', field: 'productDetails', filter: false, cellRenderer: (params) => <Link className='detailsBtn' to={`/dashboard/products/product-details-showing/${params.data.productId}`}>Details</Link> },
    { 
      headerName: 'Action', 
      field: 'action',
      filter: false,
      cellRenderer: (params) => <ActionCellComponent {...params} id={params.data.productId} deleteHandler={deleteHandler} /> 
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
  }), []);

  return (
    <>
      {loading ? <LoadingPage /> : (
        <>
          <div className="bg-white w-100 p-2">
            <div className="d-flex align-items-center justify-content-between my-3">
              <h1 className='text-xl ml-5 font-bold'>Products Page:</h1>
              <Link className="btn custom-bg-btn flex items-center gap-1" to='/dashboard/addproduct'>
                <IoAddCircle className="icon-add" /> Add Product
              </Link>
            </div>
            <div className='ag-theme-alpine w-[96%] ml-5' style={{ height: 500 }}>
              <AgGridReact
                rowData={productData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>
          <ConfirmationModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleConfirm={confirmDelete}
            title="Confirm Delete"
            body="Are you Sure?"
          />
        </>
      )}
    </>
  );
}

export default ProducShow;
