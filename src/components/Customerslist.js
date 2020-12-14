import React, { useState, useEffect, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import Snackbar from "@material-ui/core/Snackbar";

import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

function Customerlist() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);

  const gridRef = useRef();

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = () => {
    fetch("https://customerrest.herokuapp.com/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data.content))
      .catch((err) => console.error(err));
  };

  const deleteCustomer = (link) => {
    if (window.confirm("Are you sure? Deleting customer will also delete all the customers' training activities." )) {
      fetch(link.links[0].href, {
        method: "DELETE",
      })
        .then((_) => gridRef.current.refreshCells({ rowNodes: getCustomers() }))
        .then(_ => setOpen(true))
        .catch((err) => console.error(err));
    }
  };
  
  const addCustomer = (newCustomer) =>{
    fetch("https://customerrest.herokuapp.com/api/customers" , {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newCustomer)
    })
    .then((_) => gridRef.current.refreshCells({ rowNodes: getCustomers() }))
    .catch((err) => console.error(err));
  }
  
  const updateCustomer = (link, customer) => {
    fetch(link , {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(customer)
    })
    .then((_) => gridRef.current.refreshCells({ rowNodes: getCustomers() }))
    .catch((err) => console.error(err));
  }

    const addTraining = (link, training) => {
    fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(training),
    })
      .then((_) => gridRef.current.refreshCells({ rowNodes: getCustomers() }))
      .catch((err) => console.error(err));
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  const columns = [
    {
      headerName: "First Name",
      field: "firstname",
      sortable: true,
      filter: true,
      
    },
    {
      headerName: "Last Name",
      field: "lastname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Street Address",
      field: "streetaddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Post Code",
      field: "postcode",
      sortable: true,
      filter: true,
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
      filter: true,
    },
    {
      headerName: "E-mail",
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      sortable: true,
      filter: true,
    },
    {
      headerName: "",
      width: 20,
      field: "links.href",
      cellRendererFramework: params =>
        <AddTraining sendTraining={addTraining} params={params} />
      ,
    },

    {
      headerName: '',
      width: 20,
      field: "links.href",
      cellRendererFramework: params => 
      <EditCustomer updateCustomer={updateCustomer} params={params} />
    },

    {
      headerName: "",
      //width: 20,
      field: "links.href",
      cellRendererFramework: params => (
        <DeleteOutlinedIcon
          color="disabled"
          title="Delete customer"
          alt="Delete customer"
          onClick={() => deleteCustomer(params.data)}
        />
      ),
    },

  ];

  return (

    <div>
      
      <AddCustomer addCustomer={addCustomer} />

    <div
      className="ag-theme-material"
      style={{ height: "700px", margin: "auto" }}
    >
      <AgGridReact
        ref={gridRef}
        suppressCellSelection={true}
        onGridReady={(params) => {
          gridRef.current = params.api;
        }}
        columnDefs={columns}
        rowData={customers}
        pagination={true}
        paginationPageSize={10}
        
      ></AgGridReact>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        message="Customer deleted successfully!"
      />
    </div></div>
  );
} 

export default Customerlist;
