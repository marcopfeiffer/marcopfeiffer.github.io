document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', function() { load_mailbox('inbox') });
  document.querySelector('#sent').addEventListener('click', function() { load_mailbox('sent') });
  document.querySelector('#archived').addEventListener('click', function() { load_mailbox('archive') });
  document.querySelector('#compose').addEventListener('click', function() { compose_email() });
  // Add event listener to the form
  document.querySelector("#compose-form").addEventListener("submit", send_email);

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

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.querySelector('#eview').innerHTML = "";

  if(mailbox === 'inbox')
  {
     console.log('inbox');

     fetch('/emails/inbox')
    	.then(response => response.json())
    	.then(emails => {
        // Print emails
        console.log(emails);

	emails.forEach((mail) => {

		var link = document.createElement("a");
		link.className = "list-group-item list-group-item-action";
		link.setAttribute("href","");

		var div = document.createElement("div");
		div.className = "d-flex w-100 justify-content-between";

		link.appendChild(div);

		var heading = document.createElement("h5");
		heading.className = "mb-1";
		heading.innerHTML = "From: " + mail["sender"];
		
		div.appendChild(heading);

		var timestampText = document.createElement("small");
		timestampText.innerHTML = mail["timestamp"];

		div.appendChild(timestampText);

		var middleText = document.createElement("p");
		middleText.className = "mb-1";
		middleText.innerHTML = mail["subject"];

		link.appendChild(middleText);

		link.addEventListener("click", () => read_email(mail["id"]));


		if(mail["read"])
		{
			console.log("mail status: read");
			link.style.backgroundColor = "lightgrey";
		}
		else
		{
			console.log("mail status: not read");
		}

		document.querySelector("#emails-view").appendChild(link);
		
		});

	});

  }
  else if (mailbox === 'sent')
  {
     console.log('sent');

     fetch('/emails/sent')
    	.then(response => response.json())
    	.then(emails => {
        // Print emails
        console.log(emails);

	emails.forEach((mail) => {

		var link = document.createElement("a");
		link.className = "list-group-item list-group-item-action";
		link.setAttribute("href","");

		var div = document.createElement("div");
		div.className = "d-flex w-100 justify-content-between";

		link.appendChild(div);

		var heading = document.createElement("h5");
		heading.className = "mb-1";
		heading.innerHTML = "To: " + mail["recipients"];
		
		div.appendChild(heading);

		var timestampText = document.createElement("small");
		timestampText.innerHTML = mail["timestamp"];

		div.appendChild(timestampText);

		var middleText = document.createElement("p");
		middleText.className = "mb-1";
		middleText.innerHTML = mail["subject"];

		link.appendChild(middleText);

		link.addEventListener("click", () => read_email(mail["id"]));

		document.querySelector("#emails-view").appendChild(link);

		
		});

	});
  }
  else
  {
	console.log('archive');
  }

}

function read_email(id) {
	
	event.preventDefault();
	console.log("read email");

	console.log(`set mail: ${id} to status read`);

	fetch(`/emails/${id}`, {
  	method: 'PUT',
  	body: JSON.stringify({
      		read: true
  		})
	})

	fetch(`/emails/${id}`)
    	.then(response => response.json())
    	.then(mail_result => {


/*		
		var timestamp = document.createElement("strong");
		timestamp.innerHTML = "Timestamp:";
		eview.appendChild(br);
		eview.appendChild(timestamp);
		eview.innerHTML += " " + mail_result["timestamp"];

		var hr = document.createElement("hr");

		eview.appendChild(hr);

		eview.innerHTML += mail_result["body"];*/

		document.querySelector("#emails-view").innerHTML = `<strong>From: </strong>${mail_result["sender"]}`

		var br = document.createElement("br");
		document.querySelector("#emails-view").appendChild(br);

		var to = document.createElement("strong");
		to.innerHTML = "To:";		
		document.querySelector("#emails-view").appendChild(to);

		mail_result.recipients.forEach(element => document.querySelector("#emails-view").innerHTML += " " + element);

		document.querySelector("#emails-view").appendChild(br);

		var subject = document.createElement("strong");
		subject.innerHTML = "Subject:";
		document.querySelector("#emails-view").appendChild(br);
		document.querySelector("#emails-view").appendChild(subject);
		document.querySelector("#emails-view").innerHTML += " " + mail_result["subject"];

		document.querySelector("#emails-view").appendChild(br);


		var timestamp = document.createElement("strong");
		timestamp.innerHTML = "Timestamp:";
		document.querySelector("#emails-view").appendChild(timestamp);
		document.querySelector("#emails-view").innerHTML += " " + mail_result["timestamp"];

		var hr = document.createElement("hr");

		document.querySelector("#emails-view").appendChild(hr);

		document.querySelector("#emails-view").innerHTML += mail_result["body"];


		document.querySelector("#emails-view").appendChild(hr);

		var replyButton = document.createElement("button");
		replyButton.className = "btn btn-sm btn-outline-primary";
		replyButton.innerHTML = "Reply";
		replyButton.id = "btn_reply";
		replyButton.addEventListener('click', function() { reply_email(mail_result["sender"], mail_result["subject"]) });

		document.querySelector("#emails-view").appendChild(replyButton);

		
    	})
    	.catch(error => console.log(error));



}

function reply_email(sender, subject) {

	console.log("reply button pressed");
	compose_email();
	document.querySelector('#compose-recipients').value = sender;
	document.querySelector('#compose-subject').value = "RE: " + subject;
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