// ==UserScript==
// @name         RingDataCollection
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Collects data on all rings that are made
// @author       Oveduumnakal
// @match        http://*.drakor.com*
// @match        https://*.drakor.com*
// ==/UserScript==

var button = document.createElement("RingButton");
button.innerHTML = "⛣";
button.classList.add('gs_topmenu_item');
document.getElementById("gs_topmenu").appendChild(button);

button.addEventListener("click", function() {
   download()
})

currentRes = 0;
loop = setInterval(function () {
	var skillUsed = document.getElementsByClassName("skillTitle")[0]
	var thingMaking = document.getElementById("skill-combining")
	if(skillUsed != undefined && skillUsed.innerText.indexOf("Jewelcrafting") != -1){
		thingMaking	= thingMaking.innerText
		thingMaking = thingMaking.substring(thingMaking.indexOf("[") +1,thingMaking.indexOf("]")).split(" ")[1]
		if(thingMaking != undefined	&& thingMaking.indexOf("Ring") == 0){
			go()
		}
	}
}, 1000)

function go() {
	var results

	try {
		results = document.getElementById("skillResults").getElementsByClassName("roundResult areaName")
	} catch (e) {
		results = undefined
	}

	if (results != undefined && results.length > 0) {
		results = toArray(results)

		if (results.length > 0) {
			var newCards = checkResultsForNew(results);

			if (newCards.length > 0 && newCards != undefined) {
				var rings = getNewRingInfo(newCards)
			}
		}
	} else {
		currentRes = 0;
	}
}

function toArray(collection) {
	var arr = []
	for (var i = 0; i < collection.length; i++) {
		if (collection[i].innerText != "Your combines are complete.") {
			arr.push(collection[i])
		}
	}
	return arr;
}

function checkResultsForNew(results) {
	//get ids and populate cardFulls
	var cardIds = []
	if (results.length > currentRes) {
		for (var i = 0; i < (results.length - currentRes); i++) {
			if (results[i].innerText != "Your combines are complete.") {
				var children = results[i].getElementsByTagName("div")
				for (var j = 0; j < children.length; j++) {
					children[j].click()
					cardIds.push("card" + children[j].id.split("name")[1])
					children[j].click()
				}
			}
		}
		currentRes = results.length
		return cardIds
	}
	return []
}

function getNewRingInfo(newCards) {
	var rings = [] //parse full details
	setTimeout(function () {
		for (var i = 0; i < newCards.length; i++) {
			var chance, ability, skill, level, rarity, value
			var ring = document.getElementById(newCards[i])

			chance = ring.getElementsByClassName("cardDetail")[0].children[0].innerText
			ability = ring.getElementsByClassName("cardDetail")[0].children[1].innerText
			skill = ring.getElementsByClassName("cardDetail")[0].children[2].innerText
			level = ring.getElementsByClassName("cLevel")[0].innerText
			rarity = ring.getElementsByClassName("cardQuality")[0].innerText

			var val = ring.getElementsByClassName("cardValue")[0].innerText
			value = val.substring(val.indexOf(":") + 2, val.lastIndexOf(" "))
			value = parseInt(value.replace(",",""))
			
			var obj = {
				Percent: chance,
				Ablility: ability,
				Tradeskill: skill,
				RingLevel: level,
				Rarity: rarity,
				Gold: value
			}
			rings.push(obj)
			console.log("New Ring: " + JSON.stringify(obj))
		}

		saveData(rings)
	}, 500)
}

function saveData(ringsData) {
	if (localStorage.rings == undefined) {
		localStorage.rings = JSON.stringify([])
	}

	var data = JSON.parse(localStorage.rings)

	for (var i = 0; i < ringsData.length; i++) {
		data.push(ringsData[i])
	}

	if (data[0] == "") {
		data.splice(0, 1)
	}


	localStorage.rings = JSON.stringify(data)

	if(localStorage.rings.length > 5142878){
		alert("WARING DATA STORAGE REACHING MAX FOR RINGS.\nPlease contact Oveduumnakal immediately and stop making rings")
	}
}

function stop() {
	clearInterval(loop)
}

//=====================================================
function getMetrics(){
	//Get Tradeskill metrics
	console.log("======================Rarity Breakdown========================")
	// % leg, epic, rare, superior, common
	// % by ring range (copper, tin, iron, etc)
	console.log("======================Ability Breakdown=======================")
	// % DR/CR vs exp
	// Breakdown by ring range (copper, tin, iron, etc)
	console.log("======================Percentage Breakdown====================")
	// Average ability chance by rarity
	console.log("======================Trade Skill Breakdown===================")
	console.log("Tradeskill Drops (All)")
	tradeSkillDropChance()
	console.log("\nTradeskill Drops (Legendary)")
	tradeSkillDropChance("Legendary")
	console.log("\nTradeskill Drops (Epic)")
	tradeSkillDropChance("Epic")
	console.log("\nTradeskill Drops (Rare)")
	tradeSkillDropChance("Rare")
	console.log("\nTradeskill Drops (Superior)")
	tradeSkillDropChance("Superior")
	console.log("\nTradeskill Drops (Common)")
	tradeSkillDropChance("Common")
	console.log("======================Avg Gold Per Ring Per Level=============")
}

function tradeSkillDropChance(rarity){
var rings = JSON.parse(localStorage.rings)
	if(rarity != null && rarity != undefined){
		for(var i = 0; i < rings.length; i++){
           if(rings[i].Rarity != rarity){
             rings.splice(i,1)
			 i--
           }
        }
    }
    var skill = [], num = []
    console.log("Total Rings: " + rings.length)
    for(var i = 0; i < rings.length; i++){
    	if(skill.indexOf(rings[i].Tradeskill) == -1){
    		skill.push(rings[i].Tradeskill)
    		num.push(1)
    	}
    	else{
    		var index = skill.indexOf(rings[i].Tradeskill)
    		num[index] ++
    	}
    }

   var arr = []
   for(var i = 0; i < skill.length; i++){
   		arr.push([skill[i], num[i]])
   }

   arr = padTradeskills(arr)
   arr.sort(quanSort)

   for(var i = 0 ; i < arr.length; i++){
   	console.log("\t" + arr[i][0] + " (" + arr[i][1] + " Rings), Drop Chance = " + getPercent(arr[i][1], rings.length))
   }
}

//UTILITIES=========================================================================

function padTradeskills(arr){
	if(arr.length == 15){
		return arr
    }

	var allSkills = ["Alchemy",
	"Smithing",
	"Gathering",
	"Fishing",
	"Crafting",
	"Construction",
	"Jewelcrafting",
	"Treasure Hunting",
	"Mining",
	"Disenchanting",
	"Cooking",
	"Logging",
	"Inscription",
	"Enchanting",
	"Ancient Research"]

	for(var i = 0; i < arr.length; i++){
		var index = allSkills.indexOf(arr[i][0])
		allSkills.splice(index,1)
	}

	for(var i = 0; i < allSkills.length; i++){
		arr.push([allSkills[i], 0])
	}

	return arr
}

function getPercent(num, total){
	if(total == 0){
		return "0.000%"
	}
	else{
		var rough = (num / total) * 100
		return rough.toFixed(3) + "%"
	}
}

function download(){
	downloadFunct("RingData.txt", localStorage.rings)
}

function downloadFunct(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//SORTING FUNCTIONS=================================================================

function quanSort(a,b){
	if(a[1] < b[1]){
		return 1
	}
	else if(a[1] > b[1]){
		return -1
	}
	else{
		if(a[0] > b[0]){
			return 1
		}
		return -1
	}
}
