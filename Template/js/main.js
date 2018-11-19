queue()
	.defer(d3.csv,"data/gssSpeech.csv")
    .defer(d3.json,"data/collegesData.geojson")
    .defer(d3.json,"data/us-10m.json")
	.await(createVis);

var lineGraph;

function createVis(error, gssSpeech, colleges, usmap) {
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

    //prepare and draw colleges on map
    var usa = topojson.feature(usmap, usmap.objects.states).features;

    collegeMap = new CollegeMap("map", colleges, usa);

}

$("#speaker-select").on("change", function(){
    lineGraph.speakerChanged(this.value);
});

function allowedEncode(s) {
    if(s==="Not allowed") return 0;
    else if(s==="Allowed") return 1;
    else return 2;
}