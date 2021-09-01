import './Header.css';
import Body from './Body';
import { Container } from '../LoginForm/Container';
import httpCommon from '../../http-common';
import $ from 'jquery';
import React, { useEffect, useState } from "react";
import  {setCookie, getCookie} from '../../cookie'

function Header() {
  return (
    <div class="jumbotron jumbotron-title">
      <div class="container text-center">
        <h1 style={{ color: "white" }}>Tali's Flower Store</h1>
        <p style={{ color: "white" }}> Mission, Vission & Flowers</p>
      </div>
    </div>
  );
}

function NavBar() {

  const [active, setActive] = useState('about');
  const [exists, setExists] = useState(0);
  let [cookie, setCookies] = useState([]);


  const triggerText = 'login';
  const logout = () => {
    document.cookie = "user_name=" + '::expires=expired'
    setExists(0)
    setActive("about")
  }

  useEffect(() => {
    setCookies(getCookie());
    cookie = getCookie();
    if (cookie.type != undefined && cookie != "" && cookie != undefined)
      setExists(1)
    if (cookie.type == "manager")
      setExists(2)
  }, [])

  const onSubmit = (event) => {
    event.preventDefault(event);
    var user = {
      username: event.target.username.value,
      password: event.target.password.value
    };
    httpCommon.post('/login/:' + user.username, user).then(
      function (response) {
        //TODO: close login window
        if (response.status == 200) {
          setCookie(response.data)
          setCookies(getCookie());
          console.log('cookie', cookie)
          if (cookie.type == "manager") {
            setExists(2)
          }
          else {
            setExists(1)
          }
        }
        else if (response.status == 401) {
          console.log("username or password are incorrect. access denied!");
          alert("username or password are incorrect. access denied!")
          //$("#pass_reset_btn").removeAttr('hidden');
        }
        //  $("#progress").modal('hide');
      },
      (error) => {
        console.log(error);
      })
  };

  return (
    <div>
      <nav class="navbar navbar-inverse ">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"><span class="glyphicon glyphicon-leaf" style={{ color: 'blueviolet' }} /> T-Flowers </a>
          </div>
          <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav" id="navbar_list">
              <li id="about"  onClick={() => setActive("about")}><a id="about_a" href="#about">About</a></li>
              <li id="catalog"  onClick={() => setActive("catalog")}><a id="catalog_a" href="#catalog">Catalog</a></li>
              {exists > 0 && <li id="users" onClick={() => setActive("users")}><a id="users_a" href="#user">Users</a></li>}
              {exists > 1 && <li class="nav-item dropdown" id="workers_drp" >
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Workers
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown" style={{ color: 'blueviolet' }}>
                  <li id="add_workers" onClick={() => setActive("add_workers")}><a id="add_workers_a" href="#add_workers">Add worker</a></li>
                  <li id="workers" onClick={() => setActive("workers")}><a id="workers_a" href="#workers">All workers</a></li>
                </div>
              </li>}
              {exists > 0 && <li class="nav-item dropdown" id="distribute_drp" >
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Distribution
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown" style={{ color: 'blueviolet' }}>
                  <li id="package" onClick={() => setActive("packages")}><a id="packages_a" href="#package">Packages distribution</a></li>
                  <li id="map" onClick={() => setActive("map")}><a id="map_a" href="#map">Map distribution</a></li>
                </div>
              </li>}
              {exists > 0 && <li class="nav-item dropdown" id="charts_drp" >
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Charts                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown" style={{ color: 'blueviolet' }}>
                  <li id="Bar" onClick={() => setActive("bar")}><a id="Bar_a" href="#Bar_chart">Bar chart</a></li>
                  <li id="Pie" onClick={() => setActive("pie")}><a id="Pie_a" href="#Pie_chart">Pie chart</a></li>
                </div>
              </li>}

              {exists > 0 && <li class="nav-item dropdown" id="blog_drp" >
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Blog                
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown" style={{ color: 'blueviolet' }}>
                  <li id="post"  onClick={() => setActive("addpost")}><a id="post_a" href="#post"> Add post</a></li>
                  <li id="blog"  onClick={() => setActive("blog")}><a id="blog_a" href="#blog"> View blog</a></li>
                </div>
              </li>}

              {exists > 0 && <li id="chat"  onClick={() => setActive("chat")}><a id="chat_a" href="#chat">Chat</a></li>}

              <li id="contact" onClick={() => setActive("contact")}><a id="contact_a" href="#contact_us">Contact us</a></li>

            </ul>
            <ul class="nav navbar-nav navbar-right">
              {exists > 0 && <li id="user_name" ><a id="user_name_a" href="#"> Welcome {cookie.firstname}</a></li>}
              {exists < 1 && <Container id="login" triggerText={'login'} onSubmit={onSubmit} />}
              {exists > 0 && <li id="logout" onClick={() => logout()}><a href="#" id="logout_a" > logout <span class="glyphicon glyphicon-send"></span></a></li>}
            </ul>
          </div>
        </div>
      </nav>
      <div>
        {active === "about" && <Body title='about' />}
        {active === "blog" && <Body title='blog' />}
        {active === "addpost" && <Body title='addpost' />}
        {active === "catalog" && <Body title='catalog' />}
        {active === "users" && <Body title='users' />}
        {active === "packages" && <Body title='packages' />}
        {active === "workers" && <Body title='workers' />}
        {active === "add_workers" && <Body title='add_workers' />}
        {active === "contact" && <Body title='contact' />}
        {/* {active === "distribution" && <Body title='distribution' />} */}
        {active === "map" && <Body title='map' />}
        {active === "bar" && <Body title='bar' />}
        {active === "pie" && <Body title='pie' />}
        {active === "chat" && <Body title='chat' />}
      </div>
    </div>
  );
}

export { NavBar, Header };







/*
<!-- views/partials/login.ejs -->

<div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h3 class="modal-title w-100 font-weight-bold">Login</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body mx-3">
        <div class="md-form mb-5">
          <input type="text" name="name_login" id="name_login" class="form-control validate">
          <span class="glyphicon glyphicon-user"></span>
          <label data-error="wrong" data-success="right" for="orangeForm-name">User name</label>
        </div>
        <div class="md-form mb-4">
          <input type="password" name="pass_login" id="pass_login" class="form-control validate">
          <span class="glyphicon glyphicon-lock"></span>
          <label data-error="wrong" data-success="right" for="orangeForm-pass">User password</label>
        </div>
        <div class="md-form mb-4">
          <u> <button onclick="password_reset_click()" id="pass_reset_btn" class="modal-title btn-deep-orange"
              hidden="hidden" style="background-color: rgb(255, 255, 255);border-width: 0cm;color:blueviolet;">I forgot
              my password...</button></u>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-center">
        <button onclick="check_login_info()" class="btn btn-deep-orange"
          style="background-color: rgb(199, 190, 250);">Submit</button>
      </div>
    </div>
  </div>
</div>

<script>
  $(document).ready(function () {
    changeNavBar();
  });

  function logout() {
    removeCookie()
    document.location.href = "http://localhost:8080"
  }
  async function password_reset_click() {
    //  var res = timeoutPromise(5000, new Error('Timed Out!'), fetch("/mail",{
    //     method: "POST"

    //   }))
    $("#modalLoginForm").modal('hide');
    $("#modalPassResetForm").modal('show');
  }

  async function check_login_info() {
    $("#progress").modal('show');
    name = document.getElementById("name_login").value
    timeoutPromise(5000, new Error('Timed Out!'), fetch("/login/" + name, {
      method: "POST",
      body: JSON.stringify({
        username: name,
        password: document.getElementById("pass_login").value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }))
      .then(function (response) {
        if (response.status == 200) {
          document.location.href = "http://localhost:8080/users/" + name + "/";
        }
        else if (response.status == 401) {
          alert("username or password are incorrect. access denied!")
          $("#pass_reset_btn").removeAttr('hidden');
        }
        $("#progress").modal('hide');
      })
      .catch(err => {
        alert("oh no! " + err)
        if (response.status == 401) {
          alert("username or password are incorrect. access denied!")
          $("#pass_reset_btn").removeAttr('hidden');

        }
        $("#progress").modal('hide');
      })

  }

  function changeNavBar() {
    var userJson = getUserJson()
    if (userJson == null || userJson.username == null || userJson.username == "") {
      $("#catalog").hide()
      $("#users").hide()
      $("#branches").hide()
      $("#user_name").hide()
      $("#logout").hide()
      $("#userdetails").hide()
      // $("#users").show()
      // $("#branches").show()
      // $("#login").show()

    } else {
      var loc = document.location.href;
      if (loc.indexOf(userJson.username) == -1) {
        name = userJson.username
        document.location.href = "http://localhost:8080/users/" + name + "/";
      }
      data = "Hi " + userJson.username + " "
      $("#user_name_a").text(data);
      $("#user_name").show()
      // $(document).ready(function(){
      //   type = getUserJson().type
      //   alert(type)
      //   alert(document.cookie)
      //   if (type == "worker"){
      //     $("#snifId").remove
      //   }
      // });
      var manageronly = false
      if (userJson.type == "customer" || userJson.type == "supplier") {
        $("#catalog").show()
        $("#branches").show()
      }

      $("#userdetails").show()

      if (userJson.type == "manager") {
        $("#catalog").show()
        $("#users").show()
        $("#branches").show()
      }
      if (userJson.type == "worker") {
        $("#catalog").show()
        $("#users").show()
        $("#branches").show()
      }
      if (userJson.type != "manager") {
        $("#snifIdP").remove()
        $("#worker").remove()
        $("#supplier").remove()
        $("#manager").remove()
        $("#manager").remove()
        $(".manageronly").remove()
      }
      $("#logout").show()
      $("#login").hide()
      $("#register").hide()

    }
  }
</script>
*/
