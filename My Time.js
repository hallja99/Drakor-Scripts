// ==UserScript==
// @name         My Time
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Changes all the chat and skilling times to local AM/PM times
// @author       Oveduumnakal
// @match        http://*.drakor.com*
// @match        https://*.drakor.com*
// ==/UserScript==

setInterval(function() {
    update();
}, 50); //run constantly

function update() {

    //====================================================================================================================
    // Time Calculations

    var drakorTime = new Date(new Date().getTime() + -3 * 3600 * 1000).toUTCString().replace(/ GMT$/, "").split(" ")[4].split(":")[0]; //get the server's time
    var now = new Date().toString().split(" ")[4].split(":")[0]; //get the user's time
    var timeOffset = drakorTime - now; //find the offset of the time

    //====================================================================================================================
    //Chat Body

    var chat = null;
    try {
        chat = document.getElementById("dr_chatBody").children; //get all the chat objects
    } catch (err) {
        chat = null; //chat isnt there
    }


    if (chat != null) { //make sure the chat exists in the screen
        for (var i = 0; i < chat.length; i++) { //loop through the chat objects
            if (chat[i].className == "cmsg" || (chat[i].className == "cmsg areaName" && chat[i].children[1].innerText == "Check Mail Now!")) { //if the object is a message
                var temp = chat[i].children[0].innerText; //get the time of the message
                chat[i].children[0].innerText = toAMPM(temp, timeOffset); //set the new time into the chat box
            }
        }
    }

    //====================================================================================================================
    //Collection/Pattern

    var skill = null;
    try {
        skill = document.getElementById("skillResults").children; //get all the skilling objects
    } catch (err) {
        skill = null; //not working on a collection or pattern skill
    }

    if (skill != null) { //make sure the skill results window exists in the screen
        for (var i = 0; i < skill.length; i++) { //loop through the skill objects
            if (skill[i].className == "roundResult areaName") { //if the object is a skill result
                var temp = skill[i].children[0].innerText; //get the time of the result

                if (temp.indexOf("You didn't find anything") != -1) { //handle the "You didnt find anything" case
                    temp = temp.substring(temp.indexOf("["), temp.indexOf("]") + 1);
                    skill[i].children[0].innerText = toAMPM(temp, timeOffset) + " You didn't find anything"; //set the new time into the skill box
                } else { //nothing special to handle
                    skill[i].children[0].innerText = toAMPM(temp, timeOffset); //set the new time into the chat box
                }

            }
        }
    }
}

function toAMPM(time, timeOffset) {
    var temp = time; //to make life easier with the modularization
    if (temp.indexOf("AM") == -1 && temp.indexOf("PM") == -1) { //if the message has already been altered
        temp = temp.substring(1, temp.length - 1).split(":"); //split into array of H, M, S

        temp[0] = temp[0] - timeOffset; //subtract the server offset from local time

        if (temp[0] < 0) { //normalize for midnight
            temp[0] = 24 - temp[0];
        } else if (temp[0] > 23) { //normalize for midnight
            temp[0] = 24 - temp[0];
        }

        var AM;
        if (temp[0] < 12) { //check if its the morning
            AM = true;

            if (temp[0] == 0) { //if it is midnight
                temp[0] = 12;
            }
        } else { //if its the night
            if (temp[0] != 12) { //if its not noon
                temp[0] = temp[0] - 12;
            }
            AM = false;
        }

        var time = "[" + temp[0] + ":" + temp[1] + ":" + temp[2]; //re make the time stamp

        if (AM) { //finish with am tag
            time = time + " AM]";
        } else { //finish with pm tag
            time = time + " PM]";
        }

        return time;
    } else {
        return temp;
    }
}