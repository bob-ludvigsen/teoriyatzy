/**
 * Created by pfu on 21/08/14.
 */
Template.inviteplayer.helpers({
    players: function () {
        return filteredFrontUserQuery(Meteor.userId(), Session.get("userFilter"));

        /*var player = Meteor.users.find({}, {sort: {username: 1}}).fetch();

        return player;*/
    },
    counter: function(){
        return Meteor.users.find().count();
    },
    invitations: function () {

        var player = Meteor.userId();

        var myinvitations = Gamedata.find({player1_id: player, "accepted": false}).fetch();

        return myinvitations;


    },
    searchFilter: function() {
        return Session.get("userFilter");
    },
    myself: function (userId) {
        return Meteor.userId() === userId;
    },
    invites: function () {
        var player = Meteor.userId();

        var myinvites = Gamedata.find({player2_id: player, pending: true}).fetch();
        //alert(myinvitations)
        return myinvites;


    }


});

// search no more than 2 times per second
var setUserFilter = _.throttle(function(template) {
    var search = template.find(".search-input-filter").value;
    Session.set("userFilter", search);
}, 500);

Template.inviteplayer.events({
    'keyup .search-input-filter': function(event, template) {
        setUserFilter(template);
        return false;
    },
    'click .pickplayer': function (e, template) {
        //console.log(this._id);
        e.preventDefault();
        var invitedId = this._id;
        Meteor.call('game', invitedId, function (error, id) {
            if (error)
                return alert(error.reason);
        }),
            Meteor.call('mailInvitePlayer', invitedId, function (error, id) {
                if (error)
                    return alert(error.reason);
            })

    },
    'click .deleteinvitation': function (e, template) {
        //alert(this._id);
        Gamedata.remove({_id: this._id});
    },
    'click .acceptinvitation': function (e, template) {
        //alert(this._id);
        var invitedId = this._id;

        Gamedata.update({_id: this._id}, {
            $set: {pending: false, accepted: true}

        })

        Meteor.call('mailAcceptPlayer', invitedId, function (error, id) {
            if (error){
                return alert(error.reason);
            }
            else{
                Router.go('mygames');
            }

        })

    }
});

Template.inviteplayer.rendered = function() {
    var searchElement = document.getElementsByClassName('search-input-filter');
    if(!searchElement)
        return;
    var filterValue = Session.get("userFilter");

    var pos = 0;
    if (filterValue)
        pos = filterValue.length;

    searchElement[0].focus();
    searchElement[0].setSelectionRange(pos, pos);
};