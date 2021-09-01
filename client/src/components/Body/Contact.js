//import './Header.css';
import $ from 'jquery';
import httpCommon from '../../http-common';

function Contact() {

const submit = ()=>{
  var email = {
    name: $("#name_contact").val(),
    email:$("#email_contact").val(),
    subject:$("#message_subject").val(),
    message:$("#message_text").val()
  }
  console.log(email)
  httpCommon.post('/email',email);
  $("#name_contact").val('')
   $("#email_contact").val('')
   $("#message_subject").val('')
  $("#message_text").val('')

  alert('thank you! your message has been sent. stay tuned to hear back from us!')
  }

  return (
    <div id="abo">
      <div class="panel" style={{ paddingTop: '25px', paddingBottom: '30px' }}>
        <div class="container">
          <div class="row">
            <div class="col-md-6 mt-3 contact-widget-section2 wow animated fadeInLeft" data-wow-delay=".2s">
              <h1 class="section-title">Love to Hear From You</h1>
              <p>We would Love to Hear from You!
                Our specialized customer support team is there to listen to your constant non-stop nagging 24/7 (except for Shabbos, holydays, summer vacation, around 53 sick days a year* and after 3 PM. Or before 11 AM. They are not that available really).
                Your opinion is very important to us. Unless you are one of those haters who just wants to criticize our lovely and charmful purple flowers. If that's the case, feel free to go and be annoying somewhere else! Because we really don't care what you have to say.
                *- The purple pollen makes them sneeze all the time, so we are taking COVID-19 precautions.</p>
              <br />
              <div class="find-widget"> Company:  <a href="#">T-Floweres</a></div>
              <div class="find-widget"> Address: <a href="#">4435 Berkshire Circle Knoxville</a></div>
              <div class="find-widget"> Phone:  <a href="#">+ 879-890-9767</a></div>
              <div class="find-widget"> mail:  <a href="#">T-Floweres@gmail.com</a></div>
              <div class="find-widget"> Website:  <a href="#">www.T-Floweres.il</a></div>
              <div class="find-widget"> Program: <a href="#">Sun to Fri: 09:30 AM - 04:30 PM</a></div>
            </div>
            <div class="col-sm-5 " style={{ paddingBottom: '15px', paddingTop: '15px' }} >
                <div class="form-group label-floating">
                  <label class="control-label" for="name_contact">Name</label>
                  <input class="form-control" id="name_contact" type="text" name="name_contact" required data-error="Please enter your name" />
                  <div class="help-block with-errors"></div>
                </div>
                <div class="form-group label-floating">
                  <label class="control-label" for="email_contact">Email/phone number for return</label>
                  <input class="form-control" id="email_contact" type="email" name="email_contact" required data-error="Please enter your Email" />
                  <div class="help-block with-errors"></div>
                </div>
                <div class="form-group label-floating">
                  <label class="control-label" for="message_subject">Subject</label>
                  <input class="form-control" id="message_subject" type="text" name="message_subject" required data-error="Please enter your message subject" />
                  <div class="help-block with-errors"></div>
                </div>
                <div class="form-group label-floating">
                  <label for="message_text" class="control-label">Message</label>
                  <textarea class="form-control" rows="3" id="message_text" name="message_text" required data-error="Write your message"></textarea>
                  <div class="help-block with-errors"></div>
                </div>
                <div class="form-submit mt-5">
                  <button class="btn btn-common" type="submit" id="form-submit" onClick={()=>submit()} style={{ backgroundColor: 'rgb(199, 190, 250)' }}> Send Message</button>
                  <div id="msgSubmit" class="h3 text-center hidden"></div>
                  <div class="clearfix"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;








