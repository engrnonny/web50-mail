document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#send-email').addEventListener('click', () => send_email());

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.getElementById("compose-recipients").value,
        subject: document.getElementById("compose-subject").value,
        body: document.getElementById("compose-body").value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  load_mailbox('sent');
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 id="mailbox-name">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load mails of mailbox if "inbox" is clicked.

  if (mailbox == 'inbox') {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);
        document.querySelector('#emails-view').innerHTML += `<div id="email-list"></div>`
        for (var i = 0; i < emails.length; i++) {
          if (emails[i].read == false) {
            document.querySelector('#email-list').innerHTML += `<div id="single-email" style="background-color: white; border: 2px solid black; margin: 2rem; padding: 0.5rem; height: 4rem;">
              <a href="" id=${emails[i].id}>
                <span>${emails[i].subject}</span>
                <span>${emails[i].sender}</span>
                <span>${emails[i].timestamp}</span>  458
              </a>
            </div>`
          }
          else {
            document.querySelector('#email-list').innerHTML += `<div id="single-email" style="background-color: grey; border: 2px solid black; margin: 2rem; padding: 0.5rem; height: 4rem;">
              <a href="" id=${emails[i].id}>
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
        // Print emails
        console.log(emails);
        document.querySelector('#emails-view').innerHTML += `<div id="email-list"></div>`
        for (var i = 0; i < emails.length; i++) {
          
          document.querySelector('#email-list').innerHTML += `<div id="single-email">
          <span>${emails[i].subject}</span>
          <span>${emails[i].sender}</span>
          <span>${emails[i].timestamp}</span>
          </div>`
        }
        
    });
  }
}