(function() {
    var map;
    var aMap = new hashMap();
    var listOfMarkers = [];
    vex.defaultOptions.className = 'vex-theme-wireframe';
    //Initialize google map
    function initialize() {

    	//Set map options
        var mapOptions = {
            center: { lat:43.7 , lng: -79.4 },
            streetViewControl: false,
            //disableDefaultUI:true,
            minZoom:11,
            maxZoom:16,
            zoom: 8,
        };

        //Snazzy Maps Styling
        var styles = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#101f2d"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#f9fcff"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#ffffff"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"lightness":16},{"weight":"0.28"},{"color":"#000000"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#a9b3ba"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"transit.station","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#51626f"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#67a2b9"}]}];
        //Create map object
        map = new google.maps.Map(document.getElementById('mapContainer'),mapOptions);
        map.setOptions({styles: styles});
        
        //Set bounds for map panning
        var southWest;//= new google.maps.LatLng(43.65, -79.32105);
        var northEast;//= new google.maps.LatLng(43.75, -79.56880);
        var boundary = new google.maps.LatLngBounds(southWest, northEast);
        var lastValidCenter = map.getCenter();

        //Set listener to disable panning outside of bound region.
        //Pans map back to last saved center that is within the boundary
        // google.maps.event.addListener(map, 'center_changed', function() {
        //     if (boundary.contains(map.getCenter())) {
        //         lastValidCenter = map.getCenter();
        //         return; 
        //     }
        //     map.panTo(lastValidCenter);
        // });
    }

        //Data structs
    function hashMap() {

        //Local variables
        var map = {};    

        //Methods
        this.puts = function(key, value) {
            map[key] = value;
        }
        this.gets = function(key) {
            return map[key];
        }
        this.exists = function(key) {
            return key in map; 
        }
        this.getMap = function() {
            return map;
        }    

        return this;
    }

    function processData(aCsv) {
        var data = Papa.parse(aCsv);
        var listOfEntries = data.data;
        console.log(listOfEntries);
        var csvTitles = listOfEntries[0];
        var dataSet = [];
        var listofAddresses = [];
        for(var x = 1 ; x <= 20; x++ ) {
            dataSet.push(listOfEntries[x]);
            var anAddress = listOfEntries[x][5] + " " + listOfEntries[x][6] + " " + listOfEntries[x][7] + ",Toronto";
            console.log(anAddress);
            var isContains = $.inArray(anAddress, listofAddresses);
            if(isContains === -1) {
                addressToLatLng(anAddress);
                listofAddresses.push(anAddress);
            }
        }

        console.log(dataSet);
        console.log(dataSet[0]);
    }

    function addressToLatLng(address) {
    	latLng = {};
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address' : address}, function(results, status) {
        	console.log(address);
        	address = address.replace(/\s/g, '');
        	if(results === undefined || results === null) {
        		console.log("Couldn't get geocode for: " + address);
        		console.log(status);
        	}
        	aMap.puts(address, [results[0].geometry.location.A, results[0].geometry.location.F]);
        	console.log("Stored in hashmap: " + aMap.gets(address));
            if (status == google.maps.GeocoderStatus.OK) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                google.maps.event.addListener(marker, 'click', function(marker) {
                    console.log("clicked on a marker");
                    vex.dialog.alert({
                    	    message: "Marker was clicked on",
                            showCloseButton: false,
                    		escapeButtonCloses: false,
                    		overlayClosesOnClick: false,
                    });
                });
                listOfMarkers.push(marker);
                console.log("Geocoding was successful!");
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    //Load the Map!
    google.maps.event.addDomListener(window, 'load', initialize);

    //Is GeoLocation supported by the browser?
    var userLocationSet = false;
    if (navigator.geolocation) {
        console.log('Geolocation is supported!');
        var startPos;

        //Function for getting location
        function geoSuccess(position){
            startPos = position;
            console.log(startPos.coords.latitude);
            console.log(startPos.coords.longitude);
            //map.setCentre();
            //document.getElementById('startLat').innerHTML = startPos.coords.latitude;
            //document.getElementById('startLon').innerHTML = startPos.coords.longitude;
        };

        //Get Location
        navigator.geolocation.getCurrentPosition(geoSuccess, function(error) {
      	    //Error handling
      	    if(error === undefined ) {
      		    userLocationSet = true;
      	    }
      	    console.log("Can't get user location");
      	    console.log(error);
        });

    } else {
        console.log('Geolocation is not supported for this Browser/OS version yet.');
    }

    //Get CSV from local directory
    $.get("csv/activepermits2.csv", function(data) {
        console.log("CSV file found");
        data = processData(data);
    });

})();