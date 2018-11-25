
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

    //Initialize line
    vis.line = d3.line()
        .x(function(d) { return vis.x(d.key)})
        .y(function(d) { return vis.y(d.value)});

    //Initialize legend
    vis.legendBoxSize = 15;
    vis.svg.append("rect")
        .attr("class", "line-legend-first")
        .attr("x", vis.width - 2*vis.margin.left)
        .attr("y", vis.height - 2*vis.margin.bottom)
        .attr("height", vis.legendBoxSize + "px")
        .attr("width", vis.legendBoxSize + "px")
        .attr("fill", "white");

    vis.svg.append("rect")
        .attr("class", "line-legend-second")
        .attr("x", vis.width - 2*vis.margin.left)
        .attr("y", vis.height - 2*vis.margin.bottom + 1.5*vis.legendBoxSize)
        .attr("height", vis.legendBoxSize + "px")
        .attr("width", vis.legendBoxSize + "px")
        .attr("fill", "white");

    vis.svg.append("rect")
        .attr("class", "line-legend-third")
        .attr("x", vis.width - 2*vis.margin.left)
        .attr("y", vis.height - 2*vis.margin.bottom + 3*vis.legendBoxSize)
        .attr("height", vis.legendBoxSize + "px")
        .attr("width", vis.legendBoxSize + "px")
        .attr("fill", "white");

    vis.svg.append("rect")
        .attr("class", "line-legend-fourth")
        .attr("x", vis.width - 2*vis.margin.left)
        .attr("y", vis.height - 2*vis.margin.bottom + 4.5*vis.legendBoxSize)
        .attr("height", vis.legendBoxSize + "px")
        .attr("width", vis.legendBoxSize + "px")
        .attr("fill", "white");

    vis.svg.append("text")
        .attr("class", "line-legend-first")
        .attr("x", vis.width - 2*vis.margin.left + 1.3*vis.legendBoxSize)
        .attr("y", vis.height - 2*vis.margin.bottom + .9*vis.legendBoxSize);

    vis.svg.append("text")
        .attr("class", "line-legend-second")
        .attr("x", vis.width - 2*vis.margin.left + 1.3*vis.legendBoxSize)
        .attr("y", vis.height - 2*vis.margin.bottom + 2.4*vis.legendBoxSize);

    vis.svg.append("text")
        .attr("class", "line-legend-third")
        .attr("x", vis.width - 2*vis.margin.left + 1.3*vis.legendBoxSize)
        .attr("y", vis.height - 2*vis.margin.bottom + 3.9*vis.legendBoxSize);

    vis.svg.append("text")
        .attr("class", "line-legend-fourth")
        .attr("x", vis.width - 2*vis.margin.left + 1.3*vis.legendBoxSize)
        .attr("y", vis.height - 2*vis.margin.bottom + 5.4*vis.legendBoxSize);


    // (Filter, aggregate, modify data)
    vis.wrangleData("all");
};


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
    else if(lineType==="age") {
        vis.youngestRangeData = vis.totalGraphData.filter(function (d) {
            return (d.age >= 18 && d.age <= 34);
        });

        vis.youngestRangeTotals = vis.dataTotals.entries(vis.youngestRangeData);

        vis.middleOneRangeData = vis.totalGraphData.filter(function (d) {
            return (d.age >= 35 && d.age <= 49);
        });

        vis.middleOneRangeTotals = vis.dataTotals.entries(vis.middleOneRangeData);

        vis.middleTwoRangeData = vis.totalGraphData.filter(function (d) {
            return (d.age >= 50 && d.age <= 64);
        });

        vis.middleTwoRangeTotals = vis.dataTotals.entries(vis.middleTwoRangeData);

        vis.oldestRangeData = vis.totalGraphData.filter(function (d) {
            return (d.age >= 65);
        });

        vis.oldestRangeTotals = vis.dataTotals.entries(vis.oldestRangeData);

        vis.nestedYoungestRange = vis.nestedTotal.entries(vis.youngestRangeData);
        vis.nestedMiddleOneRange = vis.nestedTotal.entries(vis.middleOneRangeData);
        vis.nestedMiddleTwoRange = vis.nestedTotal.entries(vis.middleTwoRangeData);
        vis.nestedOldestRange = vis.nestedTotal.entries(vis.oldestRangeData);

        vis.nestedYoungestRange.map(function(d, index) {return percentageCalculator(d, index, vis.youngestRangeTotals);});
        vis.nestedMiddleOneRange.map(function(d, index) {return percentageCalculator(d, index, vis.middleOneRangeTotals);});
        vis.nestedMiddleTwoRange.map(function(d, index) {return percentageCalculator(d, index, vis.middleTwoRangeTotals);});
        vis.nestedOldestRange.map(function(d, index) {return percentageCalculator(d, index, vis.oldestRangeTotals);});

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


    //Initialize paths
    vis.svg.append("path")
        .attr("class", "path totalLine")
        .attr("fill", "none")
        .attr("stroke", "#3679A9")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path femaleLine")
        .attr("fill", "none")
        .attr("stroke", "#AF000E")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path maleLine")
        .attr("fill", "none")
        .attr("stroke", "#3679A9")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path republicanLine")
        .attr("fill", "none")
        .attr("stroke", "#AF000E")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path independentLine")
        .attr("fill", "none")
        .attr("stroke", "#868e96")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path democratLine")
        .attr("fill", "none")
        .attr("stroke", "#3679A9")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path collegeLine")
        .attr("fill", "none")
        .attr("stroke", "#3679A9")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path lthsLine")
        .attr("fill", "none")
        .attr("stroke", "#AF000E")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path hsLine")
        .attr("fill", "none")
        .attr("stroke", "#868e96")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path youngestLine")
        .attr("fill", "none")
        .attr("stroke", "#AF000E")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path middleOneLine")
        .attr("fill", "none")
        .attr("stroke", "#777e85")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path middleTwoLine")
        .attr("fill", "none")
        .attr("stroke", "#c4c4c4")
        .attr("stroke-width", 3);

    vis.svg.append("path")
        .attr("class", "path oldestLine")
        .attr("fill", "none")
        .attr("stroke", "#3679A9")
        .attr("stroke-width", 3);


    //Select paths by class and assign data
    vis.femaleLineGraph = vis.svg.select("path.femaleLine").datum(vis.nestedFemale);
    vis.maleLineGraph = vis.svg.select("path.maleLine").datum(vis.nestedMale);
    vis.totalLineGraph = vis.svg.select("path.totalLine").datum(vis.nestedTotal);
    vis.republicanLineGraph = vis.svg.select("path.republicanLine").datum(vis.nestedRepublican);
    vis.independentLineGraph = vis.svg.select("path.independentLine").datum(vis.nestedIndependent);
    vis.democratLineGraph = vis.svg.select("path.democratLine").datum(vis.nestedDemocrat);
    vis.collegeLineGraph = vis.svg.select("path.collegeLine").datum(vis.nestedCollege);
    vis.hsLineGraph = vis.svg.select("path.hsLine").datum(vis.nestedHs);
    vis.lthsLineGraph = vis.svg.select("path.lthsLine").datum(vis.nestedLths);
    vis.youngestRangeLineGraph = vis.svg.select("path.youngestLine").datum(vis.nestedYoungestRange);
    vis.middleOneRangeLineGraph = vis.svg.select("path.middleOneLine").datum(vis.nestedMiddleOneRange);
    vis.middleTwoRangeLineGraph = vis.svg.select("path.middleTwoLine").datum(vis.nestedMiddleTwoRange);
    vis.oldestRangeLineGraph = vis.svg.select("path.oldestLine").datum(vis.nestedOldestRange);


    //Transition to correct graph type and remove all other paths
    if(lineType==="sex") {
        vis.lineType = "sex";

        //Add in selected line graphs
        vis.femaleLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.maleLineGraph
            .transition(t)
            .attr("d", vis.line);

        //Remove all other line graphs
        vis.totalLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();
        vis.youngestRangeLineGraph.remove();
        vis.middleOneRangeLineGraph.remove();
        vis.middleTwoRangeLineGraph.remove();
        vis.oldestRangeLineGraph.remove();

        //Edit legend
        vis.svg.select("rect.line-legend-first")
            .attr("fill", "#AF000E");
        vis.svg.select("rect.line-legend-second")
            .attr("fill", "#3679A9");
        vis.svg.select("rect.line-legend-third")
            .attr("fill", "white");
        vis.svg.select("rect.line-legend-fourth")
            .attr("fill", "white");

        vis.svg.select("text.line-legend-first")
            .text("Female");
        vis.svg.select("text.line-legend-second")
            .text("Male");
        vis.svg.select("text.line-legend-third")
            .text("");
        vis.svg.select("text.line-legend-fourth")
            .text("");

    }
    else if(lineType==="political-party"){
        vis.lineType = "political-party";

        //Add selected line graphs
        vis.republicanLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.independentLineGraph
            .transition(t)
            .attr("fill", "none")
            .attr("d", vis.line);

        vis.democratLineGraph
            .transition(t)
            .attr("d", vis.line);

        //Remove all other line graphs
        vis.totalLineGraph.remove();
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();
        vis.youngestRangeLineGraph.remove();
        vis.middleOneRangeLineGraph.remove();
        vis.middleTwoRangeLineGraph.remove();
        vis.oldestRangeLineGraph.remove();

        //Edit legend
        vis.svg.select("rect.line-legend-first")
            .attr("fill", "#AF000E");
        vis.svg.select("rect.line-legend-second")
            .attr("fill", "#3679A9");
        vis.svg.select("rect.line-legend-third")
            .attr("fill", "#868e96");
        vis.svg.select("rect.line-legend-fourth")
            .attr("fill", "white");

        vis.svg.select("text.line-legend-first")
            .text("Republican");
        vis.svg.select("text.line-legend-second")
            .text("Democrat");
        vis.svg.select("text.line-legend-third")
            .text("Independent");
        vis.svg.select("text.line-legend-fourth")
            .text("");
    }
    else if(lineType==="degree") {
        vis.lineType = "degree";

        //Add selected line graphs
        vis.collegeLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.hsLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.lthsLineGraph
            .transition(t)
            .attr("d", vis.line);

        //Remove all other line graphs
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.totalLineGraph.remove();
        vis.youngestRangeLineGraph.remove();
        vis.middleOneRangeLineGraph.remove();
        vis.middleTwoRangeLineGraph.remove();
        vis.oldestRangeLineGraph.remove();

        //Edit legend
        vis.svg.select("rect.line-legend-third")
            .attr("fill", "#3679A9");
        vis.svg.select("rect.line-legend-second")
            .attr("fill", "#868e96");
        vis.svg.select("rect.line-legend-first")
            .attr("fill", "#AF000E");
        vis.svg.select("rect.line-legend-fourth")
            .attr("fill", "white");

        vis.svg.select("text.line-legend-third")
            .text("College");
        vis.svg.select("text.line-legend-second")
            .text("High School");
        vis.svg.select("text.line-legend-first")
            .text("Less than High School");
        vis.svg.select("text.line-legend-fourth")
            .text("");

    }
    else if(lineType === "age") {
        vis.lineType = "age";

        //Add selected line graphs
        vis.youngestRangeLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.middleOneRangeLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.middleTwoRangeLineGraph
            .transition(t)
            .attr("d", vis.line);

        vis.oldestRangeLineGraph
            .transition(t)
            .attr("d", vis.line);

        //Remove all other line graphs
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.totalLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();

        //Edit legend
        vis.svg.select("rect.line-legend-first")
            .attr("fill", "#AF000E");
        vis.svg.select("rect.line-legend-second")
            .attr("fill", "#777e85");
        vis.svg.select("rect.line-legend-third")
            .attr("fill", "#c4c4c4");
        vis.svg.select("rect.line-legend-fourth")
            .attr("fill", "#3679A9");

        vis.svg.select("text.line-legend-first")
            .text("18-34");
        vis.svg.select("text.line-legend-second")
            .text("35-49");
        vis.svg.select("text.line-legend-third")
            .text("50-64");
        vis.svg.select("text.line-legend-fourth")
            .text("65+");
    }
    else {
        vis.lineType = "all";

        //Add in overall line graph
        vis.totalLineGraph
            .transition(t)
            .attr("d", vis.line);

        //Remove all other line graphs
        vis.femaleLineGraph.remove();
        vis.maleLineGraph.remove();
        vis.republicanLineGraph.remove();
        vis.independentLineGraph.remove();
        vis.democratLineGraph.remove();
        vis.collegeLineGraph.remove();
        vis.hsLineGraph.remove();
        vis.lthsLineGraph.remove();
        vis.youngestRangeLineGraph.remove();
        vis.middleOneRangeLineGraph.remove();
        vis.middleTwoRangeLineGraph.remove();
        vis.oldestRangeLineGraph.remove();

        //Edit legend
        vis.svg.select("rect.line-legend-first")
            .attr("fill", "white");
        vis.svg.select("rect.line-legend-second")
            .attr("fill", "#3679A9");
        vis.svg.select("rect.line-legend-third")
            .attr("fill", "white");
        vis.svg.select("rect.line-legend-fourth")
            .attr("fill", "white");

        vis.svg.select("text.line-legend-first")
            .text("");
        vis.svg.select("text.line-legend-second")
            .text("Total");
        vis.svg.select("text.line-legend-third")
            .text("");
        vis.svg.select("text.line-legend-fourth")
            .text("");
    }

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis).transition(t);
    vis.svg.select(".y-axis").call(vis.yAxis).transition(t);

    vis.svg.selectAll(".axis").exit().remove();

};

LineGraph.prototype.speakerChanged = function(speaker){
    var vis = this;

    vis.speakerType = speaker;

    vis.wrangleData(vis.lineType);
}

