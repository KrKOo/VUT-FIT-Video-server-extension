import requests
from bs4 import BeautifulSoup


def getAllCourseIDs():
    URL = "https://www.fit.vut.cz/study/courses/.cs"

    page = requests.get(URL)
    soup = BeautifulSoup(page.content, "html.parser")
    courseTDs = soup.select("table#list tbody tr td:nth-child(2)")
    courseIDs = [element.text for element in courseTDs]

    return courseIDs


def getLectureTitles(courseID):
    URL = "https://www.fit.vut.cz/study/course/{}/.cs".format(courseID)

    courseIDs = getAllCourseIDs()

    if courseID not in courseIDs:
        return

    page = requests.get(URL)
    soup = BeautifulSoup(page.content, "html.parser")
    labelArray = soup.select('p:-soup-contains("Osnova přednášek")')

    if not labelArray:
        return []

    label = labelArray[0]
    titleListContainer = label.findNext("div")
    titlesListItems = titleListContainer.findAll("li")
    titles = [element.text for element in titlesListItems]

    return titles
