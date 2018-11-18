var margin = { top: 40, right: 0, bottom: 60, left: 60 };

var width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// SVG drawing area
var svg = d3.select("#visual-timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
