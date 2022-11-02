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
    let informationTable = document.querySelector(".table");

    informationTable.innerHTML = `
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

    let tableBody = document.querySelector("tbody");

    let tHeader = informationTable.children[0].children[0];

    let yardRow = tableBody.children[0];
    let parRow = tableBody.children[1];
    let HandicapRow = tableBody.children[2];

    courseInformation.forEach(val => {

        tHeader.innerHTML += `
            <th scope="col">${val.hole}</th>
        `;

        val.teeBoxes.forEach(tee => {
            if (tee.teeTypeId == teeInformation.value) {
                yardRow.innerHTML += `
                    <td>${tee.yards}</td>
                `;

                parRow.innerHTML += `
                    <td>${tee.par}</td>
                `;

                HandicapRow.innerHTML += `
                    <td>${tee.hcp}</td>
                `;
            }
        })
    });
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

    let tableBody = document.querySelector("tbody");

    tableBody.innerHTML += `
        <tr>
            <th>${name.value}</th>
        </tr>
    `;

    console.log(tableBody.children)

    for (let i = 0; i < 18; i++) {
        tableBody.children[tableBody.children.length - 1].innerHTML += `
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