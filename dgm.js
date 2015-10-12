function callGood() {
  Meteor.call('getGood', function(error, result){
    if (error) {
      console.log("error", error);
    };
    Session.set("good", result);
  });

  Meteor.call('getGoodImage', function(error, result) {
    Session.set("image", result);
  });

  Meteor.call('getGratitudeImage', function(error, result) {
    Session.set("gimage", result);
  });
}

Gratitudes = new Mongo.Collection("gratitudes");

if (Meteor.isClient) {
  callGood();


  Template.good.helpers({
      goodquote: function() {
        return Session.get("good");
      },
      goodimage: function() {
        return Session.get("image");
      },
      gratitudeimage: function() {
        return Session.get("gimage");
      },
      gratitudes: function() {
          return Gratitudes.find({});
      }
    });

    Template.good.events({
      'click button': function () {
        callGood();
      },
      "submit .new-gratitude": function(event) {
        event.preventDefault();

        // Get value from form element
        var text = event.target.text.value;
        console.log(text);
        // Insert  into the collection
        Gratitudes.insert({
          text: text,
          createdAt: new Date(), // current time
          owner: Meteor.userId(),
          username: Meteor.user().username
        });

        // Clear form
        event.target.text.value = "";
      }
    });
    Template.user.helpers({
      firstName: function() {
        return Meteor.user().profile.first_name;
      }
    })
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var cheerio = Meteor.npmRequire('cheerio');
    Meteor.methods( {
      getGood: function() {
        result = Meteor.http.get("http://www.dailygood.org/");
        $ = cheerio.load(result.content);
        var resp =  $('span', "#rightstrip").first().text();
        return resp;
      },
      getGoodImage: function() {
        var i = Math.floor((Math.random() * 13) + 1);
        return "http://www.dailygood.org/pics/dg_images/service/" + i +".jpg";
      },
      getGratitudeImage: function() {
        return "http://www.dailygood.org/pics/dg_images/service/7.jpg";
      }
    });
  });
}
