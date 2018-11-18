let date = new Date();
let tasks;
let titleEl = document.getElementById('title');
let textInputEl = document.getElementById('textInput');
let selectColorEl = document.getElementById('selectColor');
document.getElementById('todaysDate').innerHTML = formatDate(date);
document.getElementById('currentTime').innerHTML = formatTime(date);

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

function changeTitle() {
  titleEl.innerHTML = textInputEl.value;
}

function changeColor(event) {
  let color = selectColorEl.options[selectColorEl.selectedIndex].value;
  document.body.style.backgroundColor = color;
}

// Tuesday 12th June 2018
function formatDate(date) {
  // prettier-ignore
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var dayLetters = getDayLetters(date);
  let dayOrdinalIndicator = getDayOrdinalIndicator();
  let dateS = `${dayLetters} ${day}${dayOrdinalIndicator} ${monthNames[monthIndex]} ${year}`;
  return dateS;
}

// 10.30 AM
function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  if (minutes < 10) minutes = minutes + '0';
  var time = `${hours}.${minutes} ${ampm}`;
  return time;
}

function getDayOrdinalIndicator() {
  // prettier-ignore
  let lastDigitDate = parseInt(new Date().getDate().toString().split('').pop());
  switch (true) {
    case lastDigitDate === 0:
      return 'th';
      break;
    case lastDigitDate === 1:
      return 'st';
      break;
    case lastDigitDate === 2:
      return 'nd';
      break;
    case lastDigitDate === 3:
      return 'rd';
      break;
    case lastDigitDate > 3 && lastDigitDate < 10:
      return 'th';
      break;
  }
}

function getDayLetters(date) {
  switch (date.getDay()) {
    case 0:
      return 'Sunday';
      break;
    case 1:
      return 'Monday';
      break;
    case 2:
      return 'Tuesday';
      break;
    case 3:
      return 'Wednesday';
      break;
    case 4:
      return 'Thursday';
      break;
    case 5:
      return 'Friday';
      break;
    case 6:
      return 'Saturday';
  }
}

function getTasks(date) {
  let todaysTaskList = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].day === getDayLetters(date)) {
      todaysTaskList.push(tasks[i]);
    }
  }
  return todaysTaskList;
}

//scaffolding the UL elements
//duplicate code, further improvement needed
function setTaskList(date) {
  for (let index = 0; index < getTasks(date).length; index++) {
    let taskDay = getTasks(date)[index].day;
    let taskTime = getTasks(date)[index].time;
    let taskDescription = getTasks(date)[index].description;

    var node = document.createElement('LI');
    var textnode = document.createTextNode(`${taskDay} ${taskTime}: ${taskDescription}`);
    node.appendChild(textnode);
    document.getElementById('taskList').appendChild(node);
  }
}
function setTomorrowTaskList(tomorrow) {
  for (let index = 0; index < getTasks(tomorrow).length; index++) {
    let taskDay = getTasks(tomorrow)[index].day;
    let taskTime = getTasks(tomorrow)[index].time;
    let taskDescription = getTasks(tomorrow)[index].description;

    var node = document.createElement('LI');
    var textnode = document.createTextNode(`${taskDay} ${taskTime}: ${taskDescription}`);
    node.appendChild(textnode);
    document.getElementById('tomorrowTaskList').appendChild(node);
  }
}

// requesting tasks json data and scaffolding Ul element when request is successfull 
function handler() {
  if (this.status == 200) {
    tasks = JSON.parse(client.responseText);
    setTaskList(date);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTomorrowTaskList(tomorrow);
  } else {
    console.log('err');
  }
}

var client = new XMLHttpRequest();
client.onload = handler;
client.open('GET', 'https://cors-anywhere.herokuapp.com/http://gitlab.wd-agency.com/snippets/2/raw?inline=false');
client.setRequestHeader('Content-Type', 'application/json');
client.send();
