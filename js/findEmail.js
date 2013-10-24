chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("Message recieved in content script");
  	console.log(request)
  	console.log("Sending email:");
    sendEmail();
  });

console.log("Your content script is running! Catch it!");
getEmailsOnPage();

function getEmailsOnPage() {
	return ["bart@fullcontact.com"];
}

function sendEmail() {
	chrome.runtime.sendMessage(
		{
			email: getEmailsOnPage()[0]
		}, 
		function(response) {
	
		}
	);
}
