
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

    //Initialize tooltips
    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        //.offset([-10, 0])
        .direction('e')
        .html(function(d) {
            return "<strong>Speaker: </strong>" + d.Speaker + "</br>" +
                    "<strong>Year: </strong>" + d.Year + "</br>" +
                    "<strong>University: </strong>" + d.School + "</br>" +
                    "<strong>Controversial Issues: </strong>" + d.ControversyTopic;
        });

    vis.svg.call(vis.tip);

    vis.radius = radius;

    //variables to keep track of how the data is split and colored
    vis.splitByVar = "all";
    vis.colorByVar = "YesNo";

    //Initialize Grouping Labels
    vis.labelOne = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 80)
        .attr("y", 295)
        .attr("dy", ".35em");
    vis.labelTwo = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 360)
        .attr("y", 295)
        .attr("dy", ".35em");
    vis.labelThree = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 600)
        .attr("y", 295)
        .attr("dy", ".35em");
    vis.labelFour = vis.svg.append("text")
        .attr("class", "group-label")
        .attr("x", 850)
        .attr("y", 295)
        .attr("dy", ".35em");

    vis.title = vis.svg.append("text")
        .attr("class", "disinvitation-title")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "18px")
        .attr("dy", ".35em");

    // (Used for filtering data)
    vis.wrangleData();
};

/*
 * Data wrangling
 */
DisinvitationAttempts.prototype.wrangleData = function() {
    var vis = this;

    //Filtering done in data with separate ids for each data point
    vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();
};

/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */
DisinvitationAttempts.prototype.updateVis = function(){
    var vis = this;

    vis.speakers = vis.svg.selectAll(".speaker");

    //Initialize speaker circles colored by disinvitation value
    vis.speakers
        .data(vis.data.sort(function(x, y){ return x.DisinvitationYN - y.DisinvitationYN;}))
        .enter().append("circle")
        .attr("class", "speaker")
        .merge(vis.speakers)
        .attr("r", vis.radius)
        .attr("cx", function(d) { return xFunction(d.disinvitationId, 30); })
        .attr("cy", function(d) { return yFunction(d.disinvitationId, 30); })
        .attr("fill", function (d) {
            if (d.DisinvitationYN === 0) return "#3679A9";
            else return "#AF000E";
        })
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    vis.speakers
        .transition()
        .duration(1500);

    //Initialize label for grouping as total
    vis.labelOne
        .transition()
        .duration(1500)
        .attr("x", 260)
        .text("Total");

    //Initialize graph title text
    vis.title.text("Speakers Invited to Campuses");

    vis.speakers.exit().remove();

};

/*
* This function groups speakers by whether the disinvitation attempt against them was successful
*/
DisinvitationAttempts.prototype.splitYesNo = function() {
    var vis = this;
    vis.splitByVar = "YesNo";

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


};

/*
* This function colors speaker circles by what rating FIRE gave the school they were speaking at
*/
DisinvitationAttempts.prototype.colorByLight = function(colorByLight) {
    var vis = this;
    console.log(colorByLight);
    if(+colorByLight > 0) {
        vis.colorByVar = "trafficLight";
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

        callSplitFunction(vis);

        d3.select(".color-by-traffic-light").style("background-color", "#AF000E");
        d3.select(".color-by-yes-no").style("background-color", "#3679A9");

    }
    else {
        vis.colorByVar = "YesNo";
        vis.svg.selectAll(".speaker")
            .attr("fill", function(d) {
                if (d.DisinvitationYN === 0) return "#3679A9";
                else return "#AF000E";
            });
        callSplitFunction(vis);

        d3.select(".color-by-traffic-light").style("background-color", "#3679A9");
        d3.select(".color-by-yes-no").style("background-color", "#AF000E");

    }

};

/*
* This function splits speakers by what rating FIRE gave the school they were speaking at
*/
DisinvitationAttempts.prototype.splitByLight = function(splitByLight) {
    var vis = this;

    if(+splitByLight > 0) {
        vis.splitByVar = "trafficLight";

        if(vis.colorByVar === "YesNo") {
            vis.svg.selectAll(".speaker")
                .transition()
                .duration(1500)
                .attr("cx", function(d) {
                    if(d.trafficLight === "yellow") {
                        return ((13 + 1) * 10/3 * vis.radius + xFunction(d.trafficDisinviteId - 255, 11));
                    }
                    else if(d.trafficLight === "red") return ((26 + 1) * 10/3 * vis.radius + xFunction(d.trafficDisinviteId - 168, 11));
                    else if(d.trafficLight === "none") {
                        return ((39 + 1) * 10/3 * vis.radius + xFunction(d.trafficDisinviteId - 24, 11));
                    }
                    return xFunction(d.trafficDisinviteId, 11);
                })
                .attr("cy", function(d) {
                    if(d.trafficLight === "yellow") return yFunction(d.trafficDisinviteId - 255, 11);
                    else if(d.trafficLight === "red") return yFunction(d.trafficDisinviteId - 168, 11);
                    else if(d.trafficLight === "none") return yFunction(d.trafficDisinviteId - 24, 11);
                    return yFunction(d.trafficDisinviteId, 11);
                });
        }
        else {
            vis.svg.selectAll(".speaker")
                .transition()
                .duration(1500)
                .attr("cx", function(d) {
                    if(d.trafficLight === "yellow") return ((13 + 1) * 10/3 * vis.radius + xFunction(d.trafficId - 255, 11));
                    else if(d.trafficLight === "red") return ((26 + 1) * 10/3 * vis.radius + xFunction(d.trafficId - 168, 11));
                    else if(d.trafficLight === "none") return ((39 + 1) * 10/3 * vis.radius + xFunction(d.trafficId - 24, 11));
                    return xFunction(d.trafficId, 11);
                })
                .attr("cy", function(d) {
                    if(d.trafficLight === "yellow") return yFunction(d.trafficId - 255, 11);
                    else if(d.trafficLight === "red") return yFunction(d.trafficId - 168, 11);
                    else if(d.trafficLight === "none") return yFunction(d.trafficId - 24, 11);
                    return yFunction(d.trafficId, 11);
                });
        }
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

        d3.select("#disinvited-explanation").text("Successful disinvitations occur with approximately the same frequency at schools with each type of FIRE rating" +
            " when you take into account the percentage of schools with each rating.");

        vis.title.text("Grouped by FIRE Rating");

    }
    else {
        vis.splitByVar = "all";

        if(vis.colorByVar === "trafficLight") {
            vis.svg.selectAll(".speaker")
                .transition()
                .duration(1500).attr("cx", function (d, index) {
                return xFunction(d.trafficId, 30);
                })
                .attr("cy", function (d, index) {
                    return yFunction(d.trafficId, 30);
                });
        }
        else {
            vis.svg.selectAll(".speaker")
                .transition()
                .duration(1500)
                .attr("cx", function (d, index) {
                    return xFunction(index, 30);
                })
                .attr("cy", function (d, index) {
                    return yFunction(index, 30);
                });
        }

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

        vis.title.text("Speakers Invited to Campuses");

    }

};


/*
*These functions determine x and y indices for circles based on an index and number of circles per row desired
*/
function xFunction(ind, perRow) {
    return 10/3*radius*(ind % perRow);
}

function yFunction(ind, perRow) {
    var yBuffer = 20;
    if(ind < perRow) return yBuffer;
    else if(ind < perRow*2) return yBuffer + 10/3*radius;
    else if(ind < perRow*3) return yBuffer + 20/3*radius;
    else if(ind < perRow*4) return yBuffer + 10*radius;
    else if(ind < perRow*5) return yBuffer + 40/3*radius;
    else if(ind < perRow*6) return yBuffer + 50/3*radius;
    else if(ind < perRow*7) return yBuffer + 20*radius;
    else if(ind < perRow*8) return yBuffer + 70/3*radius;
    else if(ind < perRow*9) return yBuffer + 80/3*radius;
    else if(ind < perRow*10) return yBuffer + 30*radius;
    else if(ind < perRow*11) return yBuffer + 100/3*radius;
    else if(ind < perRow*12) return yBuffer + 110/3*radius;
    else if(ind < perRow*13) return yBuffer + 40*radius;
    else if(ind < perRow*14) return yBuffer + 130/3*radius;
}

function callSplitFunction(vis) {
    if(vis.splitByVar === "all") {
        vis.splitByLight(-1);
    }
    else if(vis.splitByVar === "YesNo") {
        vis.splitYesNo();

    }
    else vis.splitByLight(1);
}

