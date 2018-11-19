queue()
	.defer(d3.csv,"data/gssSpeech.csv")
    .defer(d3.json,"data/collegesData.geojson")
	.await(createVis);

var lineGraph;

function createVis(error, gssSpeech, colleges) {
    if (error) {
        console.log(error);
    }

    //console.log(gssSpeech);
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
    collegeMap = new CollegeMap("map-of-schools", colleges);

}

$("#speaker-select").on("change", function(){
    lineGraph.speakerChanged(this.value);
});

function allowedEncode(s) {
    if(s==="Not allowed") return 0;
    else if(s==="Allowed") return 1;
    else return 2;
}