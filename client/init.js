/**
 * Created by bob on 04/03/15.
 */
Meteor.startup(function() {
    Uploader.finished = function(index, file) {
     //alert()
     //console.log(file.url)
     Uploads.insert(file);
     }
var lang = window.navigator.language;
    if (lang === "da" || lang === "da-DK"){
        TAPi18n.setLanguage('da')
    }
    else{
        TAPi18n.setLanguage('en')
    }
});

