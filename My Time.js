setInterval(function(){ update() }, 50); //run constantly

function update(){
	var drakorTime = new Date( new Date().getTime() + -3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" ).split(" ")[4].split(":")[0] //get the server's time
	var now = new Date().toString().split(" ")[4].split(":")[0];//get the user's time

	var timeOffset = drakorTime - now //find the offset of the time

	var chat = document.getElementById("dr_chatBody").children //get all the chat objects

	if(chat != null){//make sure the chat exists in the screen
		for(var i = 0; i < chat.length; i++){//loop through the chat objects
			if(chat[i].className == "cmsg"){//if the object is a message

				var temp = chat[i].children[0].innerText//get the time of the message

				if(temp.indexOf("AM") == -1 && temp.indexOf("PM") == -1){//if the message has already been altered
					temp = temp.substring(1, temp.length -2).split(":")//split into array of H, M, S

					temp[0] = temp[0] - timeOffset;//subtract the server offset from local time

					if(temp[0] < 0){ //normalize for midnight
						temp[0] = 24 - temp[0]
					}
					else if(temp[0] > 23){ //normalize for midnight
						temp[0] = 24 - temp[0]
					}

					var AM;
					if(temp[0] < 12){ //check if its the morning
						AM = true;

						if(temp[0] == 0){ //if it is midnight
							temp[0] = 12
						}
					}
					else{//if its the night
						if(temp[0] != 12){//if its not noon
							temp[0] = temp[0] - 12
						}
						AM = false;
					}

					var time = "[" + temp[0] + ":" + temp[1] + ":" + temp[2] //re make the time stamp

					if(AM){//finish with am tag
						time = time + " AM]"
					}
					else{//finish with pm tag
						time = time + " PM]"
					}

					chat[i].children[0].innerText = time //set the new time into the chat box
				}
			}
		}
	}
}