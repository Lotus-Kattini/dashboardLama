import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

const ActionCellRenderer = (props) => {
  const { id, deleteHandler,nodelete,nodeleteorder } = props;

  return (
    <div className='flex items-center'>
      {!nodelete && <Link to={`update/${id}`}>
        <FiEdit style={{ fontSize: '1.2rem', cursor: 'pointer', color: '#1d3e6e78' }} />
      </Link>}
      {(!nodelete || nodeleteorder) ? <MdDelete
        style={{ color: 'red', marginLeft: '0.7rem', fontSize: '1.2rem', cursor: 'pointer' }}
        onClick={() => deleteHandler(id)}
      />:''}
    </div>
  );
};

export default ActionCellRenderer;