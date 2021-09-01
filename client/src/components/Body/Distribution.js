import '../../index.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import $ from 'jquery';


function Distribution() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const Convert = () => {
        // var address = {"address": $("#address_input").val()}
        // httpCommon.get('/getcoordinates/'+JSON.stringify(address))
        // .then(function (response) {
        //     if(response.status==200) {
        //         var geo=response.data.coordinate
        //         alert('lat:'+geo.latitude+', long:'+geo.longitude)
        //   }})
        //   .catch(err => {
        //     alert("oh no! "+err)
        //    })
        }

        useEffect(() => {
            httpCommon.get('/distribute')
              .then(
                (result) => {
                  setIsLoaded(true);
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
            <div class="container-fluid bg-grey">
                <input type="text" id="address_input" />
               { <a class="btn btn-info text-center manageronly"  onClick={() => Convert()} style={{backgroundColor: "rgb(199, 190, 250)", color: "black", role: "button"}}> 
                convert to geo</a>}
                </div>
        )
        }
}

export default Distribution;

