
/*
 * LineGraph - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the actual data: gssSpeech
 */

LineGraph = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

var parseDate = d3.timeParse("%Y");


LineGraph.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);





    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    // Axis title
    vis.svg.append("text")
        .attr("x", -50)
        .attr("y", -8)
        .text("Should be allowed");


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

LineGraph.prototype.wrangleData = function(){
    var vis = this;
    //console.log(vis.data);

    var chosen = "spkhomo";
    vis.displayData = this.data.filter(function(d) {
        return (d[chosen] < 2);
    });

    vis.dataTotals = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);


    vis.displayData = d3.nest()
        .key(function (d) { return d.year; })
        .rollup((function(values) {
            return d3.sum(values, function(v) { return v[chosen]; });
        }))
        .entries(vis.displayData);

    vis.displayData.map(function(d, index) {
        d.value = d.value / vis.dataTotals[index].value;
        d.key = parseDate(d.key);
    });

    console.log(vis.displayData);



    // Update the visualization
    vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

LineGraph.prototype.updateVis = function(){
    var vis = this;


    // Set domains
    var minMaxY= [0, d3.max(vis.displayData.map(function(d){ return d.value; }))];
    vis.y.domain(minMaxY);

    var minMaxX = d3.extent(vis.displayData.map(function(d){ return d.key; }));
    vis.x.domain(minMaxX);


    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .ticks(6);

    var line = d3.line()
        .x(function(d) { return vis.x(d.key)})
        .y(function(d) { return vis.y(d.value)});

    vis.svg.append("path")
        .datum(vis.displayData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
       // .attr("stroke-linejoin", "round")
      //  .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

};

