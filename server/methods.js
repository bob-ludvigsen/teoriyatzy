/**
 * Created by pfu on 25/08/14.
 */



Meteor.methods({



    createTheory: function(name, theory, weight,owner){

        var theoreticId = Theoretics.insert({
            "name": name,
            "theory": theory,
            "weight": weight,
            "owner": owner,
            "created":new Date().getTime()/*,
            "active": active*/
        });
        return theoreticId;
    },
    editTheory: function(cat, created, active){

        var quizId = Quizzes.insert({
            "category": cat,
            "created":created,
            "active": active});
        return quizId;
    },
    createGame: function(gameName,owner){

        var gameId = Quizzes.insert({
            "name": gameName,
            "owner": owner,

            "created":new Date().getTime()

        });
        return gameId;
    },
    joinGame: function(gameID, owner){

        var gameId = Quizzes.update({_id: gameID}, {"$push":{"players":owner}});
        return gameId;
    },
    startGame: function(gameID, owner){

        var gameId = Quizzes.update({_id: gameID}, {"$push":{"players":owner}});
        return gameId;
    },


    mailChangeTurn: function(id){
        //process.env.MAIL_URL="smtp://postmaster@sandbox0cbcbe15c9e346919a24fd77b3bd38d7.mailgun.org:9c92decdffcf3d1b8818e0b4c4afe2ae@smtp.mailgun.org:587/";
        //var inviter = Meteor.userId();
        var invited = Meteor.users.findOne({_id: id});
        var to = invited.emails[0].address;
        //console.log(to);
        var text = 'It´s your turn. Click this link to play: http://quizspil.fels.dk/mygames';

       Email.send({
            to: to,
            from: 'Forsvarets quiz spil <pfu-fu4@fak.dk>',
            subject: 'It´s your turn in the Naval English Quiz game',
            text: text
        });

    },
    mailInvitePlayer: function(id){

        var inviter = Meteor.userId();
        var finduser = Meteor.users.findOne({_id: inviter});
        var userName = finduser.username;

        var invited = Meteor.users.findOne({_id: id});
        var to = invited.emails[0].address;
        var text = 'You have been invited to play by ' + userName + '. Click this link to accept the challenge: http://quizspil.fels.dk/login';

        Email.send({
            to: to,
            from: 'Forsvarets quiz spil <pfu-fu4@fak.dk>',
            subject: 'Invitation to the Naval English Quiz game',
            text: text
        });

    },
    mailAcceptPlayer: function(id){

        var inviter = Meteor.userId();
        var finduser = Meteor.users.findOne({_id: inviter});
        var userName = finduser.username;

        var invited = Gamedata.findOne({_id: id});
        var findPlayer1 = invited.player1_id;
        var finduser1 = Meteor.users.findOne({_id: findPlayer1});

        var to = finduser1.emails[0].address;
        var text = userName + ' has accepted your challenge. Click this link to play: http://quizspil.fels.dk';

        Email.send({
            to: to,
            from: 'Forsvarets quiz spil <pfu-fu4@fak.dk>',
            subject: 'Accept of invitation',
            text: text
        });

    },

    deleteUser: function (userId) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, "You need to be an admin to delete a user.");

        if (user._id == userId)
            throw new Meteor.Error(422, 'You can\'t delete yourself.');

        // remove the user
        Meteor.users.remove(userId);
    },

    addUserRole: function (userId, role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, "You need to be an admin to update a user.");

        if (user._id == userId)
            throw new Meteor.Error(422, 'You can\'t update yourself.');

        // handle invalid role
        if (Meteor.roles.find({name: role}).count() < 1)
            throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

        // handle user already has role
        if (Roles.userIsInRole(userId, role))
            throw new Meteor.Error(422, 'Account already has the role ' + role);

        // add the user to the role
        Roles.addUsersToRoles(userId, role);
    },

    removeUserRole: function (userId, role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, "You need to be an admin to update a user.");

        if (user._id == userId)
            throw new Meteor.Error(422, 'You can\'t update yourself.');

        // handle invalid role
        if (Meteor.roles.find({name: role}).count() < 1)
            throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

        // handle user already has role
        if (!Roles.userIsInRole(userId, role))
            throw new Meteor.Error(422, 'Account does not have the role ' + role);

        Roles.removeUsersFromRoles(userId, role);
    },

    addRole: function (role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, "You need to be an admin to update a user.");

        // handle existing role
        if (Meteor.roles.find({name: role}).count() > 0)
            throw new Meteor.Error(422, 'Role ' + role + ' already exists.');

        Roles.createRole(role);
    },

    removeRole: function (role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, "You need to be an admin to update a user.");

        // handle non-existing role
        if (Meteor.roles.find({name: role}).count() < 1)
            throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

        if (role === 'admin')
            throw new Meteor.Error(422, 'Cannot delete role admin');

        // remove the role from all users who currently have the role
        // if successfull remove the role
        Meteor.users.update(
            {roles: role},
            {$pull: {roles: role}},
            {multi: true},
            function (error) {
                if (error) {
                    throw new Meteor.Error(422, error);
                } else {
                    Roles.deleteRole(role);
                }
            }
        );
    },

    updateUserInfo: function (id, property, value) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, "You need to be an admin to update a user.");

        if (property !== 'profile.name')
            throw new Meteor.Error(422, "Only 'name' is supported.");

        obj = {};
        obj[property] = value;
        Meteor.users.update({_id: id}, {$set: obj});

    },
    clientEditUser: function (email, username, firstname, lastname, nat, service) {

        var user = Meteor.user();
        //console.log('brugernavn: '+user._id)
        Meteor.users.update({_id:user._id},{$set:{
            email: email,
            profile: {

                firstname: firstname,
                lastname: lastname,
                nationality: nat,
                Service: service

            },
            username: username
        }

        });

    },
    'deleteFile': function(nameid, id) {
        //check(nameid, String);
//console.log(nameid)
        var upload = Uploads.findOne({url:nameid});
        if (upload == null) {
            throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
        }

        UploadServer.delete(upload.path);
        Uploads.remove({url:nameid});

    },
    'usedQuestionArr': function(id, cat, indexed) {
        //check(nameid, String);
        var catNoSpace = "p1question"+cat.replace(/\s/g, "")
        var catData = {};
        catData[catNoSpace]= indexed;

        console.log('ID ' + id + ' categori: ' + catNoSpace + ' index ' + indexed);

        Gamedata.update({_id: id,}, {$push: catData},
            { upsert: true });

    }




});


Accounts.config({
    //sendVerificationEmail: true
    //forbidClientAccountCreation: false
});

Meteor.startup(function() {
    // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
    Accounts.emailTemplates.from = 'Forsvarets quiz spil <pfu-fu4@fak.dk>';
    // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
    Accounts.emailTemplates.siteName = 'Forsvarets quiz spil';
    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function(user) {
        return 'Bekræft din emailadresse';
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
        return 'Klik på dette link for at verificere denne email adresse tilhører dig: ' + url;
    };

    // init items collection
    /*if (Items.find().count() == 0) {
        Items.insert({name: 'My Item', uploads: []});
    }*/


});
