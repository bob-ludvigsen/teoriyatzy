/**
 * Created by pfu on 21/08/14.
 */


Session.setDefault("loginRegister", true)

Template.login.helpers({

    uppercase: function(){
        return this.toUpperCase();
    },
    toggleLogin: function(){

        return Session.get("loginRegister");

    },

    email: function() {
        //var mail = Meteor.users.findOne(Meteor.userId());

       // return Meteor.user().emails[0].address;
        //return mail.emails[0].address;
        //var user is the same info as would be given in Meteor.user();
    },
    user: function(){

       // var user = Meteor.users.findOne(Meteor.userId());
      //  return user;

    }
});





Template.login.events({



    'submit #login-form': function(event, tmpl){
        //console.log('Changing language');
        event.preventDefault();

        // retrieve the input field values
        var email = tmpl.find('#inputEmail').value;
            var password = tmpl.find('#inputPassword').value;

        Meteor.loginWithPassword(email, password, function(err){
            if (err){
                alert(err)
            }
            // The user might not have been found, or their passwword
            // could be incorrect. Inform the user that their
            // login attempt has failed.

            // The user has been logged in.
            else{}

        });
        return false;
    },

    'click a.setlang': function(event){
        //console.log('Changing language');
        event.preventDefault();
        var currTarg = event.currentTarget;
        var lang = currTarg.id.slice(5); // Skips 'lang-'
        T9n.setLanguage(lang);
    },


    'click #signOut': function(event){
        event.preventDefault();
        Meteor.logout();
    },
    'click #register': function(event){
        event.preventDefault();
        Session.set("loginRegister", false);

    },
    'click #login': function(event){
        event.preventDefault();
        Session.set("loginRegister", true);


    },


    'click #create-user': function(evt, tmpl) {
        var verifiedEmail = false;
        var verifiedUsername = false;
        var email = tmpl.find('#input-email').value;
        var username = tmpl.find('#input-username').value;
        var password = tmpl.find('#account-password').value;
        var firstname = tmpl.find('#input-firstname').value;
        var lastname = tmpl.find('#input-lastname').value;
        //var nat = tmpl.find('#input-nat').value;
        var service = tmpl.find('#input-service').value;


        //alert(cvr);

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(email)) {
            verifiedEmail = true
            $('#hidethealert').addClass('hide');
        } else {

            $('#hidethealert').removeClass('hide');
            return false;
        }
        if(username.length > 0){
            verifiedUsername = true;
            $('#hidetuserNamehealert').addClass('hide');

        }
        else{
            $('#hidetuserNamehealert').removeClass('hide');
            return false;
        }

        if(verifiedEmail){
            Accounts.createUser(
                {
                    email: email,
                    password : password,
                    profile: {

                        firstname: firstname,
                        lastname: lastname,
                        Service: service

                    },
                    username: username
                }

               , function(err){
                if (err) {
                    console.log(err);
                    // Inform the user that account creation failed
                } else {
                    // Success. Account has been created and the user
                    // has logged in successfully.
                    console.log('success!');
                }

            });

            return false;


            /*var r = confirm("Sure you want to change the information?");
            if (r == true) {
                Meteor.call('clientEditUser', email, username, firstname, lastname, nat, service, function(error) {
                    if (error) {
                        // display the error to the user
                        console.log(error);
                        //alert(error);

                    } else {
                        // Router.go('myadds');
                    }
                });
            }*/
        }




    },

    'click .cancel': function(evt, tmpl) {

        Router.go('/');
    }


});

// TODO glemt adgangskode"
