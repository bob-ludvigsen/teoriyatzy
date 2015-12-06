/**
 * Created by pfu on 27/05/14.
 */



Meteor.startup(function () {
    // bootstrap the admin user if they exist -- You'll be replacing the id later
    if (Meteor.users.findOne("dRFByMj7okt4yxPQx"))
        Roles.addUsersToRoles("dRFByMj7okt4yxPQx", ['admin']);

    // create a couple of roles if they don't already exist (THESE ARE NOT NEEDED -- just for the demo)
    if(!Meteor.roles.findOne({name: "secret"}))
        Roles.createRole("secret");

    if(!Meteor.roles.findOne({name: "double-secret"}))
        Roles.createRole("double-secret");
});
