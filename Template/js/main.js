queue()
	.defer(d3.csv,"data/gssSpeech.csv")
    .defer(d3.json,"data/collegesData.geojson")
	.await(createVis);

var lineGraph;
var collegeMap;

function createVis(error, gssSpeech, colleges) {
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


    lineGraph = new LineGraph("line-graphs", cleanGssData);

    collegeMap = new CollegeMap("map", colleges.features);

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

function allowedEncode(s) {
    if(s==="Not allowed") return 0;
    else if(s==="Allowed") return 1;
    else return 2;
}