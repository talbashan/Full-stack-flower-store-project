//import './Header.css';
import React, { useState, useEffect } from "react";
import httpCommon from '../../http-common';
import TextField from '@material-ui/core/TextField';
import $ from 'jquery';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import  {setCookie, getCookie} from '../../cookie'



var TOKEN = 'pk.eyJ1IjoidGFsdGFtaXIiLCJhIjoiY2tzaG43eWhrMXFlYTJ1cDI5NXF3MGZ5ZyJ9.-lENmX_6tW_hAnsu_vttKw';

function Packages() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [workerId, setWorkerId] = useState([]);

  const handleChangeId = (event) => {
    setWorkerId(event.target.value);
    console.log(workerId)
  }

  const handleChange = (event) => {
    //$("#" + event.target.id).val()
    //setChecked(event.target.checked);
    var ids = {id:event.target.id.split('_')[0],index:event.target.id.split('_')[1]}
    var pack = {
      "user_id": $("#" + ids.id + "_id").val(),
      "worker_id": workerId,
      "date": $("#date_pick").val().replace(/-0/g, '-'),
      "happened": event.target.checked
    }
    console.log(pack)
    httpCommon.get('/packages/update/' + JSON.stringify(pack))
    setIsLoaded(false)
    setChecked(checked.map((x,index)=>index==ids.index? event.target.checked : x))
    setIsLoaded(true)
    // httpCommon.post('/users/save/' + JSON.stringify(user))
    //   .then(function (response) {
    //     if (response.status == 200) {
    //       $(".new_userr").removeAttr("value")
    //     }
    //   })
    //   .catch(err => {
    //     alert("oh no! " + err)
    //   })
  }

  const onFind = () => {
    let d = $("#date_pick").val().replace(/-0/g, '-')
    console.log(getCookie())
    let id = workerId
    // (getCookie()).id
    // let id = $("#standard-basic").val()
    setIsLoaded(false);
    httpCommon.get('/packages/' + d + "/" + id)
      .then(
        (result) => {
          setPackages(result.data.packages);
          setChecked(result.data.packages.map(x=>x.happened))
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        })
  }

  useEffect(() => {
    httpCommon.get('/workers')
      .then(
        (result) => {
        httpCommon.get('/packages/' + + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
         + "/" + getCookie().id)
      .then(
        (res) => {
        
          setPackages(res.data.packages)
          setChecked(res.data.packages.map(x=>x.happened))
          if(getCookie().type=="manager")
          setWorkers(result.data.workers);
          else
          setWorkers([{id:getCookie().id, firstname:"my", lastname:"packages" }])
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )}
      )
  }, []);

  {
    if (error) { return <div>Error: {error.message}</div> }
    else {
      return (        
      <div id="abo">
          <div class="row" style={{ padding: '30px' }}>
          <div class="col-sm-3">
            <div  style={{ margin: "0 auto", backgroundColor:"#EEEEEE" , alignItems: 'center', justifyContent: 'center', height:"753.56px"}}>
            <div>
            <form noValidate autoComplete="off">
             <br/>
             &#8194; 
             <TextField id="date_pick" label="pick date to display" type="date"
                InputLabelProps={{ shrink: true }} /> 
                 <br/>
                <br/>

              &#8194;
              <FormControl>
                <InputLabel id="demo-simple-select-label" style={{width:"100px"}}> worker name</InputLabel>                
                <Select  style={{width:"100px"}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleChangeId}>
                  {workers.map(worker => (
                    <MenuItem value={worker.id}>{worker.firstname+" "+worker.lastname}</MenuItem>                
                  ))}
                </Select>

              </FormControl> 
                 <br/>
                <br/>
              &#8194; <button id="send" class="btn btn-common" onClick={() => onFind()} style={{ backgroundColor: 'rgb(199, 190, 250)' }}> Find packages</button>
            </form>
           </div>
            </div>
          </div>


          <div class="col-sm-9">
          <div  style={{ margin: "10 auto", backgroundColor:"#EEEEEE" , alignItems: 'center', justifyContent: 'center', height:"753.56px"}}>
                    {isLoaded==false && <h4>loading...</h4>}
            {isLoaded && !error && packages.length>0 &&
              <div class="container-fluid bg-grey">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      {/* <th scope="col"> user id</th> */}
                      <th scope="col"> id </th>
                      <th scope="col"> firstname </th>
                      <th scope="col"> lastname </th>
                      <th scope="col"> location </th>
                      <th scope="col"> delivered </th>
                    </tr>
                  </thead>
                  <tbody>

                    {packages.map((user, index) => (
                      <tr>
                        <td> <input class={user.user_id} type="text" id={user.user_id + "_id"} disabled="disabled" defaultValue={user.user_id} style={{ backgroundColor: "inherit" }} /> </td>
                        <td> <input class={user.user_id} type="text" id={user.user_id + "_firstname"} disabled="disabled" defaultValue={user.firstname} style={{ backgroundColor: "inherit" }} /> </td>
                        <td> <input class={user.user_id} type="text" id={user.user_id + "_lastname"} disabled="disabled" defaultValue={user.lastname} style={{ backgroundColor: "inherit" }} /> </td>
                        <td> <input class={user.user_id} type="text" id={user.user_id + "_location"} disabled="disabled" defaultValue={user.location} style={{ backgroundColor: "inherit" }} /> </td>
                        <td> <Checkbox checked={checked[index]} id={user.user_id+"_"+index} onChange={handleChange} inputProps={{ 'aria-label': 'primary checkbox' }} style={{color:"purple"}} /></td>
                      </tr>
                    ))}


                  </tbody>
                </table>
              </div>
            }
            {isLoaded&&
              packages.length==0&&
              <div class="container-fluid bg-grey" style={{ backgroundColor:"#EEEEEE" , alignItems: 'center', justifyContent: 'center'}}>
              <div >
              <img src='https://media.istockphoto.com/vectors/woman-relaxing-at-home-vector-id1265224497?b=1&k=20&m=1265224497&s=170667a&w=0&h=djbKk3sHHEP3DAa-D1dzANQZCeAR4JAlrAzPnXa1z1Y=' style={{ display:"block",marginLeft:"auto",marginRight:"auto", paddingTop:"50px"}} />
              <h3 style={{textAlign: "center"}}>It seems Like this day is not a working day for you...</h3>
              </div>
              </div>
            }
          </div>
          </div>
                    </div>

        </div>
      );
    }
  }
}

export default Packages;


