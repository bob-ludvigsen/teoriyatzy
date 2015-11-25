/**
 * Created by bob on 13/11/14.
 */
Meteor.startup(function() {
    Deps.autorun(function(e) {
        Meteor.subscribe('filteredUsers', Session.get('userFilter'));
    });
});