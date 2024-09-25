import { useEffect, useState, useMemo } from 'react';
import { Axios } from '../../Api/Axios';
import { Link } from 'react-router-dom';
import LoadingPage from '../loading/Loading';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { IoAddCircle } from 'react-icons/io5';
import ActionCellComponent from '../table/ActionCellComponent'
import ConfirmationModal from '../helpers/ConfirmationModal';
import Popup from '../helpers/Popup';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function ShowSubCategories() {
  const [subcategories, setsubCategories] = useState([]);
  const [onDelete, setOnDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setshowPopup] = useState(false)


  console.log(subcategories);

  useEffect(() => {
    setLoading(true);
    Axios.get(`/SubCategories`)
    .then((data) => {
      setsubCategories(data.data);
      console.log(data)
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }, [onDelete]);

  const deleteHandler = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await Axios.delete(`/SubCategories/${selectedId}`);
      console.log(res);
      setOnDelete(prev => !prev);
      setLoading(false);
      setShowModal(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setShowModal(false);
      if(err.response?.status === 400){
        setshowPopup(true)
      }
    }
  };

  
  const categoryData = subcategories.map((subcategory, index) => ({
    nameEn: subcategory.nameEn,
    nameAr: subcategory.nameAr,
    catnameEr: subcategory.categories.nameEn,
    subcategoryId: subcategory.subCategoryId  
  }));

  const columnDefs = useMemo(() => [
    { headerName: 'Category Name', field: 'catnameEr', filter: 'agTextColumnFilter', floatingFilter: true ,  flex: 1 },
    { headerName: 'Name in English', field: 'nameEn', filter: 'agTextColumnFilter', floatingFilter: true ,  flex: 1 },
    { headerName: 'Name in Arabic', field: 'nameAr', filter: 'agTextColumnFilter', floatingFilter: true , flex: 1  },
    { 
      headerName: 'Action', 
      field: 'action',
      filter: false,
      cellRenderer: (params) => <ActionCellComponent {...params} id={params.data.subcategoryId}  deleteHandler={deleteHandler} /> ,
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
            <h1 className='text-xl ml-5 font-bold'>SubCategories Page:</h1>
            <Link className="btn custom-bg-btn flex items-center gap-1 text-sm" to='/dashboard/sub-categories/add'>
              <IoAddCircle /> Add SubCategory
            </Link>
          </div>
          
          <div className='ag-theme-alpine w-[96%] ml-5' style={{ height: 500 }}>
            <AgGridReact
              rowData={categoryData}
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
        body="
          Are you sure?
        "
      />
      <Popup
            show={showPopup}
            handleClose={() => setshowPopup(false)}
            title="Warning"
            body={'You can not delete this SubCategory because there is products related to it'}/>
        </>
        
      )}
    </>
  );
}

export default ShowSubCategories;
