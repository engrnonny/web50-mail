document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});


// Archive an email.
function archive_email(email_id) {

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  load_mailbox('inbox');
}

// Unarchive an email.
function unarchive_email(email_id) {

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
  load_mailbox('inbox');
}


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 id="mailbox-name">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load mails of mailbox if "inbox" is clicked.

  if (mailbox == 'inbox') {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        document.querySelector('#emails-view').innerHTML += `<div id="email-list"></div>`
        for (var i = 0; i < emails.length; i++) {
          if (emails[i].read == false) {
            const email_div = `<div id="single-email" style="background-color: white; border: 2px solid black; margin: 2rem; padding: 0.5rem; height: 4rem;">
            <a href="" id=${emails[i].id} value=${emails[i].id} onclick="view_email(${emails[i].id}, 1); return false;">
              <span>${emails[i].subject}</span>
              <span>${emails[i].sender}</span>
              <span>${emails[i].timestamp}</span>
            </a>
          </div>`
          document.querySelector('#email-list').innerHTML += email_div
          }
          else {
            document.querySelector('#email-list').innerHTML += `<div id="single-email" style="background-color: lightgrey; border: 2px solid black; margin: 2rem; padding: 0.5rem; height: 4rem;">
            <a href="" id=${emails[i].id} value=${emails[i].id} onclick="view_email(${emails[i].id}, 1); return false;">
                <span>${emails[i].subject}</span>
                <span>${emails[i].sender}</span>
                <span>${emails[i].timestamp}</span>
              </a>
            </div>`
          }
        }
        
    });
  }
  
  else if (mailbox == 'sent') {
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
        document.querySelector('#emails-view').innerHTML += `<div id="email-list"></div>`
        for (var i = 0; i < emails.length; i++) {
          
          document.querySelector('#email-list').innerHTML += `<div id="single-email" style="background-color: lightgrey; border: 2px solid black; margin: 2rem; padding: 0.5rem; height: 4rem;">
            <a href="" id=${emails[i].id} value=${emails[i].id} onclick="view_email(${emails[i].id}, 2); return false;">
              <span>${emails[i].subject}</span>
              <span>${emails[i].sender}</span>
              <span>${emails[i].timestamp}</span>
            </a>
          </div>`
        }
        
    });
  }

  else if (mailbox == 'archive') {
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
        document.querySelector('#emails-view').innerHTML += `<div id="email-list"></div>`
        for (var i = 0; i < emails.length; i++) {
          
          document.querySelector('#email-list').innerHTML += `<div id="single-email" style="background-color: lightgrey; border: 2px solid black; margin: 2rem; padding: 0.5rem; height: 4rem;">
            <a href="" id=${emails[i].id} value=${emails[i].id} onclick="view_email(${emails[i].id}, 3); return false;">
              <span>${emails[i].subject}</span>
              <span>${emails[i].sender}</span>
              <span>${emails[i].timestamp}</span>
            </a>
          </div>`
        }
        
    });
  }
}


function reply_email(email_id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = email.sender;
    var str = email.subject;
    var strFirstThree = str.substring(0,3);
    if (strFirstThree == "Re:") {
      document.querySelector('#compose-subject').value = email.subject;
    }
    else {
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    }
    
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n${email.body}`;
  });
}
  


function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
      .then(result => {
        if ("message" in result) {
            // The email was sent successfully!
            load_mailbox('sent');
        }

        if ("error" in result) {
            // There was an error in sending the email
            // Display the error next to the "To:"
            document.querySelector('#to-text-error-message').innerHTML = result['error']

        }
        console.log(result);
        console.log("message" in result);
        console.log("error" in result);
      })
        .catch(error => {
            // we hope this code is never executed, but who knows?
            console.log(error);
        });
  return false;
}


function view_email(email_id, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'block';
  document.querySelector('#view-email').innerHTML = "";

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    const view_email = document.querySelector('#view-email');
    view_email.innerHTML += `<h3>${email.subject}</h3><span>${email.timestamp}</span>`
    view_email.innerHTML += '<br>'
    if (mailbox == 1) {
      view_email.innerHTML += `<div><button onclick="archive_email(${email.id}); return false;" class="btn btn-primary">Archive</button></div>`
    } 
    else if (mailbox == 3) {
      view_email.innerHTML += `<div><button onclick="unarchive_email(${email.id}); return false;" class="btn btn-primary">Unarchive</button></div>`
    }      
    view_email.innerHTML += '<hr>'
    view_email.innerHTML += `<div>From: ${email.sender}</div>`
    view_email.innerHTML += `<div>To: ${email.recipients}</div>`
    view_email.innerHTML += '<br>'
    view_email.innerHTML += `<div>Message:</div><div class="form-control">${email.body}</div><br>`
    if (mailbox == 1) {
      view_email.innerHTML += `<div><button onclick="reply_email(${email.id}); return false;" class="btn btn-primary">Reply</button></div>`
    } 
  });

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}