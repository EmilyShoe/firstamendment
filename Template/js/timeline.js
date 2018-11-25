var margin = { top: 40, right: 60, bottom: 60, left: 60 };

var duration = 800;
var width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var years = [1964, 1965, 1968, 1970, 1985, 2003, 2015, 2017];
var data =[
    {
        "year": 1964,
        "title": "The Free Speech Movement",
        "text": "The Free Speech Movement, was a large-scale student protest " +
            "on the campus of University of California, Berkeley. Lead by Mario " +
            "Savio, it was started in response to an administrative decision " +
            "to ban political activism on campus. On December 2nd 1964, around " +
            " 4000 students sat in Sproul Hall as a last resort to negotiate with " +
            "administrators."
    },
    {
        "year": 1965,
        "title": "Anti-Vietnam War Protest, Boston",
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
    },
    {
        "year": 1970,
        "title": "Kent State Protest Shootings",
        "text": "Over 4 million students were involved in anti-Vietnam war protests in the 1960s. A large student" +
            "protest broke out on Kent State University in Ohio after Nixon announced a bombing campaign in " +
            "Cambodia. After several days of unrest in May, National Guardsmen opened fire on the unarmed students, firing" +
            "67 rounds in 13 seconds, killing 4 students and wounding 9 others, one of whom suffered with" +
            "permanent paralysis."
    },
    {
        "year": 1985,
        "title": "UC Berkeley Anti-Apartheid",
        "text": "In April 1985, demonstrations broke out on the UC Berkeley campus aimed to stop financial investments" +
            "in the apartheid regime in South Africa. Many demonstrators were arrested, which lead to further protest." +
            "When 20 of the demonstrators were charged, anti-apartheid demonstrators marched to the courthouse and police" +
            "trapped them in the alley beside the courthouse to contain them."
    },
    {
        "year": 2003,
        "title": "NYU Anti-Iraq War Protests",
        "text": "In 2003, over 36 million people protested the US and British invasion of Iraq. Whilst most of these" +
            "protests were in the UK, one artistic and memorable protests was performed by New York University students," +
            "who created a peace sign on the floor of their library."

    },
    {
        "year": 2015,
        "title": "Yale University March of Resilience",
        "text": "After a black female student was allegedly prevented from attending a fraternity party because she" +
            "was not white, 1000 Yale students gathered for a 'March of Resilience', a march from the Afro-American" +
            "Cultural Center to the Cross Campus. The parade consisted of students, faculty and administrators," +
            "who gave speeches about student unity."
    },
    {
        "year": 2017,
        "title": "UC Berkeley Free Speech Week",
        "text": "In response to a no-platforming in 2016, right-wing provocateur Milo Yiannopoulos worked with a " +
            "conservative group on the UC Berkeley campus to organize a 'Free Speech Week', a 4 day event aiming" +
            "at promoting free speech and tolerance of conservative ideas on campus. It was estimated that" +
            "security for the event would have cost over $100,000 for the four days but as the counter-protests" +
            "were so violent, the event was cancelled less than 24 hours before the event."
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

// var x = d3.scaleTime()
//     .range([0, width])
//     .domain([new Date(1960,0,1), new Date(2018,0,1)]);

var x = d3.scaleBand()
    .domain(years)
    .range([0, width]);

var scaledif = x(1965) - x(1964);


var xAxis = d3.axisBottom().scale(x).tickValues(years);



var lines = svg.selectAll("lines").data(years);
lines.enter().append("line")
    .attr("class", "lines")
    .attr("class", function(d){d.year})
    .attr("x1", function(d){ return x(d) + scaledif/2})
    .attr("x2", function(d){ return x(d) + scaledif/2})
    .attr("y1", height/2)
    .attr("y2", function(d,i){
        if (i%2 == 0) {
            return height/2 + 75
        } else { return height/2 - 75}
    })
    .attr("stroke-width", 5)
    .attr("stroke", "#b30000");

//Berkeley free speech items
svg.append("text")
    .attr("id", "1964")
    .attr("x", x(1964))
    .attr("y", 390)
    .attr("font-size", 14)
    .text("Free Speech Movement, Berkeley");

svg.append("image")
    .attr("id", "savioSound")
    .attr("class", "1964")
    .attr("xlink:href", "data/timeline/savio.png")
    .attr('width', 170)
    .attr('height', 140)
    .attr("x", "0")
    .attr("y", height/2 + 45);

//Boston anti-Vietnam war items
svg.append("text")
    .attr("id", "1965")
    .attr("x", x(1965)- 55)
    .attr("y", 15)
    .attr("font-size", 14)
    .text("Anti-Vietnam War Protests, Boston");

//Columbia
svg.append("image")
    .attr("id", "columbia")
    .attr("class", "1968")
    .attr("xlink:href", "data/timeline/columbia.jpg")
    .attr('width', 170)
    .attr('height', 140)
    .attr("x", x(1968))
    .attr("y", height/2 + 100);

svg.append("text")
    .attr("id", "1968")
    .attr("x", x(1968) - 100)
    .attr("font-size", 14)
    .attr("y", 295)
    .text("Anti-Vietnam and Anti-Segregation Protests, New York");

// Kent State shooting
svg.append("text")
    .attr("id", "1970")
    .attr("x", x(1970) - 45)
    .attr("y", 15)
    .attr("font-size", 14)
    .text("Kent State Protest Shootings, Ohio");

// Berkeley anti-Apartheid
svg.append("image")
    .attr("class", "1985")
    .attr("xlink:href", "data/timeline/berkeleyApartheid.jpg")
    .attr('width', 170)
    .attr('height', 140)
    .attr("x", x(1985))
    .attr("y", height/2 + 50);

svg.append("text")
    .attr("id", "1985")
    .attr("x", x(1985) - 30)
    .attr("y", height/2 + 200)
    .attr("font-size", 14)
    .text("Anti-Apartheid Protests, Berkeley");

// NYU Iraq war
svg.append("image")
    .attr("class", "2003")
    .attr("xlink:href", "data/timeline/NYUIraq.jpg")
    .attr('width', 170)
    .attr('height', 100)
    .attr("x", x(2003) - 20);

svg.append("text")
    .attr("id", "2003")
    .attr("x", x(2003) - 40)
    .attr("y", height/2 - 80)
    .attr("font-size", 14)
    .text("NYU Students Protest Iraq War, NY");

// yale
svg.append("text")
    .attr("id", "2015")
    .attr("x", x(2015) - 10)
    .attr("y", height/2 + 95)
    .attr("font-size", 14)
    .text("March of Resilience, Yale");

// uc berkeley free speech week items
svg.append("image")
    .attr("id", "miloSound")
    .attr("class", "2017" )
    .attr("xlink:href", "data/timeline/milo.png")
    .attr('width', 170)
    .attr('height', 150)
    .attr("x", x(2017) - 20)
    .attr("y", 0);

svg.append("text")
    .attr("id", "2017")
    .attr("x", x(2017) - 80)
    .attr("y", 15)
    .attr("font-size", 14)
    .text("UC Berkeley Free Speech Week, Berkeley");





// var points = svg.selectAll("circle").data(years);
// points.enter().append("circle")
//     .attr("id", function(d){ return d})
//     .attr("r", 10)
//     .attr("cx", function(d){ return x(d)})
//     .attr("cy", height/2)
//     .attr("fill", "#b30000");

var xAxisG = svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0 ," + height/2 + ")")
    .call(xAxis);



var selection;
$("text").hover(function(){
   selection = Number(this.id);
   newdata = data.filter(function(d){
       return d.year === selection
   });
    $("#info").text(newdata[0].text);
});

$("image").hover(function(){
    var myClass = Number($(this).attr("class"));
    newdata = data.filter(function(d){
        return d.year === myClass
    });
    $("#info").text(newdata[0].text);
});

$("video").hover(function(){
    var myClass = Number($(this).attr("class"));
    newdata = data.filter(function(d){
        return d.year === myClass
    });
    $("#info").text(newdata[0].text);
});




var information = svg.selectAll("info").data(data);
    information.enter().append("text")
        .attr("x", "0")
        .attr("y", 50);


var savioSpeech = $("#saviosound")[0];
$("#savioSound")
    .mouseenter(function() {
        savioSpeech.play();
    })
    .mouseout(function() {
        savioSpeech.pause();
    });

var miloSpeech = $("#milosound")[0];
$("#miloSound")
    .mouseenter(function() {
        miloSpeech.play();
    })
    .mouseout(function() {
        miloSpeech.pause();
    });

$("#kentVideo").prop('muted', true);

$("#kentVideo").hover( function (){
    if( $("#kentVideo").prop('muted') ) {
        $("#kentVideo").prop('muted', false);
    } else {
        $("#kentVideo").prop('muted', true);
    }
});

$("#yaleVideo").prop('muted', true);

$("#yaleVideo").hover( function (){
    if( $("#yaleVideo").prop('muted') ) {
        $("#yaleVideo").prop('muted', false);
    } else {
        $("#yaleVideo").prop('muted', true);
    }
});