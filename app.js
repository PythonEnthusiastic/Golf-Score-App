// Get the available golf courses from the gold API
// It returns a JSON file of the data
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
            <button type="button">New Game</button>
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