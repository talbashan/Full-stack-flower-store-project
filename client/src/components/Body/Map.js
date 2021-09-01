//import './Header.css';
import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import httpCommon from '../../http-common';
import TextField from '@material-ui/core/TextField';
import $ from 'jquery';

var TOKEN = 'pk.eyJ1IjoidGFsdGFtaXIiLCJhIjoiY2tzaG43eWhrMXFlYTJ1cDI5NXF3MGZ5ZyJ9.-lENmX_6tW_hAnsu_vttKw';

function Map() {


const uniqBy = (a)=> {
    var index = [];
    for(let i=0;i<a.length;i++)
    {
      var isIn = false
      index.forEach(el => {
        if (el.worker_id==a[i].worker_id)
        isIn=true
      });
      if(!isIn)
      index.push(a[i])
    }
    return index//setSorted(uniqBy(result.data.packages))
}
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setPackages] = useState([]);
  const [sorted, setSorted]= useState([]);
  const [viewport, setViewport] = useState({
    latitude: 31.046051,
    longitude: 34.8516121,
    width: "80vw",
    height: "100vh",
    zoom: 7
  });
 
  const changeDate = (pop_id) => {
    let d = $("#date_pick").val().replace(/-0/g, '-')
    setIsLoaded(false);
    httpCommon.get('/distribute/' + d)
      .then(
        (result) => {
          setIsLoaded(true);
          setPackages(result.data.packages);
          setSorted(uniqBy(result.data.packages))        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        })
  }
  const togglePopup = (pop_id) => {
  }
  useEffect(() => {
    httpCommon.get('/distribute/' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())
      .then(
        (result) => {
          setIsLoaded(true);
          setPackages(result.data.packages);
          setSorted(uniqBy(result.data.packages))
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  {
    if (error) { return <div>Error: {error.message}</div> }
    else {
      return (
        <div id="abo">
          <div class="row" style={{ padding: '30px' }}>
            <div class="col-sm-3" style={{ margin: "0 auto",
  backgroundColor:"#EEEEEE" , alignItems: 'center', justifyContent: 'center', height:"753.56px"}}>
            <div>
            <h2>Selected Date:</h2>
            <TextField
              id="date_pick"
              label="pick date to display"
              type="date"
              InputLabelProps={{
                shrink: true
              }}
              onChange={() => changeDate()} /><br /><br />
              <h2>Workers Info:</h2><br/>
              {sorted.map(pack => (
                <h4><i class="glyphicon glyphicon-map-marker" style={{ color: pack.worker[0].color, fontSize: "20px" }}></i>
                {pack.worker[0].firstname} {pack.worker[0].lastname} ({pack.worker_id})<br/></h4>
              ))}
            </div>
            </div>
            
          
          <div class="col-sm-9" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',height:"753.56px" }}>

            {isLoaded && !error &&
              <ReactMapGL  {...viewport}
                mapStyle="mapbox://styles/mapbox/outdoors-v11"
                mapboxApiAccessToken={TOKEN} onViewportChange={setViewport}>
                {packages.map(pack => (
                  <>
                    <Marker latitude={pack.user_geo.lat} longitude={pack.user_geo.long}>
                      <i class="glyphicon glyphicon-map-marker" style={{ color: pack.worker[0].color, fontSize: "20px" }}></i>
                    </Marker>
                    <Marker latitude={pack.worker[0].lat} longitude={pack.worker[0].long}
                      onClick={() => togglePopup(true, "pop_" + pack.worker_id)}>
                      <i class="glyphicon glyphicon-map-marker" style={{ color: pack.worker[0].color, fontSize: "35px" }}></i>
                    </Marker>
                 
                  </>
                ))}
              </ReactMapGL>
            }
          </div>
          </div>
        </div>
      );
    }
  }
}

export default Map;


