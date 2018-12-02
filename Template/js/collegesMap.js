
/*
 * LineGraph - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the actual data: gssSpeech
 */

CollegeMap = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
};


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */
L.Icon.Default.imagePath = 'img/map/';
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

CollegeMap.prototype.initVis = function(){
    var vis = this;

    vis.height = 550;
    //Set up map of US map, zoomed in on north east
    vis.map = L.map(vis.parentElement).setView([42.1015, -72.589], 6);

    //Add tile layer for map
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(vis.map);

    vis.usmap = L.layerGroup().addTo(vis.map);

    //Initialize custom markers
    vis.redMarker = L.AwesomeMarkers.icon({
        icon: 'university',
        markerColor: 'red'
    });

    vis.blueMarker = L.AwesomeMarkers.icon({
        icon: 'university',
        markerColor: 'darkblue'
    });

    vis.whiteMarker = L.AwesomeMarkers.icon({
        icon: 'university',
        markerColor: 'white',
        iconColor: '#3679A9'
    });

    //Initialize Map Legend under textx
    var colLegend = $('#college-map-legend');
    colLegend.append("<div class=\"awesome-marker-icon-red awesome-marker\" style=\"transform: translate3d(100px," + (vis.height - 15) + "px, 0px)\"><i class=\" fa fa-university  icon-white\"></i></div>");
    colLegend.append("<div id=\"labels-colleges\" >Restricting Speech Codes &emsp; &emsp; Neutral Speech Codes &emsp; &emsp; Good Speech Codes</div>");
    colLegend.append("<div class=\"awesome-marker-icon-darkblue awesome-marker\" style=\"width: 38px; height: 48px; transform: translate3d(315px," + (vis.height - 15) + "px, 0px)\"></div>");
    colLegend.append("<div class=\"awesome-marker-icon-white awesome-marker\" style=\"transform: translate3d(315px," + (vis.height - 15) + "px, 0px)\"><i class=\" fa fa-university\" style=\"color: #3679A9\"></i></div>");
    colLegend.append("<div class=\"awesome-marker-icon-darkblue awesome-marker\" style=\"transform: translate3d(505px," + (vis.height - 15) + "px, 0px)\"><i class=\" fa fa-university  icon-white\"></i></div>");



    // (Filter, aggregate, modify data)
    vis.wrangleData("total");


};


/*
 * Data wrangling
 */

CollegeMap.prototype.wrangleData = function(whichColleges){
    var vis = this;

    switch(whichColleges) {
        case "ivy-leagues": vis.displayData = vis.data.filter(function(d) { return d.properties.Ivy === "TRUE";}); break;
        case "public": vis.displayData = vis.data.filter(function(d) { return d.properties.Private === "FALSE";}); break;
        case "private": vis.displayData = vis.data.filter(function(d) {return d.properties.Private === "TRUE";}); break;
        default: vis.displayData = vis.data;
    }
    //console.log(vis.displayData);

    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

CollegeMap.prototype.updateVis = function(){
    var vis = this;

    vis.usmap.clearLayers();

    //add markers for the schools
    vis.displayData.forEach(function(d) {
        var popupContent =  "<strong>" + d.properties.School + "</strong><br/>";
        vis.usmap.addLayer(L.marker([d.geometry.coordinates[1], d.geometry.coordinates[0]], chooseIcon(d.properties.Light)).bindPopup(popupContent));
    });

    function chooseIcon(color) {
        if(color === "red") return { icon: vis.redMarker};
        else if(color === "green") return {icon: vis.blueMarker};
        else return {icon: vis.whiteMarker};
    }

};



