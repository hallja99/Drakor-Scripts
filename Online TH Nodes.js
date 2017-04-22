var button = document.createElement("button")
button.innerHTML = "Find TH Nodes"
button.class = "gs_topmenu_item"
document.getElementById("gs_topmenu").appendChild(button)

button.addEventListener("click", function(){
	document.getElementById("s_online").click()
	var thNodes = []

	setTimeout(function(){
		function getTH(list){
			for(var i = 0; i < list.length; i++){
				var tmp = list[i].children[2].innerText
				if(tmp.toLowerCase().indexOf("treasure") != -1){
					thNodes.push(tmp.split("@")[1].trim())
				}
			}
		}

		var online = document.getElementById("s_online_details").children[1]

		document.getElementById("s_online").click()
		
		var x = online.children[1].children
		var y = online.children[3].children
		var z = online.children[5].children

		getTH(x)
		getTH(y)
		getTH(z)

		for(var i = 0; i < thNodes.length; i++){
			for(var j = i + 1; j <thNodes.length; j++){
				if( j < thNodes.length + 1 && thNodes[i] == thNodes[j]){
					thNodes.splice(j, 1)
					j--
				}
			}
		}

		for(var i = 0; i < thNodes.length; i++){
			console.log("TH Node at: " + thNodes[i])
		}
	},1000)
})