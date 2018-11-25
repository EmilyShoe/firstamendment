//
// d3.json("data/quiz.json", function(questions) {

var questions = [{
    "question": "You are banned from a social media platform",
    "answer": "false",
    "explanation": "Social media companies are private companies. Whilst it would be morally favourable for them to encourage free speech, the First Amendment protects from government censorship.",
},
    {
        "question": "You are fired from your job for something you said in public or online",
        "answer": "false",
        "explanation": "If you work for a private company, you are not protected by the First Amendment. It is a private company's right to choose their code of conduct and fire/hire people at their will. If you work for the government, it could be a first amendment issue if the speech does not prevent you from doing your job. For example, if you work with children and say something dangerous, they have can fire you. "
    },
    {
        "question": "A private university cancels a visit from a controversial speaker",
        "answer": "false",
        "explanation": "Again, private organizations have the right to do what they want. However, most private universities know that free speech is essential for academics.",
    },
    {
        "question": "A public university cancels a visit from a controversial speaker",
        "answer": "true",
        "explanation": "Public universities are not allowed to cancel speeches based on who the speaker is. They are naturally allowed to place restrictions, such as dictating the time, venue, or make suggestions for subject matter, but they cannot do so that discriminates against a certain point of view."
    },
    {
        "question": "You are arrested for saying something critical of the government",
        "answer": "true",
        "explanation": "It would be unconstitutional to be arrested for being critical of the government unless it was a direct call to violence."

    },
    {
        "question" : "Your post online is deleted",
        "answer": "false",
        "explanation": "Private companies can essentially do whatever they want, including deleting your posts if they so wish. That being said, these private companies are not held to account for what is said on them and therefore, a lot of them take a back seat when it comes to censorship."
    },
    {
        "question": "You are fined by your company for not standing for the national anthem",
        "answer": "true",
        "explanation": "Whilst private companies can do what they want essentially, symbolic speech, such as the national anthem and political speech, are protected specifically by the constitution. Not standing for the national anthem is not threatening nor disruptive."
    }];

    $('#quiz-result')
        .hide();

    // each question has a Reason and a Story
    questions.forEach(function(question) {
        var html =
            `
            <tr>
                <td class="quiz-reason">
                    ${question.question}.
                </td>
                <td>
                  <button class="btn btn-yes" id="true">Yes</button>
                  <button class="btn btn-no" id="false">No</button>
                </td>
            </tr>
        `;
        var $element = $(html);

        // handle clicks
        $element.find(".btn-yes, .btn-no")
            .on('click', function() {
                var myClass = $(this).attr("id");
                if (myClass === question.answer){
                    $(this).css("background-color", "green");
                    $('#answer').html( "<span id='correct'>"+ "Correct. " +"</span>"+ question.explanation);
                } else {
                    $(this).css("background-color", "#AF000E");
                    $('#answer').html("<span id='incorrect'>" + "Incorrect. " +"</span>"+ question.explanation);
                }

            });
        $('#quiz-qs')
            .append($element);
    });
