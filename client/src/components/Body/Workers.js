import '../../index.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import $ from 'jquery';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import purple from '@material-ui/core/colors/purple';

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
});

function Workers() {


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [workers, setWorkers] = useState([]);

  const onUpdate = (worker_id) => {
    $("." + worker_id).removeAttr("disabled")
  };

  const onSave = (worker_id) => {
    var worker = {
      "firstname": $("#" + worker_id + "_firstname").val(),
      "lastname": $("#" + worker_id + "_lastname").val(),
      "id": $("#" + worker_id + "_id").val(),
      "mail": $("#" + worker_id + "_mail").val(),
      "location": $("#" + worker_id + "_location").val(),
      "address": $("#" + worker_id + "_address").val(),
      "gender": $("#" + worker_id + "_gender").val(),
      "original_id": worker_id
    }
    console.log(worker)
    httpCommon.post('/workers/save/' + JSON.stringify(worker))
      .then(function (response) {
        if (response.status == 200) {
          $(".new_worker").removeAttr("value")
          $("." + worker_id).attr("disabled","disabled")

        }
      })
      .catch(err => {
        alert("oh no! " + err)
      })
  }

  const onRemove = (worker_id) => {
    var worker = { id: worker_id }
    httpCommon.post('/workers/delete/' + JSON.stringify(worker))
      .then(function (response) {
        if (response.status == 200) {
          alert("worker was deleted. please referesh page to view changes")
        }
      })
      .catch(err => {
        alert("oh no! " + err)
      })
  }

  useEffect(() => {
    httpCommon.get('/workers')
      .then(
        (result) => {
          setIsLoaded(true);
          setWorkers(result.data.workers);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div class="container-fluid bg-grey" style ={{width:"80%"}}>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col"> worker id</th>
              <th scope="col"> firstname </th>
              <th scope="col"> lastname </th>
              <th scope="col"> location </th>
              <th scope="col"> mail </th>
              <th scope="col"> gender </th>
              <th scope="col"> remove </th>
              <th scope="col"> update </th>
              <th scope="col"> save </th>
            </tr>
          </thead>
          <tbody>
            {
              workers.map(worker => (
                <tr>
                  <td> <input class={worker.id} type="text" id={worker.id + "_id"} disabled="disabled" defaultValue={worker.id} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={worker.id} type="text" id={worker.id + "_firstname"} disabled="disabled" defaultValue={worker.firstname} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={worker.id} type="text" id={worker.id + "_lastname"} disabled="disabled" defaultValue={worker.lastname} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={worker.id} type="text" id={worker.id + "_location"} disabled="disabled" defaultValue={worker.location} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={worker.id} type="text" id={worker.id + "_mail"} disabled="disabled" defaultValue={worker.mail} style={{ backgroundColor: "inherit" }} /> </td>
                  <td> <input class={worker.id} type="text" id={worker.id + "_gender"} disabled="disabled" defaultValue={worker.gender} style={{ backgroundColor: "inherit" }} /> </td>
                  <td>
                    <MuiThemeProvider theme={theme}>

                      <IconButton color="primary"  onClick={() => onRemove(worker.id)} style={{color:"purple"}}>
                        <span class="glyphicon glyphicon-floppy-remove"></span>
                      </IconButton>

                    </MuiThemeProvider>

                    {/* <a class="btn btn-info text-center manageronly" style={{ backgroundColor: "rgb(199, 190, 250)", color: "black", role: "button" }}>
                      <span class="glyphicon glyphicon-floppy-remove"></span>
                    </a> */}
                  </td>
                  <td>
                    <IconButton onClick={() => onUpdate(worker.id)} style={{color:"purple"}}>
                      <span class="glyphicon glyphicon-floppy-save" ></span>
                    </IconButton>
                    {/* <a class="btn btn-info text-center manageronly"  style={{ backgroundColor: "rgb(199, 190, 250)", color: "black", role: "button" }}>
                      <span class="glyphicon glyphicon-floppy-save" ></span>
                    </a> */}
                  </td>
                  <td>
                    <IconButton color="purple" onClick={() => onSave(worker.id)} style={{color:"purple"}}>
                      <span class="glyphicon glyphicon-floppy-saved" ></span>
                    </IconButton>
                    {/* <a class="btn btn-info text-center manageronly" onClick={() => onSave(worker.id)} style={{ backgroundColor: "rgb(199, 190, 250)", color: "black", role: "button" }}>
                      <span class="glyphicon glyphicon-floppy-saved" ></span>
                    </a> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Workers;
