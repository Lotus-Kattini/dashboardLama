import React, { useEffect, useState, useMemo } from 'react';
import { IoAddCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import LoadingPage from '../loading/Loading';
import ActionCellComponent from '../table/ActionCellComponent';
import ConfirmationModal from '../helpers/ConfirmationModal';
import { Axios } from '../../Api/Axios';


ModuleRegistry.registerModules([ClientSideRowModelModule]);

function ShowExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [onDelete, setOnDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);



  useEffect(() => {
    setLoading(true);
    Axios.get(`/Expenses`)
      .then((data) => setExpenses(data.data))
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
      const res = await Axios.delete(`/Expenses/${selectedId}`);
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

  

 
  const rowData = expenses.map((expense, index) => ({
    cost: expense.cost,
    currency: expense.currency,
    description: expense.description,
    details: expense.details,
    expenseId: expense.expenseId
  }));

  const columnDefs = useMemo(() => [
    { headerName: 'Cost', field: 'cost', filter: 'agNumberColumnFilter', floatingFilter: true },
    { headerName: 'Currency', field: 'currency', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'Description', field: 'description', filter: 'agTextColumnFilter', floatingFilter: true },
    { headerName: 'Details', field: 'details', filter: 'agTextColumnFilter', floatingFilter: true },
    { 
      headerName: 'Action', 
      field: 'actions',
      filter: false,
      cellRenderer: (params) => <ActionCellComponent {...params} id={params.data.expenseId} deleteHandler={deleteHandler} /> 
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
            <h1 className="text-xl ml-5 font-bold">Expenses Page:</h1>
            <Link className="btn custom-bg-btn flex items-center gap-1" to="/dashboard/addexpences">
              <IoAddCircle className="icon-add" /> Add Expense
            </Link>
          </div>
          <div className="ag-theme-alpine w-[96%] ml-5" style={{ height: 500 }}>
            <AgGridReact
              rowData={rowData}
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

export default ShowExpenses;
