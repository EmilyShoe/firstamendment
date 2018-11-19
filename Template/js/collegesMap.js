
/*
 * LineGraph - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the actual data: gssSpeech
 */

CollegeMap = function(_parentElement, _data, _mapdata){
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapdata = _mapdata;
    this.initVis();
};


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */



CollegeMap.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

    var parentElementSelector = ("#" + vis.parentElement);
    vis.width = $(parentElementSelector).width() - vis.margin.left - vis.margin.right;
    vis.height = $(parentElementSelector).height() - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select(parentElementSelector).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.projection = d3.geoAlbersUsa()
        .scale(750)
        .translate([width / 3.5, height / 2]);

   vis.path = d3.geoPath()
        .projection(vis.projection);


    // Render the map by using the path generator
    vis.svg.selectAll("path")
        .data(vis.mapdata)
        .enter().append("path")
        .attr("class", "usmap")
        .attr("d", vis.path);

    // (Filter, aggregate, modify data)
    vis.wrangleData();
};



/*
 * Data wrangling
 */

CollegeMap.prototype.wrangleData = function(){
    var vis = this;
    //console.log(vis.data);


    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

CollegeMap.prototype.updateVis = function(){
    var vis = this;

    vis.circles = vis.svg.selectAll(".point")
        .data(vis.data.features);

    vis.circles.enter().append("circle")
        .attr("class", "point")
        .merge(vis.circles)
        .attr("r", 3)
        .attr("cx", function(d) {return vis.projection(d.geometry.coordinates)[0];})
        .attr("cy", function(d) {return vis.projection(d.geometry.coordinates)[1];})
        .attr("fill", function(d) {return d.properties.Light;});

    vis.circles.exit().remove();

};

