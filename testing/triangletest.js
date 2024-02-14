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


function createTriangle(unclickedColor, clickedColor) {
    let triangle = document.createElement('span');
    triangle.name = "triangle";
    triangle.innerHTML = " ▶";
    triangle.style.color = unclickedColor;
    triangle.style.cursor = "pointer";
    triangle.addEventListener('click', function() {
        if (triangle.innerHTML === " ▶") {
            triangle.innerHTML = " ▼";
            triangle.style.color = clickedColor;
        } else {
            triangle.innerHTML = " ▶";
            triangle.style.color = unclickedColor;
        }
    });
    return triangle;
}

function addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak=true) {
    let triangle = createTriangle(unclickedColor, clickedColor);
    parentContainer.appendChild(triangle);
    if (addBreak) {
        let breakSpan = document.createElement('br');
        parentContainer.appendChild(breakSpan);
    }
    return triangle;
}

function addChildWithTriangle(parentContainer, childContainer, unclickedColor, clickedColor, addBreak=true) {
    let parentTriangle = addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak);
    parentContainer.appendChild(childContainer);
    parentTriangle.addEventListener('click', function() {
        childContainer.hidden = !childContainer.hidden;
    });
    childContainer.hidden = true;
}

function addChildrenWithTriangle(parentContainer, childrenContainers, unclickedColor, clickedColor, addBreak=true) {
    let parentTriangle = addTriangleToParent(parentContainer, unclickedColor, clickedColor, addBreak);
    childrenContainers.forEach(function(childContainer) {
        parentContainer.appendChild(childContainer);
        childContainer.hidden = true;
    });

    parentTriangle.addEventListener('click', function() {
        childrenContainers.forEach(function(childContainer) {
            childContainer.hidden = !childContainer.hidden;
        });
    });
}







document.getElementById('submit').addEventListener('click', function() {
    let testDiv = document.getElementById('test-div');
    let childDiv = document.createElement('div');

    childDiv.innerHTML = "This is the child div";

    addChildWithTriangle(testDiv, childDiv, "black", "blue");

});
