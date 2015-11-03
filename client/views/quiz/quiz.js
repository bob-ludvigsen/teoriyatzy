/**
 * Created by pfu on 23/05/14.
 */

everySecond = new Tracker.Dependency();

Meteor.setInterval(function () {
    everySecond.changed();
}, 1000);

var CountDown = function (maxCount, f) {
    var i = 0;
    return Tracker.autorun(function (c) {
        everySecond.depend();
        if (i++ == maxCount) c.stop();
        if (!c.stopped) {
            // Decrement time
            f(maxCount - i, c);
        }
    });

};
var counter = new ReactiveVar();
var rightAnswer = new ReactiveVar();

// byg evt en statemachine ud fra dette object
State = {
    running: true
};

/*CountDown(10, function(i, c) {
 console.log('1:', i);
 counter.set(i);
 });*/


Template.quiz.onCreated(function () {
    // gem svar, tid og svarknap indtil spørgsmålet er læst op..
    /* $(".hide-div").hide();
     $(".wait-text").show();*/
});
Template.quiz.onRendered(function () {
    // gem svar, tid og svarknap indtil spørgsmålet er læst op..
    $(".hide-div").hide();
    $(".wait-text").show();


    var gameId = Session.get("playgame");

    Gamedata.update({_id: gameId}, {$inc: {count: +1}});

    //hvis spilleren klikker frem eller tilbage skal han sendes til "mygames"
    if (window.history && window.history.pushState) {

        //window.history.pushState('forward', null, './board');
        window.onpopstate = function (event) {

            alert("Do not press the back or forward button. You will be routed back to my games here you can start again!! ");
            State.running = false;

            Session.set("show-feedback-pos", false);
            Session.set("show-feedback-neg", false);
            Session.set("show_time_up", false);

            //lukker quizzen se board.js
            $(".alert").removeClass("in");
            Session.set('gotoquiz', false);
            Router.go('mygames');

        };

    }
});

Template.quiz.helpers({


    quizes: function () {

        counter.set(15);
        State.running = true;
        //Session.set("stoptimer", false);
        var cat = Session.get('category');
        var randomIndex = Session.get('index');

        var quiz = Quizzes.findOne({
            category: cat,
            //active: 'true'
            $or: [{active: 'true'}, {active: true}]
        }, {skip: randomIndex, limit: 1});

        //hvis quiz er tom så tag en tilfældig anden
        if (!quiz) {

            quiz = Quizzes.findOne({category: cat});
        }
        else {
            Session.set("yahhh", quiz.correct);
            Session.set('AnsverId', quiz._id);
            return quiz;
        }
    },
    time: function () {
        return counter.get();
        //return Session.get("time");
    },
    //Oplæs spørgsmålet
    playSound: function () {
        Session.set("noSound", true);

        setInterval(function () {
            if (Session.get("noSound")) {
                var id = Session.get('AnsverId');

                var soundUrl = Quizzes.findOne({_id: id}, {audioquestion: 1});
                //var soundUrl = Quizzes.findOne({_id:"DLuycWosnuTrhBhYS"}, {audioquestion: 1});

                //hvis der ikke er lyd og der er sat en AnsverId session
                if (!soundUrl.audioquestion && id) {
                   /* alert("An error with the sound has occured!!. You will be routed back to my games where you can start again!! ");
                    Session.set("show-feedback-pos", false);
                    Session.set("show-feedback-neg", false);
                    Session.set("show_time_up", false);
                    //lukker quizzen se board.js
                    $(".alert").removeClass("in");
                    Session.set('gotoquiz', false);
                    Router.go('mygames');*/




                        //vis svarmuligheder tid og knap..
                        $(".wait-text").hide("slow", function () {

                            $(".hide-div").show();
                        });

                        CountDown(15, function (i, c) {
                            // console.log('2:', i);
                            if (i == 0) {
                                var gameId = Session.get("playgame");
                                //fjern knappen når tiden er gået
                                $("#ansver").remove();
                                Session.set("show_time_up", true);
                                timeUp();
                                setInterval(function () {
                                    $(".alert").delay(202).addClass("in");
                                }, 100);
                                c.stop();
                                counter.set(15);

                            }
                            else if (!State.running) {
                                c.stop();

                                counter.set(15);


                            }
                            counter.set(i);
                        });


                }
                //hvis der bliver klikket refresh eller f5 tilbage til mygames
                else if (soundUrl == undefined && !id) {

                    alert("Do not press the refresh button. You will be routed back to my games where you can start again!! ");
                    //State.running = false;
                    Session.set("show-feedback-pos", false);
                    Session.set("show-feedback-neg", false);
                    Session.set("show_time_up", false);
                    //lukker quizzen se board.js
                    $(".alert").removeClass("in");
                    Session.set('gotoquiz', false);
                    Router.go('mygames');


                }
                //alt er iorden
                else {

                    var sound = new Howl({
                        urls: [soundUrl.audioquestion],
                        onend: function () {

                            //vis svarmuligheder tid og knap..
                            $(".wait-text").hide("slow", function () {

                                $(".hide-div").show();
                            });

                            CountDown(15, function (i, c) {
                                // console.log('2:', i);
                                if (i == 0) {
                                    var gameId = Session.get("playgame");
                                    //fjern knappen når tiden er gået
                                    $("#ansver").remove();
                                    Session.set("show_time_up", true);
                                    timeUp();
                                    setInterval(function () {
                                        $(".alert").delay(202).addClass("in");
                                    }, 100);
                                    c.stop();
                                    counter.set(15);

                                }
                                else if (!State.running) {
                                    c.stop();
                                    sound.stop();
                                    counter.set(15);


                                }
                                counter.set(i);
                            });
                        }
                    });
                    sound.play();
                }

                Session.set("noSound", false);
            }
        }, 100);

    }


});

function timeUp() {

    if (Session.get("show_time_up")) {

        Session.set("playSoundtimeUp", true);

        setInterval(function () {
            if (Session.get("playSoundtimeUp")) {
                $(".alert").addClass("in");
                var id = Session.get('AnsverId');
                var soundUrl = Quizzes.findOne({_id: id}, {audiowrong: 1})

                if (soundUrl.audiowrong) {
                    var sound = new Howl({
                        urls: [soundUrl.audiowrong],
                        onend: function () {
                            //kald til timer der lukker feedback
                            CountDown(3, function (i, c) {
                                // console.log('2:', i);
                                if (i == 0) {
                                    State.running = true;
                                    Session.set("show-feedback-pos", false);
                                    Session.set("show-feedback-neg", false);
                                    Session.set("show_time_up", false);
                                    //lukker quizzen se board.js
                                    $(".alert").removeClass("in");
                                    Session.set('gotoquiz', false);
                                    Router.go('board');
                                    c.stop();

                                }
                            });
                        }
                    });
                    sound.play();
                }
                Session.set("playSoundtimeUp", false);
            }
        }, 100);


    }

};

Template.quiz.events({
    'click #ansver': function (e) {

        e.preventDefault();

        //Session.set("stoptimer", true);
        State.running = false;
        Session.set("closeAlert", true);

        //fjern knappen når den er klikket..
        $("#ansver").remove();

        var gameId = Session.get("playgame");
        var griddata = Gamedata.findOne({_id: gameId});
        //Gamedata.update({_id: gameId}, {$inc: {count: +1}});

        if ($('input[type="radio"]:checked').val() === Session.get('yahhh')) {

            Session.set("show-feedback-pos", true);
            var id = Session.get("playgame");
            //var gameId = Session.get("playgame");
            //hent data til bonus brikkerne og put den i en array
            var bonusarr = [];
            var bonuslength = griddata.bonustile.length;
            for (var i = 0; i < bonuslength; i++) {
                bonusarr.push(griddata.bonustile[i])

            };

            var curPlayer = Session.get('playerTurn');
            var cat = Session.get('category');
            var indexed = Session.get('index')

            var catNoSpace = curPlayer+cat.replace(/\s/g, "")
            var catData = {};
            catData[catNoSpace] = indexed;

           // console.log('ID ' + gameId + ' categori: ' + catNoSpace + ' index ' + indexed);

            Gamedata.update({_id: id,}, {$push: catData}
            //    { upsert: true }
            );

           /* Meteor.call('usedQuestionArr', id, cat,indexed, function(error) {
                if (error)
                {
                    if (typeof Errors === "undefined") Log.error('Error: ' + error.reason);
                    else Errors.throw(error.reason);
                    return;
                }

            });
*/



            Session.set("playSoundCorrect", true);

            setInterval(function () {
                $(".alert").addClass("in");
                if (Session.get("playSoundCorrect")) {
                    //randomiser audion til det rigtige svar
                    var rand = Math.floor(Math.random() * 10) + 1;

                    var sound = new Howl({urls: ["correct/right" + rand + ".mp3"]});
                    sound.play();
                    //myAudio.addEventListener('ended', loopAudio, false);
                    Session.set("playSoundCorrect", false)
                }
            }, 0);
            //kald til timer der lukker feedback
            CountDown(3, function (i, c) {
                // console.log('2:', i);
                if (i == 0) {
                    State.running = true;
                    Session.set("show-feedback-pos", false);
                    Session.set("show-feedback-neg", false);
                    Session.set("show_time_up", false);
                    //lukker quizzen se board.js
                    $(".alert").removeClass("in");
                    Session.set('gotoquiz', false);

                    Router.go('board');
                    c.stop();

                }
            });


            var whooseturn = griddata.turn;
            //alert(whooseturn);

            var count = Session.get("counter");
            //Gamedata.update({_id:id},{$set:{"count":count}});
            var tile = parseInt(Session.get('currentTile'));

            if (whooseturn === 0) {
                //update player 1 gamedata for this game
                var a = bonusarr.indexOf(tile);


                if (a > -1) {
                    Gamedata.update({_id: id}, {$push: {"tilesp1": tile}, $inc: {scorep1: +6, countbonus: +1}});
                }
                else {
                    Gamedata.update({_id: id}, {$push: {"tilesp1": tile}, $inc: {scorep1: +1}});
                }

            }
            else if (whooseturn === 1) {
                //update player 2 gamedata for this game
                var a = bonusarr.indexOf(tile);

                if (a > -1) {
                    Gamedata.update({_id: id}, {$push: {"tilesp2": tile}, $inc: {scorep2: +6, countbonus: +1}});
                }
                else {
                    Gamedata.update({_id: id}, {$push: {"tilesp2": tile}, $inc: {scorep2: +1}});
                }
            }
        }
        else if ($('input[type="radio"]:checked').val() != Session.get('yahhh')) {
            //alert('hvad sker der lige?')

            Session.set("show-feedback-neg", true);
            Session.set("playSoundNeg", true);
            //var id = Session.get("playgame");

            setInterval(function () {

                if (Session.get("playSoundNeg")) {
                    $(".alert").addClass("in");
                    var id = Session.get('AnsverId');
                    var soundUrl = Quizzes.findOne({_id: id}, {audiowrong: 1})

                    if (soundUrl.audiowrong) {
                        //console.log('Forkert lyd ' + soundUrl.audiowrong)
                        var sound = new Howl({
                            urls: [soundUrl.audiowrong],
                            onend: function () {
                                //kald til timer der lukker feedback
                                CountDown(3, function (i, c) {
                                    // console.log('2:', i);
                                    if (i == 0) {
                                        State.running = true;
                                        Session.set("show-feedback-pos", false);
                                        Session.set("show-feedback-neg", false);
                                        Session.set("show_time_up", false);

                                        //lukker quizzen se board.js
                                        $(".alert").removeClass("in");
                                        Session.set('gotoquiz', false);
                                        Router.go('board');
                                        c.stop();

                                    }
                                });
                            }
                        });
                        sound.play();
                    }
                    Session.set("playSoundNeg", false);
                }
            }, 300);


        }

    }

});


