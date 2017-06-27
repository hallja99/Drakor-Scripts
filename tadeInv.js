setInterval(
    function() {
        $.ajax({
            url: 'https://drakor.com/masteries/inventory',
            success: function(data) {
                index = data.indexOf("<div id=\"bv_sitewrapper\" class=\"container-fluid\">")
                end = data.indexOf("</div></body>", index)
                inv = data.substring(index, end)

                inv = inv.substring(inv.indexOf("<h2>"), inv.length)

                if (document.getElementById("dynamicInv") == null) {
                    parent = document.getElementById("bv_mainbody")
                    inventory = document.createElement("div")
                    inventory.id = "dynamicInv"
                    inventory.className = "col-sm-3 worldBox dContainer container-fluid"
                    inventory.innerHTML = inv
                    parent.insertBefore(inventory, document.getElementsByClassName("dContainer chatBox")[0].nextSibling)
                } else {
                    document.getElementById("dynamicInv").innerHTML = inv
                }
            }
        });
    }, 30000)