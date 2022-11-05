// Get the available golf courses from the gold API
// It returns a JSON file of the data
let playerNames = [];

async function getCourses() {
    let response = await fetch("https://golf-courses-api.herokuapp.com/courses/");
    let data = await response.json();

    data = data.courses;

    return data
}

async function getCourseFromId(id) {
    let response = await fetch(`https://golf-courses-api.herokuapp.com/courses/${id}`);
    let data = await response.json();

    return data.data.holes
}

async function createTeeBoxSelect(id) {
    let teeBoxSelectHtml = '';
    let courseInformation = await getCourseFromId(id);

    courseInformation[0].teeBoxes.forEach(function (teeBox, index) {
        teeBoxSelectHtml += `
            <option value="${teeBox.teeTypeId}">${teeBox.teeType.toUpperCase()}</option>
        `
    });

    document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}

// Make the table on click of the button 
async function createTable() {
    let courseID = document.getElementById("course-select")
    let courseInformation = await getCourseFromId(courseID.value);
    let teeInformation = document.querySelector("#tee-box-select");
    let [firstTable, secondTable] = document.getElementsByClassName("table");

    let tableStructure = `
        <thead>
            <tr>
                <th scope="col">Hole</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">Yardage</th>
            </tr>
            <tr>
                <th scope="row">Par</th>
            </tr>
            <tr>
                <th scope="row">Handicap</th>
            </tr>
        </tbody>
    `;

    firstTable.innerHTML = tableStructure;
    secondTable.innerHTML = tableStructure; 

    // Get the thead and tbody for the first table
    let firstTableBody = firstTable.children[1];
    let firstTableHeader = firstTable.children[0].children[0];

    // Get the thead and tbody for the second table
    let secondTableBody = secondTable.children[1];
    let secondTableHeader = secondTable.children[0].children[0];

    // Make into functions and pass the bodies
    let yardRow = (tableBody) => tableBody.children[0];
    let parRow = (tableBody) => tableBody.children[1];
    let handicapRow = (tableBody) => tableBody.children[2];
    
    // Total of the yard, par, and handicap row
    let totalYard = 0;
    let totalPar = 0;
    let totalHandicap = 0;

    // First card
    for (let i = 0; i < 9; i++) {
        firstTableHeader.innerHTML += `
            <th scope="col">${courseInformation[i].hole}</th>
        `;

        courseInformation[i].teeBoxes.forEach(tee => {
            if (tee.teeTypeId == teeInformation.value) {
                yardRow(firstTableBody).innerHTML += `
                    <td>${tee.yards}</td>
                `;

                parRow(firstTableBody).innerHTML += `
                    <td>${tee.par}</td>
                `;

                handicapRow(firstTableBody).innerHTML += `
                    <td>${tee.hcp}</td>
                `;

                totalYard += tee.yards;
                totalPar += tee.par;
                totalHandicap += tee.hcp;
            }
        })
    }

    // Add header for first table
    firstTableHeader.innerHTML += `
        <tr>
            <th scope="col">Out</th>
        </tr>
    `;

    // Add total for first table
    yardRow(firstTableBody).innerHTML += `
        <td>${totalYard}</td>
    `;
    parRow(firstTableBody).innerHTML += `
        <td>${totalPar}</td>
    `;
    handicapRow(firstTableBody).innerHTML += `
        <td>${totalHandicap}</td>
    `;

    // Reset back to zero to only add total for 9-18
    totalYard = 0;
    totalPar = 0;
    totalHandicap = 0;

    // Second card
    for (let i = 9; i < 18; i++) {
        secondTableHeader.innerHTML += `
            <th scope="col">${courseInformation[i].hole}</th>
        `;

        courseInformation[i].teeBoxes.forEach(tee => {
            if (tee.teeTypeId == teeInformation.value) {
                yardRow(secondTableBody).innerHTML += `
                    <td>${tee.yards}</td>
                `;

                parRow(secondTableBody).innerHTML += `
                    <td>${tee.par}</td>
                `;

                handicapRow(secondTableBody).innerHTML += `
                    <td>${tee.hcp}</td>
                `;

                totalYard += tee.yards;
                totalPar += tee.par;
                totalHandicap += tee.hcp;
            }
        })
    }

    // Add header for second table
    secondTableHeader.innerHTML += `
        <tr>
            <th scope="col">In</th>
        </tr>
    `;

    // Add total for second table body
    yardRow(secondTableBody).innerHTML += `
        <td>${totalYard}</td>
    `;
    parRow(secondTableBody).innerHTML += `
        <td>${totalPar}</td>
    `;
    handicapRow(secondTableBody).innerHTML += `
        <td>${totalHandicap}</td>
    `;
}

function addPlayer() {
    let name = document.getElementById("player-name");

    if (playerNames.includes(name.value)) {
        alert("Can't use the same name more than once!")
        return;
    } else if (playerNames.length > 3) {
        alert("There can only be 4 players!")
        return;
    }

    let [firstTable, secondTable] = document.getElementsByTagName("tbody")

    let playerNameRow = `
        <tr>
            <th>${name.value}</th>
        </tr>
    `;

    firstTable.innerHTML += playerNameRow;
    secondTable.innerHTML += playerNameRow;

    for (let i = 0; i < 10; i++) {
        firstTable.children[firstTable.children.length - 1].innerHTML += `
            <td>0</td>
        `;

        secondTable.children[secondTable.children.length - 1].innerHTML += `
            <td>0</td>
        `; 
    }

    playerNames.push(name.value)
}

window.onload = async() => {
    let golfCourses = await getCourses();
    let courseOptionalHtml = '';
    let addHtml = document.getElementById('options-container');
    
    addHtml.innerHTML += `
        <div class="form-group">
            <label for="course-select">Select Course</label>
            <select class="form-control" id="course-select"></select>
            <label for="tee-box-select">Select Difficulty</label>
            <select class="form-control" id="tee-box-select"></select>
            <button type="button" onclick="createTable()">New Game</button>
            <div class"add-player">
                <input id="player-name" type="text" placeholder="Enter Name">
                <button type="button" onclick="addPlayer()">Add Player</button>
            </div>
        </div>
    `;

    let selectBox = document.getElementById("course-select");

    golfCourses.forEach((course) => {
            courseOptionalHtml += `<option value="${course.id}">${course.name}</option>`;
        }
    );

    selectBox.innerHTML = courseOptionalHtml;

    // Load the info

    selectBox.addEventListener("change", () => { createTeeBoxSelect(selectBox.value) } );
}