
/*
 * LineGraph - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the actual data: gssSpeech
 */

LineGraph = function(_parentElement, _data, _speakerType){
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

    vis.margin = { top: 40, right: 60, bottom: 60, left: 60 };

    var parentElementSelector = ("#" + vis.parentElement);
    vis.width = $(parentElementSelector).width() - vis.margin.left - vis.margin.right;
    vis.height = $(parentElementSelector).height() - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select(parentElementSelector).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //Initialize Speaker choice
    vis.speakerType = "spkcom";

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
        .text("Yes");


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

LineGraph.prototype.wrangleData = function(){
    var vis = this;
    //console.log(vis.data);

    console.log(vis.speakerType);

    vis.displayData = this.data.filter(function(d) {
        return (d[vis.speakerType] < 2);
    });

    vis.dataTotals = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(vis.displayData);

    vis.displayData = d3.nest()
        .key(function (d) { return d.year; })
        .rollup((function(values) {
            return d3.sum(values, function(v) { return v[vis.speakerType]; });
        }))
        .entries(vis.displayData);

    vis.displayData.map(function(d, index) {
        d.value = 100 * (d.value / vis.dataTotals[index].value);
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
var t = d3.transition().duration(700);

LineGraph.prototype.updateVis = function(){
    var vis = this;
    d3.select("#speaker-select").on("change", console.log("yo"));
    // Set domains
    var minMaxY= [0, 100];
    vis.y.domain(minMaxY);

    var minMaxX = d3.extent(vis.displayData.map(function(d){ return d.key; }));
    vis.x.domain(minMaxX);


    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
        .tickFormat(d => d + "%");

    var line = d3.line()
        .x(function(d) { return vis.x(d.key)})
        .y(function(d) { return vis.y(d.value)});

    vis.totalLineGraph = vis.svg.selectAll("path.totalLine")
        .data(vis.displayData);

    vis.totalLineGraph.enter().append("path")
        .attr("class", "totalLine")
        .merge(vis.totalLineGraph)
        .transition(t)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", line(vis.displayData));

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis).transition(t);
    vis.svg.select(".y-axis").call(vis.yAxis).transition(t);

    vis.totalLineGraph.exit().remove();
    vis.svg.selectAll(".axis").exit().remove();

};

LineGraph.prototype.speakerChanged = function(speaker){
    console.log("here");
    var vis = this;
    vis.speakerType = speaker;

    vis.wrangleData();
}

