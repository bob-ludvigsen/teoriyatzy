/**
 * Created by pfu on 20/08/14.
 */

Template.menu.events({
    'click #login-dropdown-list': function (event) {
        //alert('klikket');
        $(".dropdown").addClass("open");
        if ($(".dropdown").hasClass("open")) {
            $(".dropdown").removeClass("open");
        }
        else {
            $(".dropdown").addClass("open");
        }

    },


});
