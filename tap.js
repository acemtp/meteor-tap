Taps = new Meteor.Collection('taps');

if (Meteor.isClient) {
  Meteor.subscribe('allUsers');
  Meteor.subscribe('taps');

  Meteor.startup(function () {
    FastClick.attach(document.body);
  });

  Template.taps.events({
    'dblclick .taps, click .taps': function () {
      Meteor.call('tap');
    }
  });

  Template.taps.taps = function () {
    return Taps.find({}, {sort: {tap: -1}});
  };

  Template.taps.username = function () {
    var u = Meteor.users.findOne(this._id);
    if(u) return u.services.twitter.screenName;
    else return "Anne Onimous";
  };

  Template.taps.userpic = function () {
    var u = Meteor.users.findOne(this._id);
    if(u) return u.services.twitter.profile_image_url;
  };
}

Meteor.methods({
  tap: function() {
    var id = this.userId || "0";
    if(Taps.findOne(id))
      Taps.update(id, {$inc: {tap: 1} });
    else
      Taps.insert({_id: id, tap: 1 });
  }
});

if (Meteor.isServer) {
  Meteor.publish('allUsers', function () {
    return Meteor.users.find({}, {fields: {'services.twitter.screenName': 1, 'services.twitter.profile_image_url': 1}});
  });

  Meteor.publish('taps', function () {
    return Taps.find({});
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
