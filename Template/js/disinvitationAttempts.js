
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

    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Speaker: </strong>" + d.Speaker + "</br>" +
                    "<strong>Year: </strong>" + d.Year + "</br>" +
                    "<strong>University: </strong>" + d.School + "</br>" +
                    "<strong>Controversial Issues: </strong>" + d.ControversyTopic;
        });

    vis.svg.call(vis.tip);

    vis.radius = radius;


    //Initialize Grouping Labels
    vis.labelOne = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 80)
        .attr("y", 300)
        .attr("dy", ".35em");
    vis.labelTwo = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 360)
        .attr("y", 300)
        .attr("dy", ".35em");
    vis.labelThree = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 600)
        .attr("y", 300)
        .attr("dy", ".35em");
    vis.labelFour = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 850)
        .attr("y", 300)
        .attr("dy", ".35em");

    vis.title = vis.svg.append("text")
        .attr("class", "disinvitation-title")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "20px")
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
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    vis.speakers
        .transition()
        .duration(1500);

    vis.labelOne
        .transition()
        .duration(1500)
        .attr("x", 260)
        .text("Total");

    vis.title.text("Speakers invited to Campuses");


};

DisinvitationAttempts.prototype.splitYesNo = function() {
    var vis = this;

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


    d3.select(".split-by-traffic-light").style("background-color", "#3679A9");
    d3.select(".disinvite-total").style("background-color", "#3679A9");
    d3.select(".yes-no-split").style("background-color", "#AF000E");


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

    d3.select("#disinvited-explanation").text("About 16% more speakers were unsuccessfully protested against, " +
        "which is a good start to good free speech policy on college campuses.");

    vis.title.text("Was the Disinvitation Attempt Successful?");

    // }
    // else {
    //     vis.svg.selectAll(".speaker")
    //         .transition()
    //         .duration(1500)
    //         .attr("cx", function(d) { return xFunction(d.id - 1, 30); })
    //         .attr("cy", function(d) { return yFunction(d.id - 1, 30); });
    //
    //     d3.select(".yes-no-split").text("Successful Disinvitation");
    //
    //     vis.labelOne
    //         .transition()
    //         .duration(1500)
    //         .attr("x", 260)
    //         .text("Total");
    //     vis.labelTwo.text("");
    //     vis.labelThree.text("");
    //     vis.labelFour.text("");
    //
    //     d3.select("#disinvited-explanation").text("Hundreds of speakers are invited to speak at US universities every " +
    //         "year. Here are 378 who were disinvited to speak on a college campus.");
    //
    //     vis.title.text("Speakers invited to Campuses");
    //
    // }

};

DisinvitationAttempts.prototype.colorByLight = function(colorByLight) {
    var vis = this;
    console.log(colorByLight);
    if(+colorByLight > 0) {
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
        d3.select(".color-by-traffic-light").style("background-color", "#AF000E");
        d3.select(".color-by-yes-no").style("background-color", "#3679A9");

    }
    else {
        vis.svg.selectAll(".speaker")
            .attr("fill", function(d) {
                if (d.DisinvitationYN === 0) return "#3679A9";
                else return "#AF000E";
            });

        d3.select(".color-by-traffic-light").style("background-color", "#3679A9");
        d3.select(".color-by-yes-no").style("background-color", "#AF000E");

    }

};

DisinvitationAttempts.prototype.splitByLight = function(splitByLight) {
    var vis = this;

    if(+splitByLight > 0) {
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
        d3.select(".split-by-traffic-light").style("background-color", "#AF000E");
        d3.select(".disinvite-total").style("background-color", "#3679A9");
        d3.select(".yes-no-split").style("background-color", "#3679A9");


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

        d3.select("#disinvited-explanation").text("Schools with a bad free speech rating see disinvitations occur 3x as " +
            "often as at schools with a good free speech rating.");

        vis.title.text("Grouped by FIRE Rating");

    }
    else {
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return xFunction(d.id - 1, 30); })
            .attr("cy", function(d) { return yFunction(d.id - 1, 30); });

        d3.select(".split-by-traffic-light").style("background-color", "#3679A9");
        d3.select(".disinvite-total").style("background-color", "#AF000E");
        d3.select(".yes-no-split").style("background-color", "#3679A9");
        vis.labelOne
            .transition()
            .duration(1500)
            .attr("x", 260)
            .text("Total");
        vis.labelTwo.text("");
        vis.labelThree.text("");
        vis.labelFour.text("");

        d3.select("#disinvited-explanation").text("Hundreds of speakers are invited to speak at US universities every " +
            "year. Here are 378 who were disinvited to speak on a college campus.");

        vis.title.text("Speakers invited to Campuses");

    }

};


//var perRow = 30;

function xFunction(ind, perRow) {
    return 10/3*radius*(ind % perRow);
}

function yFunction(ind, perRow) {
    if(ind < perRow) return 20;
    else if(ind < perRow*2) return 20 + 10/3*radius;
    else if(ind < perRow*3) return 20 + 20/3*radius;
    else if(ind < perRow*4) return 20 + 10*radius;
    else if(ind < perRow*5) return 20 + 40/3*radius;
    else if(ind < perRow*6) return 20 + 50/3*radius;
    else if(ind < perRow*7) return 20 + 20*radius;
    else if(ind < perRow*8) return 20 + 70/3*radius;
    else if(ind < perRow*9) return 20 + 80/3*radius;
    else if(ind < perRow*10) return 20 + 30*radius;
    else if(ind < perRow*11) return 20 + 100/3*radius;
    else if(ind < perRow*12) return 20 + 110/3*radius;
    else if(ind < perRow*13) return 20 + 40*radius;
    else if(ind < perRow*14) return 20 + 130/3*radius;
}

