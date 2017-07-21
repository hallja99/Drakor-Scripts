// ==UserScript==
// @name         Console Inventory
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Prints user's tradeskill inventory to the console
// @author       Oveduumnakal
// @match        http://*.drakor.com*
// @match        https://*.drakor.com*
// ==/UserScript==


function getInv() {
    console.clear();
    $.ajax({
        url: 'https://drakor.com/masteries/inventory',
        success: function(data) {
            var el = document.createElement('html');
            el.innerHTML = data;
            var mats = el.getElementsByClassName("tradeMat");

            var arr = [];

            for (var i = 0; i < mats.length; i++) {
                var mat = mats[i].innerHTML;
                var clss = mats[i].className.split(" ")[1];
                var vals = mat.split(">");

                if (vals.length < 4) {
                    arr.push(patternObj(vals, clss));
                } else {
                    arr.push(gatherObj(vals, clss));
                }

                arr.push();
            }


            print("%cYour TradeSkills Inventory", "color:#F1C40F;");
            print("%c==========================", "color:#F1C40F;");

            var curType = "";
            for (var i = 0; i < arr.length; i++) {
                var value = arr[i];

                if (value.type != curType) {
                    console.log("");
                    print("%c" + value.type, "color:#fffc75");

                    str = "";
                    for (var j = 0; j < value.type.length; j++) {
                        str += "-";
                    }

                    print("%c" + str, "color:#fffc75");

                    curType = value.type;
                }

                var color;

                switch (value.rarity) {
                    case "Common":
                        color = "color:#85929E;"
                        break;
                    case "Superior":
                        color = "color:#229954;"
                        break;
                    case "Rare":
                        color = "color:#3498DB;"
                        break;
                    case "Epic":
                        color = "color:#ca5df7;"
                        break;
                    case "Legendary":
                        color = "color:#D35400;"
                        break;
                }


                if (value.mastery == null) {
                    str = value.name + ": " + value.quanity;
                } else {
                    str = value.name + " [" + value.mastery + "]: " + value.quanity;
                }


                print("%c" + str, color);
            }
        }
    });
}

function patternObj(vals, clss) {
    var rarity = vals[0].substring(vals[0].indexOf("=") + 2, vals[0].length - 1);

    var name = vals[1].substring(1, vals[1].indexOf("]"));
    
    var number = vals[2].substring(2, vals[2].length);

    var rank = null;

    var type = clss;

    var obj = {
        rarity: rarity,
        name: name,
        quanity: number,
        mastery: rank,
        type: type
    };

    return obj;
}

function gatherObj(vals, clss) {
    var rarity = vals[0].substring(vals[0].indexOf("=") + 2, vals[0].length - 1);

    var name = vals[1].substring(1, vals[1].indexOf("]"));

    var number = vals[2].substring(2, vals[2].indexOf("<"));

    var rank = vals[3].substring(0, 1);

    var type = clss;

    var obj = {
        rarity: rarity,
        name: name,
        quanity: number,
        mastery: rank,
        type: type
    };

    return obj;
}

function print(str, color) {
    console.log(str, color);
}


getInv();
var loop = setInterval(function() {
    getInv();
}, 30000);