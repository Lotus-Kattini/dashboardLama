import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LoadingPage from '../loading/Loading';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { IoAddCircle } from 'react-icons/io5';
import ActionCellComponent from '../table/ActionCellComponent';
import ConfirmationModal from '../helpers/ConfirmationModal';
import { Axios } from '../../Api/Axios';
import Popup from '../helpers/Popup';
import LoadingDelete from '../loading/LoadingDelete';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function ShowCategories() {
  const [categories, setCategories] = useState([]);
  const [onDelete, setOnDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [categoryId,setcategoryId]=useState('')
  const [subcat,setsubcat]=useState([])
  const [categoryName,setcategoryName]=useState('')


  useEffect(() => {
    setLoading(true);
    Axios.get(`/Categories`)
    .then((data) => {
      setCategories(data.data);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }, [onDelete]);


  
  async function deleteHandler (id)  {
    setSelectedId(id);
    setLoadingDelete(true)
    const categoryResponse = await Axios.get(`/Categories/${id}`);
      setcategoryName(categoryResponse.data.nameEn);
      setLoadingDelete(false)
      setShowModal(true);
  };


  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(`/Categories/${selectedId}`);
      console.log(res);
      setOnDelete(prev => !prev);
      setLoading(false);
      setShowModal(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setShowModal(false);
      if(err.response?.status === 400){
        setShowPop(true)
      }
    }
  };



  const CategoryNameCom = ({ categoryName }) => (
    <>
    <p>Are you sure you want to delete <span className='text-red-500'>{categoryName}</span> category?</p>
    </>
  );

  const categoryData = categories.map((category) => ({
    nameEn: category.nameEn,
    nameAr: category.nameAr,
    categoryId: category.categoryId,
    nodelete: category.nameEn === 'Clothes',
  }));

  const columnDefs = useMemo(() => [
    { headerName: 'Name in English', field: 'nameEn', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { headerName: 'Name in Arabic', field: 'nameAr', filter: 'agTextColumnFilter', floatingFilter: true, flex: 1 },
    { 
      headerName: 'Action', 
      field: 'action',
      filter: false,
      cellRenderer: (params) => <ActionCellComponent {...params} id={params.data.categoryId}  deleteHandler={deleteHandler} nodelete={params.data.nodelete}/>,
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
        <>
        <div className="bg-white w-100 p-2">
          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 className='text-xl ml-5 font-bold'>Categories Page:</h1>
            <Link className="btn custom-bg-btn flex items-center gap-1" to='/dashboard/addcategory'>
              <IoAddCircle /> Add Category
            </Link>
          </div>
          
          {loadingDelete ? <LoadingDelete/> : <div className='ag-theme-alpine w-[96%] ml-5' style={{ height: 500 }}>
            <AgGridReact
              rowData={categoryData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          </div>}
        </div>
        <ConfirmationModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleConfirm={confirmDelete}
            title="Confirm Delete"
            body={<CategoryNameCom categoryName={categoryName}/>}
          />
          <Popup
            show={showPop}
            handleClose={() => 
              {setShowPop(false)
              setcategoryName('')}
            }
            title="Warning"
            body={'You can not delete this Category because there is Subcategories related to it'}/>
        </>
      )}
    </>
  );
}

export default ShowCategories;

