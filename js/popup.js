var API_KEY = ''; // YOUR FULLCONTACTAPI KEY

// Listen for a message w/email from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("Message recieved");
  	console.log(request)
  	console.log("Enriching email:");
    enrichEmail(request.email);
  });

var succesOpts = {
	type: 'basic',
	title: 'Check it out!',
	message: "We found some peeps on this page",
	iconUrl: '../images/icon.png'
};

var failOpts = {
	type: 'basic',
	title: 'Woops',
	message: "Sorry about that",
	iconUrl: '../images/icon.png'
};

var imgOpts = {
	type: 'image',
	title: "Image like!",
	message: "This is an image",
	iconUrl: '../images/icon.png',
	imageUrl: '../images/cats.jpg'
};

var listOpts = {
	type: 'basic',
	title: "Actions!",
	message: "What would you like to do with your contact?",
	iconUrl: '../images/icon.png',
	buttons: [
		{ 
			title: 'Add to contacts', 
          	iconUrl: '../images/icon.png'
      	},
        { 
        	title: 'Send Email', 
            iconUrl: '../images/icon.png'
        }
    ]
};

var notifications = ['api-success','api-error','image','list'];

function enrichEmail(email) {
	console.log("Enrich email " + email);
	$.ajax({
		url: 'https://api.fullcontact.com/v2/person.html',
		data: {
			apiKey: API_KEY,
			email: email
		},
		cache: false
	}).done(function(response) {
  		$('#contact').html(response);
  		chrome.notifications.create(notifications[0], succesOpts, function() {
			console.log("Successful person request");
		});
	}).fail(function() {
		chrome.notifications.create(notifications[1], failOpts, function() {
			console.log("Failed person request");
		});
	}).always(function() {
		chrome.notifications.create(notifications[2], imgOpts, function() {
		});
		chrome.notifications.create(notifications[3], listOpts, function() {
		});
	});
}

// Every time you click the popup it will ask the active page for the first email it finds
// and hit the person api for it, then populate the popup with the result
$(document).click(function() {
	doEnrich();
});

// Ask the active tab for an email
function doEnrich() {
	console.log("Sending Message");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {action: "get-emails"}, function(response) {
	    	console.log(response);
	  });
	});
}

// Add "You Clicked Me" to the popup and
// clear notifications if any of them are clicked
// For demo purposes
chrome.notifications.onClicked.addListener(function(id) {
	$('#message').html("You clicked me!");
	$.each(notifications, function(index, name) {
		chrome.notifications.clear(name,function(){});
	});
});