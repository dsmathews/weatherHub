$(document).ready(function () {
    // Setting variable for jQuery DOM elements
    let zipCode = $("#zipInput");
    let header = $("#weatherZip");
    let weatherData = $('#weatherData');
    let tempSpot = $('#tempSpot');
    let icoSpot = $('#icoSpot');
    let latData = $('#latData');
    let longData = $('#longData');
    let weatherMap = $('#mapid');
    let humidity = $("#humidity")
    let weatherDesc = $('#weatherDesc')
    let underPressure = $('#underPressure')
    let windDirection = $("#windDirection")
    let windSpeed = $("#windSpeed");
    let windGust = $("#windGust")
    let sunRise = $("#sunRise");
    let sunSet = $("#sunSet")
    let forecastTable = $("#forecastTable")
    // Setting variables needed for functions 
    let lat = '';
    let long = '';
    let zips = '';
    const apiKey = "getanAPIkeyfromopenweather.org";
    // Hide the weather icon space to avoid showing broken link
    icoSpot.hide()
    //  Update the value of the input field and bind it to zips variable
    function updateVal() {
        zips = $(this).val()
        console.log(zips)
    }

    function getCurrentData() {
        // Clear previous values and reset
        event.preventDefault();
        header.empty();
        tempSpot.empty();
        icoSpot.empty();
        icoSpot.hide();
        latData.empty();
        longData.empty();
        windSpeed.empty();
        windDirection.empty();
        weatherDesc.empty();
        humidity.empty();
        underPressure.empty();
        sunRise.empty();
        sunSet.empty();
        // Confirm zips value from updateVal function
        console.log(zips);
        // AJAX call to get current weather data
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?zip=" + `${zips}` + ",us&units=imperial&appid=" + `${apiKey}`,
            type: "GET",
            dataType: 'JSON',
            success: function () {
                console.log("Success")
            },
            error: function (data) {
                console.log(data)
                console.log(data.responseText)
            }
        }).then(function (res) {
            // Naming variables to be posted to page
            let cityName = res.name
            long = res.coord.lon
            lat = res.coord.lat
            let temp = Math.round(res.main.temp)
            let ico = res.weather[0].icon
            let des = res.weather[0].main
            let des2 = res.weather[0].description
            const icoURL = "https://openweathermap.org/img/w/" + `${ico}` + ".png"
            let speed = res.wind.speed
            let direction = res.wind.deg
            let humidLevel = res.main.humidity
            let sting = res.main.pressure
            let rise = res.sys.sunrise
            let set = res.sys.sunset
            // Create new date object and convert Unix timestamp to milliseconds
            let houseInNewOrleans = new Date(rise * 1000);
            let elton = new Date(set * 1000)
            // Parse milliseconds into time string based on user location.
            let risingSun = houseInNewOrleans.toLocaleTimeString()
            let sunDown = elton.toLocaleTimeString()

            // Appending the DOM
            header.append(cityName)
            tempSpot.append(temp + "&deg;")
            latData.append(lat + "&deg;")
            longData.append(long + "&deg;")
            icoSpot.show()
            icoSpot.attr('src', icoURL)
            windSpeed.append(speed + " MPH")
            windDirection.append(direction + "&deg;")
            humidity.append(humidLevel + "&percnt;")
            weatherDesc.append(des + ", " + des2)
            underPressure.append(sting + " mb")
            sunRise.append(risingSun)
            sunSet.append(sunDown)
        })
    }
    // Function to get forecast data for 5/3 day forecast
    function getForecastData() {
        // call to get data
        event.preventDefault()
        header.empty()
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?zip=" + `${zips}` + ",us&units=imperial&appid=" + `${apiKey}`,
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                console.log("Success")
            },
            error: function (data) {
                console.log(data)
            }
        }).then(function (res) {
            let cityName = res.city.name
            let foreCast = res.list
            // for(let i = 0; i < foreCast.length; i++) {
            //     console.log(foreCast[i])
            // }
            header.append(cityName)
            fcArr = []
            foreCast.forEach(item => {
                let time = new Date(item.dt * 1000)
                let adjTime = time.toLocaleString()
                let ico = item.weather[0].icon
                const icoURL = "https://openweathermap.org/img/w/" + `${ico}` + ".png"
                let temp = Math.round(item.main.temp)
                let humidLevel = item.main.humidity
                let des = item.weather[0].main
                let des2 = item.weather[0].description
                let fcObj = {
                    time: adjTime,
                    temp: temp,
                    humid: humidLevel,
                    icon: icoURL,
                    description: des + " ," + des2
                }
                // console.log(fcObj)
                fcArr.push(fcObj)
            });
            let tr;
            fcArr.forEach(item => {
                tr = $('<tr/>');
                tr.append("<td>" + item.time + "</td>");
                tr.append("<td>" + item.temp + "</td>");
                tr.append("<td>" + `<img src="${item.icon}" />` + "</td>");
                tr.append("<td>" + item.temp +"&percnt;"+ "</td>");
                tr.append("<td>" + item.description + "</td>");
                forecastTable.append(tr);
            })

        })
    }

    function getMapData() {
        weatherMap.empty()
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?zip=" + `${zips}` + ",us&units=imperial&appid=" + `${apiKey}`,
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                console.log(data)
            },
            error: function (data) {
                console.log(data)
            }
        }).then(function (res) {
            lat = res.coord.lat
            long = res.coord.lon
            console.log(lat)
            console.log(long)
            var mymap = L.map('mapid').setView([lat, long], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                accessToken: 'pk.eyJ1IjoiZHNtYXRoZXdzZ3QiLCJhIjoiY2szbmpjd2RvMGQ3NTNucDZ2cjA3MGhhbCJ9.3k-6ar1F3fQs_txfX0EAdQ'
            }).addTo(mymap);
            weatherMap.append(mymap)

        })

    }
    // Master function that calls all above functions
    function getInfo() {
        getCurrentData()
        // getForecastData()
        getMapData()

    }
   



    $('#zipInput').on('keyup', updateVal)
    $('#submit').on('click', getInfo)
    $("#submit2").on("click", getForecastData)
})
