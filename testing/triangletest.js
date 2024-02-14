//Beauty in simplicity. No 'add followingDiv' needed.
function addClickableTriangle(unclickedColor, clickedColor, childContainer) {  
    let clickableTriangle = document.createElement('span')
    clickableTriangle.style.cursor = "pointer";
    clickableTriangle.innerHTML = " ▶";
    clickableTriangle.style.color = unclickedColor;
    clickableTriangle.addEventListener('click', function() {
        if (clickableTriangle.innerHTML === " ▶") {
            clickableTriangle.innerHTML = " ▼";
            clickableTriangle.style.color = clickedColor;
        } else {
            clickableTriangle.innerHTML = " ▶";
            clickableTriangle.style.color = unclickedColor;
        }
        childContainer.hidden = !childContainer.hidden;
    });
    return clickableTriangle;
}

function joinContainers(parentContainer, childContainer, unclickedColor, clickedColor, useTriangle, alwaysCreateBreak=true) {
    if (useTriangle) {
        childContainer.hidden = true;
        let myTriangle = addClickableTriangle(unclickedColor, clickedColor, childContainer);
        parentContainer.appendChild(myTriangle);
    } 
    if (alwaysCreateBreak || useTriangle) {
        let breakSpan = document.createElement('br');
        parentContainer.appendChild(breakSpan);
    }
    parentContainer.appendChild(childContainer);
}


document.getElementById('submit').addEventListener('click', function() {
    let testDiv = document.getElementById('test-div');
    let topDivNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let tier2Names= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let tier3Names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let tier4Names = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    let tier4Divs = [];
    for (let i = 0; i < tier4Names.length; i++) {
        let randomNum = Math.floor(Math.random() * 100);
        let tier4Div = document.createElement('div');
        tier4Div.innerHTML = tier3Names[i];

        let tier5Container = document.createElement('div');
        for (let j = 0; j < randomNum; j++) {
            let tier5Span = document.createElement('span');
            tier5Span.innerHTML = j.toString();
            tier5Span.style.color = "red";
            
            joinContainers(tier5Container, tier5Span, "gray", "#00FF50", randomNum > 20, false);
        }
        joinContainers(tier4Div, tier5Container, "gray", "blue", randomNum > 20, false);
        
        joinContainers(testDiv, tier4Div, "gray", "red", true, true);
        
    }

});
