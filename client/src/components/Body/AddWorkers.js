import '../../index.css';
import httpCommon from '../../http-common';
import $ from 'jquery';
import React, { useState } from 'react';




function AddWorkers() {

    const [isCheckedSunday, setIsCheckedSunday] = useState(false);
    const handleOnChangeSunday = () => { setIsCheckedSunday(!isCheckedSunday); };
    const [isCheckedMonday, setIsCheckedMonday] = useState(false);
    const handleOnChangeMonday = () => { setIsCheckedMonday(!isCheckedMonday); };
    const [isCheckedTuesday, setIsCheckedTuesday] = useState(false);
    const handleOnChangeTuesday = () => { setIsCheckedTuesday(!isCheckedTuesday); };
    const [isCheckedWednesday, setIsCheckedWednesday] = useState(false);
    const handleOnChangeWednesday = () => { setIsCheckedWednesday(!isCheckedWednesday); };
    const [isCheckedThursday, setIsCheckedThursday] = useState(false);
    const handleOnChangeThursday = () => { setIsCheckedThursday(!isCheckedThursday); };
    const [isCheckedFriday, setIsCheckedFriday] = useState(false);
    const handleOnChangeFriday = () => { setIsCheckedFriday(!isCheckedFriday); };


    const onCreate = () => {
        var worker = {
            "id": $("#new_worker_id").val(),
            "firstname": $("#new_worker_firstname").val(),
            "lastname": $("#new_worker_lastname").val(),
            "username": $("#new_worker_username").val(),
            "password": $("#new_worker_password").val(),
            "mail": $("#new_worker_mail").val(),
            "gender": $("#new_worker_gender").val(),
            "location": $("#new_worker_location").val(),
            "address": $("#new_worker_address").val(),
            "Sunday": isCheckedSunday ? "1" : "0",
            "Monday": isCheckedMonday ? "1" : "0",
            "Tuesday": isCheckedTuesday ? "1" : "0",
            "Wednesday": isCheckedWednesday ? "1" : "0",
            "Thursday": isCheckedThursday ? "1" : "0",
            "Friday": isCheckedFriday ? "1" : "0",
        }
        console.log(worker)
        httpCommon.post('/workers/add/' + JSON.stringify(worker))
            .then(function (response) {
                if (response.status == 200) {
                    // $("."+worker_id).attr("disabled","disabled")
                }
            })
            .catch(err => {
                alert("oh no! " + err)
            })
    };


    return (
        <div id="abo">
            <div class="panel" style={{ paddingTop: '25px', paddingBottom: '30px' }}>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 mt-3 contact-widget-section2 wow animated fadeInLeft" data-wow-delay=".2s">
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">worker id</label>
                                <input class="form-control" type="text" id={"new_worker_id"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">firstname</label>
                                <input class="form-control" type="text" id={"new_worker_firstname"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">lastname</label>
                                <input class="form-control" type="text" id={"new_worker_lastname"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">username</label>
                                <input class="form-control" type="text" id={"new_worker_username"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">password</label>
                                <input class="form-control" type="text" id={"new_worker_password"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">location</label>
                                <input class="form-control" type="text" id={"new_worker_location"}></input>
                                <div class="help-block with-errors"></div>
                            </div>

                        </div>
                        <div class="col-sm-5 " style={{ paddingBottom: '15px', paddingTop: '15px' }} >
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">gender</label>
                                <input class="form-control" type="text" id={"new_worker_gender"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label" for="name">mail</label>
                                <input class="form-control" type="text" id={"new_worker_mail"}></input>
                                <div class="help-block with-errors"></div>
                            </div>
                            <div class="form-group label-floating">
                                <label for="message" class="control-label">Work sceduale</label><br />
                                <input type="checkbox" id="new_worker_Sunday" name="Sunday" value="0" 
                                    checked={isCheckedSunday} onChange={handleOnChangeSunday} />
                                <label for="Sunday"> Sunday</label><br />
                                <input type="checkbox" id="new_worker_Monday" name="Monday" value="0"  
                                    checked={isCheckedMonday} onChange={handleOnChangeMonday} />
                                <label for="Monday"> Monday</label><br />
                                <input type="checkbox" id="new_worker_Tuesday" name="Tuesday" value="0"  
                                    checked={isCheckedTuesday} onChange={handleOnChangeTuesday} />
                                <label for="Tuesday"> Tuesday</label><br />
                                <input type="checkbox" id="new_worker_Wednesday" name="Wednesday" value="0" 
                                    checked={isCheckedWednesday} onChange={handleOnChangeWednesday} />
                                <label for="Wednesday"> Wednesday</label><br />
                                <input type="checkbox" id="new_worker_Thursday" name="Thursday" value="0" 
                                    checked={isCheckedThursday} onChange={handleOnChangeThursday} />
                                <label for="Thursday"> Thursday</label><br />
                                <input type="checkbox" id="new_worker_Friday" name="Friday" value="0" 
                                    checked={isCheckedFriday} onChange={handleOnChangeFriday} />
                                <label for="Friday"> Friday</label><br /><br />
                            </div>
                            <div class="form-submit mt-5">
                                <a class="btn btn-info text-center manageronly" onClick={() => onCreate()} style={{ backgroundColor: "rgb(199, 190, 250)", color: "black", role: "button" }}>
                                    add new worker &nbsp;&nbsp;&nbsp;&nbsp;   <span class="glyphicon glyphicon-floppy-saved" ></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AddWorkers;
