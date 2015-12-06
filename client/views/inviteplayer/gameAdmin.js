/**
 * Created by pfu on 21/08/14.
 */

Template.gameadmin.helpers({

    myself: function (userId) {
        return Meteor.userId() === userId;
    },
    theorys: function () {
        var theo = Theoretics.find({});
        console.log(theo.count());
        return theo;
    },
    games: function(){
        var user = Meteor.userId();
        var game = Quizzes.find({"owner": user});
        return game;

    }

});

Template.gameadmin.events({

    'click #createtheorys': function (e, tmpl) {
        var owner = Meteor.userId();
        var thName = tmpl.find('#input-name').value;
        var theory = tmpl.find('#input-theoryname').value;
        var weight = tmpl.find('#input-weight').value;

        Meteor.call('createTheory', thName, theory, weight, owner, function (error, id) {
            console.log('er indsat');
            if (error)
                return alert(error.reason);
        })
        $("#createtheory").modal("hide");
    },
    'click #createthegame': function (e, tmpl){
        var owner = Meteor.userId();
        var gameName = tmpl.find('#input-game-name').value;


        Meteor.call('createGame', gameName, owner, function (error, id) {
            console.log('er indsat');
            if (error)
                return alert(error.reason);
        })
        $("#jointhegame").modal("hide");

    }


});
