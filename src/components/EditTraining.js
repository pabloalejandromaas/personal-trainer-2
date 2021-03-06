import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';



function EditTraining(props) {
  const [training, setTraining] = useState({
    date: "",
    duration: "",
    activity: ""
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    console.log(props.params.data);
    console.log(props.params.data.links[0].href);
    setTraining({
      date: props.params.data.date,
      duration: props.params.data.duration,
      activity: props.params.data.activity
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    props.updateTraining(props.params.data.links[0].href, training);
    handleClose();
  };

  const inputChanged = (event) => {
    setTraining({ ...training, [event.target.name]: event.target.value });
  };

  // date picker

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
  }));

  const classes = useStyles();

  return (
    <div>
        <EditOutlinedIcon
          color="disabled" onClick={handleClickOpen}/>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit training</DialogTitle>

        <DialogContent>
        <TextField
            type="datetime-local"
            name="date"
            value={training.date}
            onChange={inputChanged}
            label="New date and time (Click on the icon on the right)"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          <TextField
            margin="dense"
            name="duration"
            value={training.duration}
            onChange={inputChanged}
            label="Duration (minutes)"
            fullWidth
          />

          <TextField
            margin="dense"
            name="activity"
            value={training.activity}
            onChange={inputChanged}
            label="Activity"
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditTraining;
