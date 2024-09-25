import React, { useEffect, useState, useMemo } from 'react';
import { Axios } from '../../Api/Axios';
import LoadingPage from '../loading/Loading';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import ActionCellComponent from '../table/ActionCellComponent';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function ShowOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(orders);

  useEffect(() => {
    setLoading(true);
    Axios.get(`/Order`)
    .then((data) => {
      console.log(data)
      setOrders(data.data);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false)
    })
    .finally(() => setLoading(false));
  }, []);

  

  const orderData = orders.map((order) => ({
    address: order.consumerAddress,
    product: Array.isArray(order.orderItems) ? order.orderItems.MainImage : '',
    productimage: Array.isArray(order.orderItems) ? order.orderItems.Name : '',
    // product: Array.isArray(order.orderItems) ? order.orderItems.map(item => item.MainImage).join(', ') : '',
    // productimage: Array.isArray(order.orderItems) ? order.orderItems.map(item => item.Name).join(', ') : '',
    orderId: order.orderId,
    status: order.orderStatus,
    comments: order.comments,
    trakingNumber: order.trackingNumber,
  }));

  const columnDefs = useMemo(() => [
    { headerName: 'Product', field: 'product', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { headerName: 'Product Image', field: 'productimage', filter: false, flex: 1 },
    { headerName: 'Address', field: 'address', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { 
      headerName: 'Status', 
      field: 'status', 
      filter: 'agTextColumnFilter', 
      floatingFilter: true, 
      flex: 1,
      cellStyle: (params) => {
        if (params.value === 'paid') {
          return { color: 'red' };
        }
        return null;
      }
    },
    { headerName: 'Comments', field: 'comments', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { headerName: 'Tracking Number', field: 'trakingNumber', filter: 'agNumberColumnFilter', floatingFilter: true, flex: 1 },
    { 
      headerName: 'Action', 
      field: 'action',
      filter: false,
      cellRenderer: (params) => <ActionCellComponent {...params} id={params.data.orderId} nodeleteorder={false} />,
      flex: 1
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
        <div className="bg-white w-100 p-2">
          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 className='text-xl ml-5 font-bold'>Orders Page:</h1>
          </div>
          
          <div className='ag-theme-alpine w-[96%] ml-5' style={{ height: 500 }}>
            <AgGridReact
              rowData={orderData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ShowOrders;
