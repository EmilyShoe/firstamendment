
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
    vis.wrangleData("all");
}



/*
 * Data wrangling
 */

LineGraph.prototype.wrangleData = function(lineType){
    var vis = this;

    vis.totalGraphData = vis.data.filter(function(d) {
        return (d[vis.speakerType] < 2);
    });

    vis.dataTotals = d3.nest()
        .key(function (d) {
            return d.year;
        })
        .rollup(function (leaves) {
            return leaves.length;
        });

    vis.nestedTotal = d3.nest()
        .key(function (d) {
            return d.year;
        })
        .rollup((function (values) {
            return d3.sum(values, function (v) {
                return v[vis.speakerType];
            });
        }));

    if(lineType==="sex") {
        vis.femaleData = vis.totalGraphData.filter(function (d) {
            return (d.sex === "Female");
        });

        vis.femaleTotals = vis.dataTotals.entries(vis.femaleData);

        vis.maleData = vis.totalGraphData.filter(function (d) {
            return (d.sex === "Male");
        });

        vis.maleTotals = vis.dataTotals.entries(vis.maleData);

        vis.nestedFemale = vis.nestedTotal.entries(vis.femaleData);
        vis.nestedMale = vis.nestedTotal.entries(vis.maleData);

        vis.nestedFemale.map(function(d,index) {return percentageCalculator(d, index, vis.femaleTotals);});
        vis.nestedMale.map(function(d,index) {return percentageCalculator(d, index, vis.maleTotals);});

    }

    else if(lineType==="political-party") {
        vis.republicanData = vis.totalGraphData.filter(function (d) {
            return (d.party === "Strong republican" || d.party === "Not str republican");
        });

        vis.republicanTotals = vis.dataTotals.entries(vis.republicanData);

        vis.independentData = vis.totalGraphData.filter(function (d) {
            return (d.party === "Independent" || d.party === "Ind, near republican" || d.party === "Ind, near democrat");
        });

        vis.independentTotals = vis.dataTotals.entries(vis.independentData);

        vis.democratData = vis.totalGraphData.filter(function (d) {
            return (d.party === "Strong democrat" || d.party === "Not str democrat");
        });

        vis.democratTotals = vis.dataTotals.entries(vis.democratData);

        vis.nestedRepublican = vis.nestedTotal.entries(vis.republicanData);
        vis.nestedIndependent = vis.nestedTotal.entries(vis.independentData);
        vis.nestedDemocrat = vis.nestedTotal.entries(vis.democratData);

        vis.nestedRepublican.map(function(d,index) {return percentageCalculator(d, index, vis.republicanTotals);});
        vis.nestedIndependent.map(function(d,index) {return percentageCalculator(d, index, vis.independentTotals);});
        vis.nestedDemocrat.map(function(d,index) {return percentageCalculator(d, index, vis.democratTotals);});
    }

    else if(lineType==="degree") {
        vis.collegeData = vis.totalGraphData.filter(function (d) {
            return (d.degree === "Graduate" || d.degree === "Bachelor" || d.degree === "Junior college");
        });

        vis.collegeTotals = vis.dataTotals.entries(vis.collegeData);

        vis.hsData = vis.totalGraphData.filter(function (d) {
            return (d.degree === "High school");
        });

        vis.hsTotals = vis.dataTotals.entries(vis.hsData);

        vis.lthsData = vis.totalGraphData.filter(function (d) {
            return (d.degree === "Lt high school");
        });

        vis.lthsTotals = vis.dataTotals.entries(vis.lthsData);

        vis.nestedCollege = vis.nestedTotal.entries(vis.collegeData);
        vis.nestedHs = vis.nestedTotal.entries(vis.hsData);
        vis.nestedLths = vis.nestedTotal.entries(vis.lthsData);

        vis.nestedCollege.map(function(d,index) {return percentageCalculator(d, index, vis.collegeTotals);});
        vis.nestedHs.map(function(d,index) {return percentageCalculator(d, index, vis.hsTotals);});
        vis.nestedLths.map(function(d,index) {return percentageCalculator(d, index, vis.lthsTotals);});
    }

    //Get count for each year
    vis.dataTotals = vis.dataTotals.entries(vis.totalGraphData);

    vis.nestedTotal = vis.nestedTotal.entries(vis.totalGraphData);

    vis.nestedTotal.map(function(d,index) {return percentageCalculator(d, index, vis.dataTotals);});

    // Update the visualization
    vis.updateVis(lineType);
};

//Function to calculate percentages per year
function percentageCalculator(d, index, arr) {
    d.value = 100 * (d.value / arr[index].value);
    d.key = parseDate(d.key);
}


/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */
var t = d3.transition().duration(200);

LineGraph.prototype.updateVis = function(lineType){
    var vis = this;
    // Set domains
    var minMaxY= [0, 100];
    vis.y.domain(minMaxY);

    var minMaxX = d3.extent(vis.nestedTotal.map(function(d){ return d.key; }));
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


    vis.femaleLineGraph = vis.svg.selectAll("path.femaleLine");
    vis.maleLineGraph = vis.svg.selectAll("path.maleLine");
    vis.totalLineGraph = vis.svg.selectAll("path.totalLine");
    vis.republicanLineGraph = vis.svg.selectAll("path.republicanLine");
    vis.independentLineGraph = vis.svg.selectAll("path.independentLine");
    vis.democratLineGraph = vis.svg.selectAll("path.democratLine");
    vis.collegeLineGraph = vis.svg.selectAll("path.collegeLine");
    vis.hsLineGraph = vis.svg.selectAll("path.hsLine");
    vis.lthsLineGraph = vis.svg.selectAll("path.lthsLine");

    if(lineType==="sex") {
        vis.lineType = "sex";

        //Add in selected line graphs
        vis.femaleLineGraph
            .data(vis.nestedFemale)
            .enter().append("path")
            .attr("class", "path femaleLine")
            .merge(vis.femaleLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "pink")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedFemale));

        vis.maleLineGraph
            .data(vis.nestedMale)
            .enter().append("path")
            .attr("class", "path maleLine")
            .merge(vis.maleLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedMale));

        //Remove all other line graphs
        vis.totalLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();
    }
    else if(lineType==="political-party"){
        vis.lineType = "political-party";

        //Add selected line graphs
        vis.republicanLineGraph
            .data(vis.nestedRepublican)
            .enter().append("path")
            .attr("class", "path republicanLine")
            .merge(vis.republicanLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedRepublican));

        vis.independentLineGraph
            .data(vis.nestedIndependent)
            .enter().append("path")
            .attr("class", "path independentLine")
            .merge(vis.independentLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedIndependent));

        vis.democratLineGraph
            .data(vis.nestedDemocrat)
            .enter().append("path")
            .attr("class", "path democratLine")
            .merge(vis.democratLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedDemocrat));

        //Remove all other line graphs
        vis.totalLineGraph.remove();
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();

    }
    else if(lineType==="degree") {
        vis.lineType = "degree";

        //Add selected line graphs
        vis.collegeLineGraph
            .data(vis.nestedCollege)
            .enter().append("path")
            .attr("class", "path collegeLine")
            .merge(vis.collegeLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedCollege));

        vis.hsLineGraph
            .data(vis.nestedHs)
            .enter().append("path")
            .attr("class", "path hsLine")
            .merge(vis.hsLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedHs));

        vis.lthsLineGraph
            .data(vis.nestedLths)
            .enter().append("path")
            .attr("class", "path lthsLine")
            .merge(vis.lthsLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedLths));

        //Remove all other line graphs
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.totalLineGraph.remove();

    }
    else {
        vis.lineType = "all";

        //Add in overall line graph
        vis.totalLineGraph
            .data(vis.nestedTotal)
            .enter()
            .append("path")
            .attr("class", "path totalLine")
            .merge(vis.totalLineGraph)
            .transition(t)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .attr("d", line(vis.nestedTotal));

        //Remove all other line graphs
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();
    }

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis).transition(t);
    vis.svg.select(".y-axis").call(vis.yAxis).transition(t);

    //vis.svg.selectAll(".path").exit().remove();
    vis.svg.selectAll(".axis").exit().remove();
    vis.femaleLineGraph.exit().remove();
    vis.maleLineGraph.exit().remove();
    vis.republicanLineGraph.exit().remove();
    vis.independentLineGraph.exit().remove();
    vis.democratLineGraph.exit().remove();
    vis.collegeLineGraph.exit().remove();
    vis.hsLineGraph.exit().remove();
    vis.lthsLineGraph.exit().remove();
    vis.totalLineGraph.exit().remove();

};

LineGraph.prototype.speakerChanged = function(speaker){
    var vis = this;
    vis.speakerType = speaker;

    vis.wrangleData(vis.lineType);
}

