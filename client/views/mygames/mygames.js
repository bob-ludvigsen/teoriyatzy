/**
 * Created by pfu on 21/08/14.
 */
Template.mygames.helpers({
    players: function () {

        var player = Meteor.users.find({}).fetch();

        return player;
    },
    invitations: function () {

        var player = Meteor.userId();

        //setInterval( function(){
        var myinvitations = Gamedata.find({player1_id: player}).fetch();

        return myinvitations;
        //}, 300 );

    },
    myself: function (userId) {
        return Meteor.userId() === userId;
    },
    mygames: function () {
        var user = Meteor.userId();
        var games = Quizzes.find({'players': user});
        return games;



    }


});
Template.mygames.events({

    'click #playgame': function (e, template) {
        e.preventDefault();
        console.log(this._id);
        Session.setPersistent("playgame", this._id);
        Router.go('board');
    },
    'click #joinagame': function (e, tmpl) {
        //console.log(this._id);
        e.preventDefault();
        var invitedId = Meteor.userId();
        var gameId = tmpl.find('#input-game').value;


        Meteor.call('joinGame', gameId, invitedId, function (error, id) {
            if (error) {
                return alert(error.reason);
            }
            else {
                $("#jointhegame").modal("hide");
            }
        })

    }
});

Template.mygameslist.helpers({
    curplayer: function () {

        var gameId = this._id;
        var griddata = Gamedata.findOne({_id: gameId});
        var playerTurn = griddata.turn;
        if (playerTurn === 0) {
            var pl1 = Gamedata.findOne({_id: gameId}, {fields: {player1: 1}});
            return pl1.player1;
        }
        else if (playerTurn === 1) {
            var pl2 = Gamedata.findOne({_id: gameId}, {fields: {player2: 1}});
            return pl2.player2;
        }


    }
});
