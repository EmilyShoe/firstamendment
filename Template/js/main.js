queue()
	.defer(d3.csv,"data/gssSpeech.csv")
    .defer(d3.json,"data/collegesData.geojson")
    .defer(d3.csv, "data/disinvitationattempts.csv")
	.await(createVis);

var lineGraph;
var collegeMap;

function createVis(error, gssSpeech, colleges, disinvitations) {
    if (error) {
        console.log(error);
    }

    //Prepare and draw gss line graph
    cleanGssData = gssSpeech.map(function(d){
        var result = {
            year : +d.year,
            age : +d.age,
            sex : d.sex,
            race : d.race,
            party : d.party,
            degree : d.degree,
            id : d.id,
            spkhomo : +allowedEncode(d.spkhomo),
            spkmil : +allowedEncode(d.spkmil),
            spkath : +allowedEncode(d.spkath),
            spkcom : +allowedEncode(d.spkcom),
            spkrac : +allowedEncode(d.spkrac)};
        return result;
    });

    Disinvitations = disinvitations.map(function(d) {
        return {
            id : +d.id,
            DisinvitationYN : +speakerYN(d.DisinvitationYN),
            ControversyTopic : d.ControversyTopic,
            sideFrom : d.FromRightorLeftofSpeaker,
            Speaker : d.Speaker,
            Year : d.Year,
            School : d.School,
            trafficLight : d.trafficLight,
            trafficId : +d.trafficId

        };
    });

    lineGraph = new LineGraph("line-graphs", cleanGssData);

    collegeMap = new CollegeMap("map", colleges.features);

    disinvitationAttempts = new DisinvitationAttempts("disinvitation-visualization", Disinvitations);

}

$("#speaker-select").on("change", function(){
    lineGraph.speakerChanged(this.value);
});

//Button hovers for text in map description to filter schools
$(".ivy-league").on('mouseover', function() {
    collegeMap.wrangleData("ivy-leagues");
});

$(".overall").on('mouseover', function() {
    collegeMap.wrangleData("overall");
});

$(".public").on('mouseover', function() {
    collegeMap.wrangleData("public");
});

$(".private").on('mouseover', function() {
    collegeMap.wrangleData("private");
});

$(".gender").on('mouseover', function() {
    lineGraph.wrangleData("sex");
});

$(".political-party").on('mouseover', function() {
    lineGraph.wrangleData("political-party");
});

$(".degree").on('mouseover', function() {
    lineGraph.wrangleData("degree");
});

$(".age").on('mouseover', function() {
    lineGraph.wrangleData("age");
});

$(".line-overall").on('mouseover', function() {
    lineGraph.wrangleData("all");
});

$(".yes-no-split").on('click', function() {
    disinvitationAttempts.splitYesNo();
});

$(".color-by-traffic-light").on('click', function() {
    disinvitationAttempts.colorByLight();
});

$(".split-by-traffic-light").on('click', function() {
    disinvitationAttempts.splitByLight();
});


function allowedEncode(s) {
    if(s==="Not allowed") return 0;
    else if(s==="Allowed") return 1;
    else return 2;
}

function speakerYN(s) {
    if(s === "Yes") return 0;
    else return 1;
}