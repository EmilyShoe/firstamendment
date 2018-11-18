queue()
	.defer(d3.csv,"data/gssSpeech.csv")
	.await(createVis);

function createVis(error, gssSpeech) {
    if (error) {
        console.log(error);
    }
    //TODO


    //var lineGraph = new LineGraph("line-graphs", gssSpeech);
}