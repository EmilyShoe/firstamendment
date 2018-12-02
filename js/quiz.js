//
// d3.json("data/quiz.json", function(questions) {

var questions = [{
    "question": "A social media platform banning you",
    "answer": "false",
    "explanation": "Social media companies are private companies. Whilst it would be morally favourable for them to encourage free speech, the First Amendment protects companies from government censorship or de-censorship.",
},
    {
        "question": "Being fired from your job for something you said in public or online",
        "answer": "false",
        "explanation": "It is a private company's right to choose their own code of conduct and fire/hire people at their will. If you work for the government, your speech is protected so long as it does not impede your work. "
    },
    {
        "question": "A private university cancelling a visit from a controversial speaker",
        "answer": "false",
        "explanation": "Private organizations have the right to choose their own code of conduct. Even if not protected by the First Amendment, most private universities know that free speech is essential for academics.",
    },
    {
        "question": "A public university cancelling a visit from a controversial speaker",
        "answer": "true",
        "explanation": "Public universities are not allowed to cancel speeches based on the speaker. They are allowed to place restrictions on events, such as dictating the time or venue, or make suggestions for subject matter, but they cannot do so in a way that discriminates against a certain point of view."
    },
    {
        "question": "Being arrested for saying something critical of the government",
        "answer": "true",
        "explanation": "It would be unconstitutional to be arrested for being critical of the government, unless your speech was a direct call to violence."

    },
    {
        "question" : "Your post online getting deleted",
        "answer": "false",
        "explanation": "Private companies can choose their own code of conduct, so a private social media company could delete your post if they so wish. That being said, these private companies are not held accountable for what is said on them most do not engage in active censorship."
    },
    {
        "question": "Being fined by your company for not standing for the national anthem",
        "answer": "true",
        "explanation": "Whilst private companies can choose their own code of conduct, symbolic speech like the national anthem is protected specifically by the constitution. Not standing for the national anthem would be an excercise of free speech, so firing you in this instance would be unconstitutional."
    }];

    $('#quiz-result')
        .hide();

    // each question has a Reason and a Story
    questions.forEach(function(question) {
        var html =
            `
            <tr>
                <td class="quiz-reason">
                    ${question.question}
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
