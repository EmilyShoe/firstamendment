var margin = { top: 40, right: 60, bottom: 60, left: 60 };

var duration = 800;
var width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var years = [1964, 1965, 1968, 1970, 1985, 2003, 2015, 2017];
var data =[
    {
        "year": 1964,
        "title": "The Free Speech Movement, UC Berkeley, 1964",
        "text": "The Free Speech Movement, was a large-scale student protest " +
            "on the campus of University of California, Berkeley. Lead by Mario " +
            "Savio, it was started in response to an administrative decision " +
            "to ban political activism on campus. On December 2nd 1964, around " +
            " 4000 students sat in Sproul Hall as a last resort to negotiate with " +
            "administrators."
    },
    {
        "year": 1965,
        "title": "Anti-Vietnam War Protest in Boston, 1965",
        "text": "One thousand students, mostly from Harvard, MIT and Northeastern, " +
            "marched from Cambridge Common to Boston Common in October 1965 to protest " +
            "the Vietnam war. Speakers at the event included MIT Professor Noam M." +
            " Chomsky and Judy White of the Cambridge Committee to End the War in Vietnam."

    },
    {
        "year": 1968,
        "title": "Columbia Student Protests of 1968",
        "text": "A series of protests broke out across the campus of the University of Columbia," +
            " New York, in 1968. The students were simultaneously protesting the discover that" +
            " the university institutionally supported the United States' involvement in the " +
            "Vietnam War and plans to build a segregated gymnasium in nearby Morningside Park. Protesting" +
            " persisted after police arrested 177 students and had beaten 51 during the second round of protests" +
            " between May 17th and May 22nd, 1968."
    }

    ];


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// SVG drawing area
var svg = d3.select("#visual-timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .range([0, width])
    .domain([new Date(1960,0,1), new Date(2018,0,1)]);

var xAxis = d3.axisBottom().scale(x);


var xAxisG = svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0 ," + height/2 + ")")
    .call(xAxis);

svg.append("image")
    .attr("id", "savio")
    .attr("xlink:href", "data/timeline/savio.png")
    .attr('width', 100)
    .attr('height', 80)
    .attr("x", "0")
    .attr("y", height/2 - 2*(margin.top));


svg.append("foreignObject")
    .attr("id", "boston")
    .attr('width', 200)
    .attr('height', height/2 + 70)
    .attr("x", "0")
    .attr("h", 200);

var points = svg.selectAll("circle").data(years);
points.enter().append("circle")
    .attr("id", function(d){ return d})
    .attr("r", 10)
    .attr("cx", function(d){ return x(new Date(d, 0 ,1))})
    .attr("cy", height/2)
    .attr("fill", "#b30000");



var selection;
$("circle").hover(function(){
   selection = Number(this.id);
   newdata = data.filter(function(d){
       return d.year === selection
   });
    $("#info").text(newdata[0].text);
});



var information = svg.selectAll("info").data(data);
    information.enter().append("text")
        .attr("x", "0")
        .attr("y", 50);


var savioSpeech = $("#saviosound")[0];
$("#savio")
    .mouseenter(function() {
        savioSpeech.play();
    })
    .mouseout(function() {
        savioSpeech.pause();
    });

var bostonVid = $("#bostonVideo")[0];
$("#boston")
    .mouseenter(function() {
        bostonVid.play();
    })
    .mouseout(function() {
        bostonVid.pause();
    });