"use strict";

// Show loader
function showLoader() {
  document.getElementById('loader').classList.remove('loader--hide');
}

// Hide the loader
function hideLoader() {
  document.getElementById('loader').classList.add('loader--hide');
}

//! Time / Date

// Get the time element
const timeSave = document.querySelector('.main__block__time');
//Get date element
const timeBlocks = document.querySelectorAll('.main__block__date');
//Get date elements of the following days 1-3
const dateTwo = document.querySelector('.date2');
const dateThree = document.querySelector('.date3');
const dateFour = document.querySelector('.date4');


function updateTime(){
    //Function to get time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    //Add time to the page
    timeSave.textContent = `${hours}:${minutes}`;

    //Function to get the date
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); 
    const year = now.getFullYear();

    //Add the date to the page
    const temp = `${day}.${month}.${year}`;
    timeBlocks.forEach(el => {
    el.textContent = temp;
    });

    //Functions for the following days 1-3
    const day2 = new Date(now);
    day2.setDate(day2.getDate() + 1);
    const temp2 = `${day2.getDate().toString().padStart(2, "0")}.${(day2.getMonth() + 1).toString().padStart(2, "0")}.${day2.getFullYear()}`;
    dateTwo.textContent = temp2;

    const day3 = new Date(now);
    day3.setDate(day3.getDate() + 2);
    const temp3 = `${day3.getDate().toString().padStart(2, "0")}.${(day3.getMonth() + 1).toString().padStart(2, "0")}.${day3.getFullYear()}`;
    dateThree.textContent = temp3;

    const day4 = new Date(now);
    day4.setDate(day4.getDate() + 3);
    const temp4 = `${day4.getDate().toString().padStart(2, "0")}.${(day4.getMonth() + 1).toString().padStart(2, "0")}.${day4.getFullYear()}`;
    dateFour.textContent = temp4;


}
setInterval(updateTime, 1000); // Update the time

//! GEO

const key = '9e5d5f3218d44d3db8dfeba6ca6f79df'; // API GEO

//Recognize the city where the user is located
function getCityByCoords(lat, lon) {
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${key}`)
    .then(res => res.json())
    .then(data => {
      const result = data.results?.[0]; // safely retrieve the first result

      if (!result || !result.components) {
        throw new Error("Couldn't find any information about the city");
      }

      const components = result.components;
      const city =
        components.city ||
        components.town ||
        components.village ||
        components.county ||
        "City not defined";

      console.log("City:", city);
      geoCity.textContent = city;
    })
    .catch(err => {
      console.log("City definition error:", err);
      alert("Couldn't identify your city.");
      geoCity.textContent = "City not defined";
    });
}

//Declare user coordinate variables
let userLatitude;
let userLongitude;


// Recognize the user's position
navigator.geolocation.getCurrentPosition(
  (position) => {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    fetchWeather(userLatitude, userLongitude);
    getCityByCoords(userLatitude, userLongitude);
  },
  (error) => {
    console.log("Failed to get geolocation:", error.message);
    fetchWeather(53.7799, 20.4942);
  }
);


//! API

// Get the Temperature elements for all days
const weatherMain = document.querySelector('.main__block__cel');
const weatherTwo =  document.querySelector('.weath2');
const weatherThree = document.querySelector('.weath3');
const weatherFour = document.querySelector('.weath4');

//Connect temperature element min max - main
const temperatureMainmax = document.querySelector('.main__block__cel__max');
const temperatureMainmin = document.querySelector('.main__block__cel_min');

//Connect temperature element min max
const temperatureMax1 = document.querySelector('.max1');
const temperatureMin1 = document.querySelector('.min1');

const temperatureMax2 = document.querySelector('.max2');
const temperatureMin2 = document.querySelector('.min2');

const temperatureMax3 = document.querySelector('.max3');
const temperatureMin3 = document.querySelector('.min3');

//Connect wind speed km/h main
const windMain = document.querySelector('.main__block__wind');

//Connect wind speed km/h wind1/2/3
const windOne = document.querySelector('.wind1');
const windTwo = document.querySelector('.wind2');
const windThree = document.querySelector('.wind3');

//Connect element by geoposition
const geoCity = document.querySelector('.main__block__city');

//Main weather function
async function fetchWeather(lat, lon) {
  showLoader(); // show loader
  
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,sunrise,sunset&hourly=temperature_2m,precipitation&current=temperature_2m,wind_speed_10m,precipitation,rain,showers,snowfall&timezone=Europe%2FBerlin`);
    const data = await response.json();

    //Check if data and required properties exist
    if (
      !data ||
      !data.current ||
      !data.daily ||
      !data.daily.temperature_2m_max ||
      !data.daily.temperature_2m_min ||
      !data.daily.wind_speed_10m_max
    ) {
      throw new Error("Incorrect data from weather API");
    }

    // Insert data into elements
    weatherMain.textContent = `${Math.floor(data.current.temperature_2m)} °C`;
    weatherTwo.textContent = `${Math.floor(data.daily.temperature_2m_max[1])} °C`;
    weatherThree.textContent = `${Math.floor(data.daily.temperature_2m_max[2])} °C`;
    weatherFour.textContent = `${Math.floor(data.daily.temperature_2m_max[3])} °C`;

    temperatureMainmax.textContent = `${Math.floor(data.daily.temperature_2m_max[0])} °C`;
    temperatureMainmin.textContent = `${Math.floor(data.daily.temperature_2m_min[0])} °C`;

    temperatureMax1.textContent = `${Math.floor(data.daily.temperature_2m_max[1])} °C`;
    temperatureMin1.textContent = `${Math.floor(data.daily.temperature_2m_min[1])} °C`;

    temperatureMax2.textContent = `${Math.floor(data.daily.temperature_2m_max[2])} °C`;
    temperatureMin2.textContent = `${Math.floor(data.daily.temperature_2m_min[2])} °C`;

    temperatureMax3.textContent = `${Math.floor(data.daily.temperature_2m_max[3])} °C`;
    temperatureMin3.textContent = `${Math.floor(data.daily.temperature_2m_min[3])} °C`;

    windMain.textContent = `Wind: ${Math.floor(data.current.wind_speed_10m)} km/h`;

    windOne.textContent = `Wind: ${Math.floor(data.daily.wind_speed_10m_max[1])} km/h`;
    windTwo.textContent = `Wind: ${Math.floor(data.daily.wind_speed_10m_max[2])} km/h`;
    windThree.textContent = `Wind: ${Math.floor(data.daily.wind_speed_10m_max[3])} km/h`;

  } catch (err) {
    console.log("Something went wrong...", err);
    alert("Something went wrong...");

    weatherMain.textContent = "—";
    weatherTwo.textContent = "—";
    weatherThree.textContent = "—";
    weatherFour.textContent = "—";

    temperatureMainmax.textContent = "—";
    temperatureMainmin.textContent = "—";

    temperatureMax1.textContent = "—";
    temperatureMin1.textContent = "—";

    temperatureMax2.textContent = "—";
    temperatureMin2.textContent = "—";

    temperatureMax3.textContent = "—";
    temperatureMin3.textContent = "—";

    windMain.textContent = "—";
    windOne.textContent = "—";
    windTwo.textContent = "—";
    windThree.textContent = "—";
  } finally {
    hideLoader(); // hide the loader after completion
  }
}