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

    team: function () {
        var gameId = Session.get("playgame");

        var teams = Quizzes.findOne({_id: gameId});
        //console.log(gameId);
        if (teams) {

            var numOfPlayers = teams.players.length;

            var numOfTeams = Math.ceil(numOfPlayers / 3);

            var count = 0;

            var teamName = [];

            for (var i = 0; i < numOfTeams; i++) {

               // console.log('Hold nummer ' + i + 1)

            }

            var playername = [];


            teams.players.forEach(function (player) {
                var thePlayer = Meteor.users.findOne({_id: player})

                playername.push(thePlayer.username);

                //console.log('Spiller er' + count + '  ' + player);
                count += 1;
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



        function shuffle(arr) {
            var shuffled = arr.slice(0), i = arr.length, temp, index;
            while (i--) {
                index = Math.floor(i * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled;
        };

        //console.log(gameId);
        if (teams) {

            //var numOfPlayers = teams.players.length;
            //alert(teams.players[0])
            var numOfPlayers = 7;

            var remainderOf = numOfPlayers % 3;

            //alert(remainderOf)

            if (remainderOf == 1){

                var numOfTeams = Math.floor(numOfPlayers / 3);
               // console.log(' number of teams is: ' + numOfTeams)
            }
            else {
                var numOfTeams = Math.ceil(numOfPlayers / 3);
                //console.log(' number of teams is: ' +  numOfTeams)
            }

            var randomArray = [];
            for (var i = 0; i < 3; i++) {

                for (var y = 0; y < 3; y++) {
                    randomArray.push(y);
                }
            }

            for (var i = 0; i < numOfTeams; i++) {

                //create the arrays that holds the players for the current game
                var gnr = 'team' + i;
                var gamearr = "games." + gnr;
                var gameObj = {};
                gameObj[gnr] = [];
                Quizzes.update({_id: gameId}, {$set: gameObj});


            }

console.log(randomArray)
            randomArray = shuffle(randomArray);

            var counter = 0;
            teams.players.forEach(function (player) {

console.log(randomArray[counter])
                //alert('team' + randomArray[counter])
                var gnr = 'team' + randomArray[counter];
                var gameObj = {};
                gameObj[gnr] = player;
                Quizzes.update({_id: gameId}, {$push: gameObj})

                counter++;
            })


        }


    },

    'click  .box': function (event) {
        // e.stopPropagation()


        var clickedElement = $(event.target).attr("id");
        var gameId = Session.get("playgame");
        var griddata = Gamedata.findOne({_id: gameId});
        var playerTurn = griddata.turn;


    }


});

