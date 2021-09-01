import '../../index.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import $ from 'jquery';

function AddPost() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const Guid = () => {
    return 'xxxx-8xxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const sendMessage = () => {
    var message = {
      id: Guid(),
      name: $("#name").val(),
      message: $("#message").val(),
      date: new Date(),
      author: "johnny dough",
      image: $("#link").val()
    };
    httpCommon.post('/post', message)
    $("#message").val('')
    $("#name").val('')
    $("#link").val('')
    alert('your blog has been posted!')
  }

  useEffect(() => {
    httpCommon.get('/ping')
      .then(
        (result) => {
          setIsLoaded(true);
          //setFlower(result.data.flowers);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>
        <div class="container">
          <br />
          <div class="jumbotron" style={{
            backgroundColor: "lilach",
            marginBottom: "0",
            backgroundImage: "%PUBLIC_URL%/images/Wallpaper.jpg",
            backgroundRepeat: "repeat"
          }}>
            <h2>Write a New Blog</h2>
            <br />
            <input id="name" class="form-control" placeholder="Headline" />
            <br /><input id="link" class="form-control" placeholder="link to image" />
            <br />
            <textarea id="message" rows="6" class="form-control" placeholder="content">
            </textarea>
            <br />
            <button id="send" class="btn btn-common" onClick={() => sendMessage()} style={{ backgroundColor: 'rgb(199, 190, 250)' }}> Send post</button>
          </div>
          <div id="messages">

          </div>
        </div>
      </div>
    );
  }
}

export default AddPost;