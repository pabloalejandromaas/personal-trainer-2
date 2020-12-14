import React, { useState, useEffect, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import moment from "moment";
import Snackbar from "@material-ui/core/Snackbar";
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

function Trainingslist() {
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

  const gridRef = useRef();

  useEffect(() => {
    getTrainings();
  }, []);

  const getTrainings = () => {
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then((response) => response.json())
      .then((data) => setTrainings(data))
      .catch((err) => console.error(err));
  };

  /*  Delete training does not work with current link-fetch  

    const deleteTraining = (link) => {
    console.log(link)
    if (window.confirm("Are you sure?")) {
      fetch(link, {
        method: "DELETE",
      })
        .then((_) => gridRef.current.refreshCells({ rowNodes: getTrainings() }))
        .then((_) => setOpen(true))
        .catch((err) => console.error(err));
    } 
  }; */

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
      headerName: "Training ID",
      field: "id",
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
      headerName: "Customer ID",
      field: "customer.id",
      sortable: true,
      filter: true,
    },
    {
      headerName: "First name",
      field: "customer.firstname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Last name",
      field: "customer.lastname",
      sortable: true,
      filter: true,
    },
    /* {
      headerName: "",
      //width: 20,
      field: "links[0].href",
      cellRendererFramework: params => (
        <DeleteOutlinedIcon
          color="disabled"
          onClick={() => deleteTraining(params.data)}
        />
      ),
    }, */
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

export default Trainingslist;
