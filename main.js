

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

const getCoursePage = (course) => {
    return fetch(`https://www.fit.vut.cz/study/course/${course}/.cs`)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc;
        })
}

const getLectureTitles = (course) => {
    return getCoursePage(course)
        .then(page => {
            const planList = page.querySelectorAll('.b-detail__content ol li')
            let lectureTitles = []
            planList.forEach(planElement => {
                lectureTitles.push(planElement.innerText);
            })
            return lectureTitles;
        })
}

const getDateFromLectureString = (str) => {
    const regex = /,\s([0-9]+).\s([0-9]+).\s([0-9]+)/mg;
    let m;
    let result = [];

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            result.push(match);
        });
    }

    return result.slice(1, 4);
}

const insertLectureNumbering = async (course) => {

    const lectureTitles = await getLectureTitles(course);

    const lectureList = document.querySelector("ul");
    const lectures = lectureList.children;

    let prevWeek = -1;
    let firstSchoolWeek = -1;

    Array.from(lectures).forEach(lecture => {
        const lectureText = lecture.innerText;
        const splitDate = getDateFromLectureString(lectureText);

        // (Y, M - 1, D) - JS counts months from 0
        const date = new Date(splitDate[2], splitDate[1] - 1, splitDate[0])
        const week = date.getWeek();

        if (firstSchoolWeek === -1) {
            firstSchoolWeek = week
        };

        const schoolWeek = week - firstSchoolWeek + 1;

        if (prevWeek !== week) {
            let titleElement = document.createElement("h2")

            titleElement.innerHTML = "Week " + schoolWeek + ((lectureTitles.length) ? " - " + lectureTitles[schoolWeek - 1] : "");

            lecture.parentElement.insertBefore(titleElement, lecture);
            prevWeek = week;
        }
    });
}



const pageNavigation = document.querySelectorAll('tbody tr:nth-child(3) td:nth-child(2) > a')
const pageNavigationLevel = pageNavigation.length


if (pageNavigationLevel == 3) {
    const courseName = document.querySelector('tbody tr:nth-child(3) td:nth-child(2) > b').innerText
    const courseID = courseName.substring(0, courseName.indexOf(' '));

    console.log(courseID);
    insertLectureNumbering(courseID);
}

