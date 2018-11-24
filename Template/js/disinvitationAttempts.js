
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

    vis.tooltipSpeaker = vis.svg.append("text")
        .attr("class", "speaker-info")
        .attr("x", 0)
        .attr("y", 20)
        .attr("dy", ".35em");
    vis.tooltipYear = vis.svg.append("text")
        .attr("class", "speaker-info")
        .attr("x", 0)
        .attr("y", 35)
        .attr("dy", ".35em");
    vis.tooltipSchool = vis.svg.append("text")
        .attr("class", "speaker-info")
        .attr("x", 0)
        .attr("y", 50)
        .attr("dy", ".35em");
    vis.tooltipControversy = vis.svg.append("text")
        .attr("class", "speaker-info")
        .attr("x", 0)
        .attr("y", 65)
        .attr("dy", ".35em");

    //console.log(vis.data);
    // (Filter, aggregate, modify data)
    vis.wrangleData();
};


/*
 * Data wrangling
 */

DisinvitationAttempts.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = d3.nest()
        .key(function (d) {
            return d.DisinvitationYN;
        })
        .entries(vis.data);


    //console.log(vis.displayData[0]);

    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */


DisinvitationAttempts.prototype.updateVis = function(){
    var vis = this;

    vis.speakersYes = vis.svg.selectAll(".yesspeaker").data(vis.displayData[1].values);
    vis.speakersNo = vis.svg.selectAll(".nospeaker").data(vis.displayData[0].values);

    vis.speakersYes.enter().append("circle")
        .attr("class", "speaker yesspeaker")
        .merge(vis.speakersYes)
        .attr("r", vis.radius)
        .attr("cx", function(d) { return xFunction(d.id - 1); })
        .attr("cy", function(d) { return yFunction(d.id - 1); })
        .attr("fill", function (d) {
            if (d.DisinvitationYN === "Yes") return "#3679A9";
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

    vis.speakersYes
        .transition()
        .duration(1500);

    vis.speakersNo.enter().append("circle")
        .attr("class", "speaker nospeaker")
        .merge(vis.speakersNo)
        .attr("r", vis.radius)
        .attr("cx", function(d) { return xFunction(d.id - 1); })
        .attr("cy", function(d) { return yFunction(d.id - 1); })
        .attr("fill", function (d) {
            if (d.DisinvitationYN === "Yes") return "#3679A9";
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

    vis.speakersNo
        .transition()
        .duration(1500);



    //svg.selectAll("circle").exit().remove();

};

var clickNumber = -1;

DisinvitationAttempts.prototype.splitYesNo = function() {
    var vis = this;

    clickNumber *= -1;

    if(clickNumber > 0) {
        numberYes = vis.displayData[1].values.length;
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function (d, index) {
                if(d.DisinvitationYN === "No"){
                    return ((perRow + 1) * 10/3 * vis.radius + xFunction(index - numberYes));
                }
                return xFunction(index);
            })
            .attr("cy", function (d, index) {
                if(d.DisinvitationYN === "No"){
                    return yFunction(index - numberYes);
                }
                return yFunction(index);
            });

    vis.svg.selectAll(".speaker").exit().remove();
    }
    else {
        vis.svg.selectAll(".speaker")
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return xFunction(d.id - 1); })
            .attr("cy", function(d) { return yFunction(d.id - 1); });
    }

};



var perRow = 30;

function xFunction(ind) {
    return 10/3*radius*(ind % perRow);
}

function yFunction(ind) {
    if(ind < perRow) return 100;
    else if(ind < perRow*2) return 100 + 10/3*radius;
    else if(ind < perRow*3) return 100 + 20/3*radius;
    else if(ind < perRow*4) return 100 + 10*radius;
    else if(ind < perRow*5) return 100 + 40/3*radius;
    else if(ind < perRow*6) return 100 + 50/3*radius;
    else if(ind < perRow*7) return 100 + 20*radius;
    else if(ind < perRow*8) return 100 + 70/3*radius;
    else if(ind < perRow*9) return 100 + 80/3*radius;
    else if(ind < perRow*10) return 100 + 30*radius;
    else if(ind < perRow*11) return 100 + 100/3*radius;
    else if(ind < perRow*12) return 100 + 110/3*radius;
    else if(ind < perRow*13) return 100 + 40*radius;
}

