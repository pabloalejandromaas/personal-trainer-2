import React, { useState, useEffect, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import moment from "moment";

import EditTraining from './EditTraining';


import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Snackbar from "@material-ui/core/Snackbar";

// import DeleteTraining from "./DeleteTraining";
// import AddTraining from './AddTraining';


function DeleteTraining() {
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

  const gridRef = useRef();

  useEffect(() => {
    getTrainings();
  }, []);

  const getTrainings = () => {
    fetch("https://customerrest.herokuapp.com/api/trainings")
      .then((response) => response.json())
      .then((data) => setTrainings(data.content))
      .catch((err) => console.error(err));
  };

  const updateTraining = (link, training) => {
    fetch(link , {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(training)
    })
    .then((_) => gridRef.current.refreshCells({ rowNodes: getTrainings() }))
    .catch((err) => console.error(err));
  }

  const deleteTraining = (link) => {
      console.log(link.links[0].href)
      if (window.confirm("Are you sure?")) {
      fetch(link.links[0].href, {
        method: "DELETE",
      })
        .then((_) => gridRef.current.refreshCells({ rowNodes: getTrainings() }))
        .then(_ => setOpen(true))
        .catch((err) => console.error(err)); 
    } 
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  // moment().format("MMM Do YY");

  const columns = [
    {
      headerName: "Date",
      field: "date",
      cellRenderer: (data) => {
        return moment(data.value).format("MM/DD/YYYY HH:mm");
      },
      sortable: true,
      filter: true,
    },
    {
      headerName: "Duration",
      field: "duration",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Activity",
      field: "activity",
      sortable: true,
      filter: true,
    },
    {
      headerName: '',
      width: 20,
      field: "links.href",
      cellRendererFramework: params => 
      <EditTraining updateTraining={updateTraining} params={params} />
    },
    {
        headerName: "",
        //width: 20,
        field: "links[0].href",
        cellRendererFramework: params => (
          <DeleteOutlinedIcon
            color="disabled"
            onClick={() => deleteTraining(params.data)}
          />
        ),
      },
  
    ];

  return (

    <div>      
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
          rowData={trainings}
          pagination={true}
          paginationPageSize={10}
        ></AgGridReact>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={closeSnackbar}
          message="Training activity deleted successfully!"
        />
      </div>
    </div>
  );
}

export default DeleteTraining;
