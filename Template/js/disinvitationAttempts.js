
/*
 * LineGraph - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the actual data: disinvitationattempts
 */

DisinvitationAttempts = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
};


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

var radius = 6;

DisinvitationAttempts.prototype.initVis = function(){
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

    vis.radius = radius;

    vis.svg.append("text")
        .attr("class", "stooltip speaker-title")
        .attr("x", 0)
        .attr("y", 20)
        .attr("dy", ".35em")
        .text("Speaker:");
    vis.tooltipSpeaker = vis.svg.append("text")
        .attr("class", "stooltip speaker-info")
        .attr("x", 160)
        .attr("y", 20)
        .attr("dy", ".35em");


    vis.svg.append("text")
        .attr("class", "stooltip speaker-title")
        .attr("x", 0)
        .attr("y", 35)
        .attr("dy", ".35em")
        .text("Year:");
    vis.tooltipYear = vis.svg.append("text")
        .attr("class", "stooltip speaker-info")
        .attr("x", 160)
        .attr("y", 35)
        .attr("dy", ".35em");

    vis.svg.append("text")
        .attr("class", "stooltip speaker-title")
        .attr("x", 0)
        .attr("y", 50)
        .attr("dy", ".35em")
        .text("University:");
    vis.tooltipSchool = vis.svg.append("text")
        .attr("class", "stooltip speaker-info")
        .attr("x", 160)
        .attr("y", 50)
        .attr("dy", ".35em");

    vis.svg.append("text")
        .attr("class", "stooltip speaker-info")
        .attr("x", 0)
        .attr("y", 65)
        .attr("dy", ".35em")
        .text("Controversial Views:");
    vis.tooltipControversy = vis.svg.append("text")
        .attr("class", "stooltip speaker-info")
        .attr("x", 160)
        .attr("y", 65)
        .attr("dy", ".35em");

    //Initialize Grouping Labels
    vis.labelOne = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 80)
        .attr("y", 330)
        .attr("dy", ".35em");
    vis.labelTwo = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 360)
        .attr("y", 330)
        .attr("dy", ".35em");
    vis.labelThree = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 600)
        .attr("y", 330)
        .attr("dy", ".35em");
    vis.labelFour = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 850)
        .attr("y", 330)
        .attr("dy", ".35em");



    // (Filter, aggregate, modify data)
    vis.wrangleData();
};


/*
 * Data wrangling
 */

DisinvitationAttempts.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */


DisinvitationAttempts.prototype.updateVis = function(){
    var vis = this;

    vis.speakers = vis.svg.selectAll(".speaker");

    vis.speakers
        .data(vis.data.sort(function(x, y){ return x.DisinvitationYN - y.DisinvitationYN;}))
        .enter().append("circle")
        .attr("class", "speaker")
        .merge(vis.speakers)
        .attr("r", vis.radius)
        .attr("cx", function(d) { return xFunction(d.id - 1, 30); })
        .attr("cy", function(d) { return yFunction(d.id - 1, 30); })
        .attr("fill", function (d) {
            if (d.DisinvitationYN === 0) return "#3679A9";
            else return "#AF000E";
        })
        .on('mouseover', function(d) {
            vis.tooltipSpeaker.text(d.Speaker);
            vis.tooltipYear.text(d.Year);
            vis.tooltipSchool.text(d.School);
            vis.tooltipControversy.text(d.ControversyTopic);
        })
        .on('mouseout', function(d) {
            vis.tooltipSpeaker.text("");
            vis.tooltipYear.text("");
            vis.tooltipSchool.text("");
            vis.tooltipControversy.text("");
        });

    vis.speakers
        .transition()
        .duration(1500);

    vis.labelOne
        .transition()
        .duration(1500)
        .attr("x", 260)
        .text("Total");


};

var clickNumber = -1;

DisinvitationAttempts.prototype.splitYesNo = function() {
    var vis = this;

    clickNumber *= -1;

    if(clickNumber > 0) {
        numberYes = 172; //Number of speakers with value of disinvitation successful as Yes
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function (d, index) {
                if(d.DisinvitationYN === 1){
                    return ((20 + 1) * 10/3 * vis.radius + xFunction(index - numberYes, 20));
                }
                return xFunction(index, 20);
            })
            .attr("cy", function (d, index) {
                if(d.DisinvitationYN === 1){
                    return yFunction(index - numberYes, 20);
                }
                return yFunction(index, 20);
            });

        d3.select(".yes-no-split").text("Total");

        vis.labelOne
            .transition()
            .duration(1500)
            .attr("x", 135)
            .text("Yes");

        vis.labelTwo
            .transition()
            .duration(1500)
            .attr("x", 570)
            .text("No");

        vis.labelThree.text("");
        vis.labelFour.text("");
    }
    else {
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return xFunction(d.id - 1, 30); })
            .attr("cy", function(d) { return yFunction(d.id - 1, 30); });

        d3.select(".yes-no-split").text("Successful Disinvitation");

        vis.labelOne
            .transition()
            .duration(1500)
            .attr("x", 260)
            .text("Total");
        vis.labelTwo.text("");
        vis.labelThree.text("");
        vis.labelFour.text("");
    }

};

var colorByLight = -1;
DisinvitationAttempts.prototype.colorByLight = function() {
    var vis = this;

    colorByLight *= -1;

    if(colorByLight > 0) {
        vis.svg.selectAll(".speaker")
            .attr("fill", function(d) {
                if(d.trafficLight === "red") {
                    return "#AF000E";
                }
                else if(d.trafficLight === "green") {
                    return "#3679A9";
                }
                else if(d.trafficLight === "yellow") {
                    return "white";
                }
                else return "#868e96";
            });
        d3.select(".color-by-traffic-light").text("Successful Disinvitation")

    }
    else {
        vis.svg.selectAll(".speaker")
            .attr("fill", function(d) {
                if (d.DisinvitationYN === 0) return "#3679A9";
                else return "#AF000E";
            });

        d3.select(".color-by-traffic-light").text("FIRE Rating")

    }

};

var splitByLight = -1;
DisinvitationAttempts.prototype.splitByLight = function() {
    var vis = this;

    splitByLight *= -1;

    if(splitByLight > 0) {
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function(d) {
                if(d.trafficLight === "yellow") return ((13 + 1) * 10/3 * vis.radius + xFunction(d.trafficId - 256, 11));
                else if(d.trafficLight === "red") return ((26 + 1) * 10/3 * vis.radius + xFunction(d.trafficId - 169, 11));
                else if(d.trafficLight === "none") return ((39 + 1) * 10/3 * vis.radius + xFunction(d.trafficId - 25, 11));
                return xFunction(d.trafficId - 1, 11);
            })
            .attr("cy", function(d) {
                if(d.trafficLight === "yellow") return yFunction(d.trafficId - 256, 11);
                else if(d.trafficLight === "red") return yFunction(d.trafficId - 169, 11);
                else if(d.trafficLight === "none") return yFunction(d.trafficId - 25, 11);
                return yFunction(d.trafficId - 1, 11);
            });
        d3.select(".split-by-traffic-light").text("Total");


        vis.labelOne
            .transition()
            .duration(1500)
            .attr("x", 70)
            .text("Blue (good)");
        vis.labelTwo
            .transition()
            .duration(1500)
            .attr("x", 300)
            .text("White (neutral)");
        vis.labelThree
            .transition()
            .duration(1500)
            .text("Red (bad)");
        vis.labelFour
            .transition()
            .duration(1500)
            .text("Grey (no FIRE rating)");

    }
    else {
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return xFunction(d.id - 1, 30); })
            .attr("cy", function(d) { return yFunction(d.id - 1, 30); });

        d3.select(".split-by-traffic-light").text("FIRE Rating");
        vis.labelOne
            .transition()
            .duration(1500)
            .attr("x", 260)
            .text("Total");
        vis.labelTwo.text("");
        vis.labelThree.text("");
        vis.labelFour.text("");

    }

};




//var perRow = 30;

function xFunction(ind, perRow) {
    return 10/3*radius*(ind % perRow);
}

function yFunction(ind, perRow) {
    if(ind < perRow) return 50;
    else if(ind < perRow*2) return 50 + 10/3*radius;
    else if(ind < perRow*3) return 50 + 20/3*radius;
    else if(ind < perRow*4) return 50 + 10*radius;
    else if(ind < perRow*5) return 50 + 40/3*radius;
    else if(ind < perRow*6) return 50 + 50/3*radius;
    else if(ind < perRow*7) return 50 + 20*radius;
    else if(ind < perRow*8) return 50 + 70/3*radius;
    else if(ind < perRow*9) return 50 + 80/3*radius;
    else if(ind < perRow*10) return 50 + 30*radius;
    else if(ind < perRow*11) return 50 + 100/3*radius;
    else if(ind < perRow*12) return 50 + 110/3*radius;
    else if(ind < perRow*13) return 50 + 40*radius;
    else if(ind < perRow*14) return 50 + 130/3*radius;
}

