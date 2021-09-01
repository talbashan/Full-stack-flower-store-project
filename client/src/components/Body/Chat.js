import '../../index.css';
import './Chat.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import $ from 'jquery';
import { json } from 'body-parser';
import  {setCookie, getCookie} from '../../cookie'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { set } from 'mongoose';


//import { SocketProvider } from 'socket.io-react';
//import io from 'socket.io-client';

function Chat() {
  const URL = 'ws://127.0.0.1:4001';

  const [workers, setWorkers] = useState([{id:"11",firstname:"loading...",lastname:""}]);
  const [user, setUser] = useState(getCookie().firstname);
  const [message, setMessage] = useState([]);
  var [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(new WebSocket(URL));
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adressed, setAdressed] = useState(getCookie().type=="manager"?"11":"21111119")
  //var [messages, setmessages] = useState([]);
  // const socket = io();
  //const socket = io.connect(process.env.SOCKET_URL);
  //socket.on('message', (msg) => { console.log(msg) });
  const submitMessage = (msg) => {
    const message = { sender_name:user, sender_id: getCookie().id,to:adressed, message: msg };
    console.log(message)
    ws.send(JSON.stringify(message));
    setIsLoaded(false);
        messages.push(message)
        setMessages(messages)
        setIsLoaded(true);
        httpCommon.post('/message', message)
    ///////setMessages([message, ...messages]);
  }

  const handleChangeId = (event) => {
    setAdressed(event.target.value);
    console.log(event.target.value)
     setIsLoaded(false)
          httpCommon.post('/messages', { to: event.target.value, sender_id: getCookie().id }).then(
        (result) => {
                setMessages(result.data);
                setIsLoaded(true);
},
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      )
    
  }

  
  useEffect(() => {
    //TODO: get messages to cookieuser from adressed and lehefech. post!!!

    //if(getCookie.type()!="manager")
    //setIsLoaded(false)  
    httpCommon.post('/messages', { to: adressed, sender_id: getCookie().id }).then(
        (result) => {
          httpCommon.get('/workers')
            .then(
              (res) => {
                setWorkers(res.data.workers)
                setMessages(result.data);
                setIsLoaded(true);

              })
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      )
      },[])

    
     useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Connected');
    }
    var count = 0;
    var pending = {};
    var stack = [];
    ws.onmessage = (e) => {
      console.log(e)

      var string_arr = JSON.parse(e['data']).data;
      var string = "";

      string_arr.forEach(element => {
        string += String.fromCharCode(element);
      });

      console.log(string);
      const message = JSON.parse(string)
      console.log(message)
      if(message.to == getCookie().id && message.sender_id==adressed)
      {setIsLoaded(false);
        messages.push(message)
        setMessages(messages)
        setIsLoaded(true);
      }
      ////////setMessages([...messages,message]);
    }

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWs(new WebSocket(URL));
      }
    }
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);



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
          <h2>Admin-Workers Chat</h2>
           

            {getCookie().type=="manager" &&
            <FormControl style={{paddingBottom:"10px"}}>
            <InputLabel id="demo-simple-select-label" style={{width:"100px"}}> select worker</InputLabel>                
            <Select  style={{width:"100px"}}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={handleChangeId} vale={{adressed}}>
              {workers.map(worker => 
                (
                <MenuItem value={worker.id}>{worker.firstname+" "+worker.lastname}</MenuItem>    
                )            
              )}
            </Select>
            <br/>
          
          </FormControl>}
          
            <div id="messages">
            
              {isLoaded && messages.map((message, index) =>
                <div key={index}>
                  <span class={message.sender_name != user ? "span right" : "span left"}>
                    <h5 style={{ margin: "2px" }}> {message.sender_name==user? "me":message.sender_name} </h5>
                    <h6 style={{ margin: "0px" }}>  {message.message} </h6>
                  </span>
                  <div class="clear"></div>
                </div>
              )}
              {isLoaded==false &&
                  <div> loading chat... </div>
                }
            </div>

            <form
              action=""
              onSubmit={e => {
                e.preventDefault();
                submitMessage(message);
                setMessage([]);
              }}>
              <textarea id = "message" rows="6" class="form-control" 
                type="text"
                placeholder={'Type a message ...'}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <br/>
              <button class="btn btn-common" type="submit" id="form-submit" style={{ backgroundColor: 'rgb(199, 190, 250)' }}> Send Message</button>
            </form>
          </div>
        </div>
      </div>

    );
  }
}

export default Chat;