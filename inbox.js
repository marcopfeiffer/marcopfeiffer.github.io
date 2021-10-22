document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // Add event listener to the form
  document.querySelector("#compose-form").addEventListener("submit", send_email);

  // By default, load the inbox
  load_mailbox('inbox');
  console.log("load inbox");
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  console.log("compose email");

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

	tbl = document.createElement('table');
	tbl.style.width = '100px';
  	tbl.style.border = '1px solid black';

	emails.forEach((mail) => {
		
		var sender = document.createElement("div");
		sender.innerHTML = mail["sender"];
		var subject = document.createElement("div");
		subject.innerHTML = mail["subject"];
		var body= document.createElement("div");
		body.innerHTML = mail["body"];

  		document.querySelector("#emails-view").appendChild(sender);
  		document.querySelector("#emails-view").appendChild(subject);
		document.querySelector("#emails-view").appendChild(body);
                document.querySelector("#emails-view").appendChild(document.createElement("hr"));

		var tbl_sender = document.createElement("div");
		tbl_sender.innerHTML = mail["sender"];
		var tbl_subject = document.createElement("div");
		tbl_subject.innerHTML = mail["subject"];
		var tbl_body = document.createElement("div");
		tbl_subject.innerHTML = mail["body"];
		
		const tr = tbl.insertRow();
		const td = tr.insertCell();
		td.appendChild(tbl_sender);
		const td2 = tr.insertCell();
		td2.appendChild(tbl_subject);
		const td3 = tr.insertCell();
		td3.appendChild(tbl_body);

		var link = document.createElement("a");
		link.className = "list-group-item list-group-item-action";
		link.setAttribute("href","");

		var div = document.createElement("div");
		div.className = "d-flex w-100 justify-content-between";

		link.appendChild(div);

		var heading = document.createElement("h5");
		heading.className = "mb-1";
		heading.innerHTML = "hallo welt";
		
		div.appendChild(heading);

		document.querySelector("#eview").appendChild(link);
	});

	document.querySelector("#emails-view").appendChild(tbl);

      // ... do something else with emails ...
});

}

function send_email(event) {

  event.preventDefault();

  console.log("send email");
  const mail_to = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  console.log(mail_to);

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: mail_to,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
});

}