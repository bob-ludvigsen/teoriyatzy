/**
 * Created by pfu on 04/06/14.
 */

/*


 */

//var gameId = Session.get("playgame");

/*Meteor.startup(function () {
    Tracker.autorun(function () {


        var griddata = Gamedata.findOne({_id: gameId});


        if (griddata) {

            var player_1 = griddata.player1_id;



        }




    });
});*/

Template.board.onRendered(function () {


    //
    var gameId = Session.get("playgame");
    var griddata = Gamedata.findOne({_id: gameId});
    if (griddata) {
        var notificationPlayer1 = griddata.notificationPla1;
        var notificationPlayer2 = griddata.notificationPla2;


    }

    var thePlayer = Session.get('playerTurn');
    if (thePlayer === "player1") {

        $("#notifications").prop("checked", notificationPlayer1);

    }
    else if (thePlayer === "player2") {

        $("#notifications").prop("checked", notificationPlayer2);
    }





});

Template.board.helpers({


    score: function () {
        var gameId = Session.get("playgame");

        return Gamedata.findOne({_id: gameId});
        //return Session.get('score');
    },

    team: function  (){
        var gameId = Session.get("playgame");

       var teams = Quizzes.findOne({_id: gameId});
        //console.log(gameId);
        if (teams) {

            var numOfPlayers = teams.players.length;

            var numOfTeams =  Math.ceil(numOfPlayers/3);

            var count = 0;

            var teamName = [];

            for (var i = 0; i< numOfTeams; i++){

                console.log('Hold nummer ' + i+1)

            }

            var playername = [];


            teams.players.forEach( function (player){
                var thePlayer = Meteor.users.findOne({_id: player})

                playername.push(thePlayer.username);

                console.log('Spiller er' + count +'  '+ player);
                count +=1;
                //return player;

            })
            return playername;

            //console.log('Antal hold: ' + Math.ceil(numOfTeams));


        }



    },
    playerlist: function () {



    }



});


Template.board.events({

    'click #startgame': function (event) {
        event.preventDefault();
        var gameId = Session.get("playgame");
        var teams = Quizzes.findOne({_id: gameId});

        function makeRandom(min, max) {
            var random = function() {
                return Math.floor((Math.random() * (max-min)) + min);
            };

            return random;
        }

        //console.log(gameId);
        if (teams) {

            var numOfPlayers = teams.players.length;
            alert(teams.players[0])
            //var numOfPlayers = 9;
            var numOfTeams = Math.ceil(numOfPlayers/3);
            var count = 0;
            var teamName = [];
            for (var i = 0; i< numOfTeams; i++){

                var gnr = 'team'+i;
                var gamearr = "games."+ gnr;
                var gameObj = {};
                gameObj[gnr] = [];
                //console.log('spilobj '+gameObj)
               // Quizzes.update({_id: gameId}, {$push:{"games":gnr}});

                Quizzes.update({_id: gameId}, {$set:gameObj});


            }

            var gamearr = "games."+ gnr;

             var gameObj = {};

            var makeRandomTeams = makeRandom(0, numOfTeams);


            console.log('Spillerens id er  ' +  teams.players[0])


             teams.players.forEach( function (player){
                 var x = makeRandomTeams();
                 console.log('så er der random ' + x);
             var thePlayer = Meteor.users.findOne({_id: player})
              var teamStr = 'team'+ x;

                 switch (x) {
                     case 0:
                         Quizzes.update({_id: gameId}, {$push:{team0: thePlayer}})
                         break;
                     case 1:
                         Quizzes.update({_id: gameId}, {$push:{team1: thePlayer}})
                         break;
                     case 2:
                         Quizzes.update({_id: gameId}, {$push:{team2: thePlayer}})
                         break;
                     case 3:
                         Quizzes.update({_id: gameId}, {$push:{team3: thePlayer}})
                         break;
                     case 4:
                         Quizzes.update({_id: gameId}, {$push:{team4: thePlayer}})
                         break;
                     case 5:
                         Quizzes.update({_id: gameId}, {$push:{team5: thePlayer}})
                         break;
                     case 6:
                         Quizzes.update({_id: gameId}, {$push:{team6: thePlayer}})
                         break;
                 }



             /*gameObj[gamearr] = thePlayer.username;

             console.log('Onjektet er ' + gameObj)
             Quizzes.update({_id: gameId}, {$push: gameObj});*/
             //playername.push(thePlayer.username);

             //console.log('Spiller er' + count +'  '+ player);
             //count +=1;
             //return player;

             })

            /*var playername = [];


            teams.players.forEach( function (player){
                var thePlayer = Meteor.users.findOne({_id: player})
                playername.push(thePlayer.username);

                console.log('Spiller er' + count +'  '+ player);
                count +=1;
                //return player;

            })
            return playername;*/

            //console.log('Antal hold: ' + Math.ceil(numOfTeams));


        }



    },

    'click  .box': function (event) {
        // e.stopPropagation()


        var clickedElement = $(event.target).attr("id");
        var gameId = Session.get("playgame");
        var griddata = Gamedata.findOne({_id: gameId});
        var playerTurn = griddata.turn;




    },
    'change #notifications': function(evt){
        var thePlayer = Session.get('playerTurn');
        var gameId = Session.get("playgame");



        if (evt.target.checked ) {
            if (thePlayer === "player1") {

                Gamedata.update({_id: gameId}, {$set: {"notificationPla1": true}});

            }
            else if (thePlayer === "player2") {

                Gamedata.update({_id: gameId}, {$set: {"notificationPla2": true}});

            }

        } else {

            if (thePlayer === "player1") {

                Gamedata.update({_id: gameId}, {$set: {"notificationPla1": false}});

            }
            else if (thePlayer === "player2") {

                Gamedata.update({_id: gameId}, {$set: {"notificationPla2": false}});
            }


        }

    }


});

