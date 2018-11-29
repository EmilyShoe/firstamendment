var margin = { top: 20, right: 100, bottom: 30, left: 100 };

var duration = 800;
// var width = 1200 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;


var width = $("#visual-timeline").width() - margin.left - margin.right;

var height = 550 - margin.top - margin.bottom;
var years = [1964, 1965, 1968, 1970, 1985, 2003, 2015, 2017];
var data =[
    {
        "start": "1964-9-10",
        "end" : "1965-01-04",
        "title": "The Free Speech Movement",
        "text": ["The Free Speech Movement, was a large-scale student protest " ,
            "on the campus of University of California, Berkeley. Lead by Mario " ,
            "Savio, it was started in response to an administrative " ,
            "decision to ban political activism on campus. On " ,
            "December 2nd 1964, around 4000 students sat in",
            "Sproul Hall as a last resort to negotiate with " ,
            "administrators."]
    },
    {
        "start": "1965-10-01",
        "end": "1965-10-01",
        "title": "Anti-Vietnam War Protest, Boston",
        "text": ["One thousand students, mostly from " ,
            " Harvard, MIT and Northeastern, marched " ,
            " from Cambridge Common to Boston " ,
            "Common in October 1965 to protest " ,
            "the Vietnam war. Speakers at the event" ,
            " included MIT Professor Noam M. " ,
            " Chomsky and Judy White of the Cambridge",
            " Committee to End the War in Vietnam."]

    },
    {
        "start": "1968-04-23",
        "end": "1968-03-23",
        "title": "Columbia Student Protests of 1968",
        "text": ["A series of protests broke out across the campus of the University of Columbia, " ,
            " New York, in 1968. The students were simultaneously protesting the discover that " ,
            " the university institutionally supported the United States' involvement in the " ,
            "Vietnam War and plans to build a segregated gymnasium in nearby Morningside Park." ,
            " Protesting persisted after police arrested 177 students and had beaten 51 during" ,
            "the second round of protests between May 17th and May 22nd, 1968."]
    },
    {
        "start": "1970-05-04",
        "end": "1970-05-04",
        "title": "Kent State Protest Shootings",
        "text":[ "Over 4 million students were involved in anti-Vietnam war protests in the 1960s. A large student " ,
            "protest broke out on Kent State University in Ohio after Nixon announced a bombing campaign in " ,
            "Cambodia. After several days of unrest in May, National Guardsmen opened fire on the unarmed students, firing " ,
            "67 rounds in 13 seconds, killing 4 students and wounding 9 others, one of whom suffered with " ,
            "permanent paralysis."]
    },
    {
        "start": "1985-04-18",
        "end": "1985-04-18",
        "title": "UC Berkeley Anti-Apartheid",
        "text": ["In April 1985, demonstrations broke out on the UC Berkeley campus aimed to stop financial investments " ,
            "in the apartheid regime in South Africa. Many demonstrators were arrested, which lead to further protest. " ,
            "When 20 of the demonstrators were charged, anti-apartheid demonstrators marched to the courthouse and police " ,
            "trapped them in the alley beside the courthouse to contain them."]
    },
    {
        "start": "2003-01-01",
        "end": "2003-01-01",
        "title": "NYU Anti-Iraq War Protests",
        "text": ["In 2003, over 36 million people protested the US and British invasion of Iraq. Whilst most of these " ,
            "protests were in the UK, one artistic and memorable protests was performed by New York University students, " ,
            "who created a peace sign on the floor of their library."]

    },
    {
        "start": "2015-11-09",
        "end": "2015-11-09",
        "title": "Yale University March of Resilience",
        "text": ["After a black female student was allegedly prevented from attending a fraternity party because she " ,
            "was not white, 1000 Yale students gathered for a 'March of Resilience', a march from the Afro-American " ,
            "Cultural Center to the Cross Campus. The parade consisted of students, faculty and administrators, " ,
            "who gave speeches about student unity."]
    },
    {
        "start": "2017-09-01",
        "end": "2017-09-30",
        "title": "UC Berkeley Free Speech Week",
        "text": ["In response to a no-platforming in 2016, right-wing provocateur Milo Yiannopoulos worked with a " ,
            "conservative group on the UC Berkeley campus to organize a 'Free Speech Week', a 4 day event aiming " ,
            "at promoting free speech and tolerance of conservative ideas on campus. It was estimated that " ,
            "security for the event would have cost over $100,000 for the four days but as the counter-protests " ,
            "were so violent, the event was cancelled less than 24 hours before the event."]
    }
];
var dateParser = d3.timeParse("%Y-%m-%d");

data.forEach(function(d){
    d.start = dateParser(d.start);
});

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
    .attr("transform", "translate(0 ," + height + ")")
    .call(xAxis);


var years = [1964, 1965, 1968, 1970, 1985, 2003, 2015, 2017];

var points = svg.selectAll("circle").data(data);
points.enter().append("circle")
    .attr("class", "circle")
    .attr("id", function(d, i){ console.log(years[i]);return years[i]})
    .attr("r", 10)
    .attr("cx", function(d){ return x(d.start)})
    .attr("cy", height)
    .attr("fill", "#b30000");


//Berkeley Free Speech Issues
svg.append("text")
    .attr("class", "1964")
    .attr("x", 0)
    .attr("y", 330)
    .attr("font-size", 18)
    .text("Free Speech Movement, Berkeley");

var FSM = svg.selectAll("FSM").data(data[0].text);
FSM.enter().append("text")
    .attr("class", "1964")
    .attr("class", "infoText")
    .attr("x", function(d){return x(dateParser("1964-9-10")) - margin.left})
    .attr("y", function(d, i){
        return 345 + (i * 16)
    })
    .attr("font-size", 12)
    .text(function(d, i){ return d});

svg.append("image")
    .attr("id", "savioSound")
    .attr("class", "1964")
    .attr("xlink:href", "data/timeline/savio.png")
    .attr('width', 170)
    .attr('height', 120)
    .attr("x", 200)
    .attr("y", height/2 + 105);

svg.append("text")
    .attr("id", "facts")
    .attr("x", x(dateParser("1964-9-10")) - margin.left/2)
    .attr("y", 465)
    .attr("font-size", 14)
    .text("Number arrested: 773");

// Boston anti-Vietnam war protests
svg.append("text")
    .attr("class", "1965")
    .attr("x", x(dateParser("1965-10-01")))
    .attr("y", 170)
    .attr("font-size", 18)
    .text("Boston Anti-Vietnam War March");

var bos = svg.selectAll("FSM").data(data[1].text);
bos.enter().append("text")
    .attr("class", "1964")
    .attr("class", "infoText")
    .attr("x",  x(dateParser("1965-10-01")) - margin.left + 135)
    .attr("y", function(d, i){
        return 180 + (i * 16)
    })
    .attr("font-size", 12)
    .text(function(d, i){ return d});



///media playing

var savioSpeech = $("#saviosound")[0];
$("#1964")
    .mouseenter(function() {
        savioSpeech.play();
    })
    .mouseout(function() {
        savioSpeech.pause();
    });