import '../../index.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";

function Catalog() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [flowers, setFlower] = useState([]);

  useEffect(() => {
    httpCommon.get('/catalog')
      .then(
        (result) => {
          setIsLoaded(true);
          setFlower(result.data.flowers);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div class="container-fluid text-center bg-grey">
        <h2>Flower Catalog</h2>
        <h4>our seasony flowers:</h4>
        <div class="row">
         {flowers.map(flower => (
          <div class="col-sm-3 box">
            <div class="thumbnail text-center" style={{borderRadius: "5px"}}>
              <div>
                <img src={flower.image} width="200px" height="200px" />
              </div>
              <h4 style={{ color: '{flower.color}' }}> {flower.name}</h4>
              <p> color: {flower.color} </p>
              <p> price: {flower.price} <span class="glyphicon glyphicon-euro" ></span></p>
            </div>
          </div>
        ))}  
        </div>
      </div>
    );
  }
}

export default Catalog;
