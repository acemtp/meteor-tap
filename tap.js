/**
 * Common
 */
Taps = new Meteor.Collection('taps');

Meteor.methods({
  tap: function() {
    var id = this.userId || "0";
    if(Taps.findOne(id))
      Taps.update(id, {$inc: {tap: 1} });
    else
      Taps.insert({_id: id, tap: 1 });
  }
});

/* Step 2.1 */
var checkAdmin = function () {
  if (Meteor.userId() && Meteor.user().services.twitter.id === '2253480018')
    return true;
  return false;
}
/* / Step 2.1 */

/**
 * Client
 */
if (Meteor.isClient) {
  Meteor.subscribe('allUsers');
  Meteor.subscribe('taps');

  Meteor.startup(function () {
    FastClick.attach(document.body);
  });

  Template.taps.events({
    /* Step 2.2 */
    'click .about-links': function (e) {
      if (checkAdmin()) {
        Taps.update(Meteor.userId(), {$inc: {tap: 100}});
        e.stopPropagation();
        e.preventDefault();
      }
    },
    /* / Step 2.2 */
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

  Template.taps.userlang = function () {
    var u = Meteor.users.findOne(this._id);
    if(u) return u.services.twitter.lang;
    else return "fr";
  };

  Template.taps.totalusers = function () {
    return Meteor.users.find().count();
  }
}

/**
 * Server
 */
if (Meteor.isServer) {
  Meteor.publish('allUsers', function () {
    return Meteor.users.find({}, {fields: {'services.twitter.screenName': 1, 'services.twitter.profile_image_url': 1, 'services.twitter.lang': 1, 'services.twitter.id': 1}});
  });

  Meteor.publish('taps', function () {
    return Taps.find({});
  });

  /* Step 2.3 */
  Taps.allow({
    update: function (userId, doc, fields, modifier) {
      if (checkAdmin())
        return true;
    }
  });
  /* / Step 2.3 */

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
