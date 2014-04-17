meteor-tap
==========

tap tap made with meteor for devoxx 2014 conference live coding.

Here is the step by step live conding

* create app

```
$ meteor create tap
$ cd tap
$ meteor
```

* create collection

```
JS: Taps = new Meteor.Collection('taps');
```

* create tabs div

```
HTML: <div class="tabs">
```

* make the div take all the screen so we catch all the click events

```
CSS:
  .taps {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    -webkit-user-select: none;
  }
```

* catch click and double click events on the div

```
  Template.taps.events({
    'dblclick .taps, click .taps': function () {
    }
  });
```

* call remote method

```
JS: Meteor.call('tap');
```

* create method (lag compensation, ...)

```
JS:
  Meteor.methods({
    tap: function() {
      var id = "0";
      if(Taps.findOne(id))
        Taps.update(id, {$inc: {tap: 1}});
      else
        Taps.insert({_id: id, tap: 1});
    }
  });
```

* display in console that taps collection changes when we click

```
BROWSER CONSOLE: Taps.findOne();
```

* display the content of the collection, sort by tap (auto sort)

```
HTML:
  {{#each taps}}
    {{tap}}<br>
  {{/each}}
```

```
JS:
  Template.taps.taps = function () {
    return Taps.find({}, {sort: {tap: -1}});
  };
```

* add meta for mobile (no scale, device width)

```
HTML:
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes" />
```

* add simple client js lib to handle clicks correctly and quickly on mobile

```
$ mkdir -p client/compatibility
$ cp ../fastclick.js client/compatibility
```

```
JS: Meteor.startup(function () { FastClick.attach(document.body); });
```

* deploy on meteor.com

```
$ meteor deploy tap
```

* let's users play http://tap.meteor.com

* add twitter auth

```
$ meteor add accounts-twitter
$ meteor add accounts-ui
```

```
HTML: {{> loginButtons}}<br>
```

* use userId to differentiate users

```
JS: var id = this.userId || "0";
```

* display user name and lang

```
HTML: <a href="http://twitter.com/{{username}}">@{{username}}</a> - {{tap}}<br>
```

```
JS:
  Template.taps.username = function () {
    var u = Meteor.users.findOne(this._id);
    if(u && u.services) return u.services.twitter.screenName;
    else return "Anne Onymous";
  };
  Template.taps.userlang = function () {
    var u = Meteor.users.findOne(this._id);
    if(u && u.services) return u.services.twitter.lang;
    else return "??";
  };
```

* display user pic

```
HTML: <img src="{{userpic}}"> <a href="http://twitter.com/{{username}}">@{{username}}</a> - {{tap}}<br>
```

```
JS:
  Template.taps.userpic = function () {
    var u = Meteor.users.findOne(this._id);
    if(u && u.services) return u.services.twitter.profile_image_url;
  };
```

* display user count

```
HTML: {{totalusers}} users have been logged<br>
```

```
JS:
  Template.taps.totalusers = function () {
    return Meteor.users.find().count();
  }
```

* security

```
$ meteor remove insecure
$ meteor remove autopublish
```

* pub/sub taps

```
JS (server):
  Meteor.publish('taps', function () {
    return Taps.find({});
  });
```

```
JS: Meteor.subscribe('taps');
```

* pub/sub all users but only mandatory fields

```
JS (server):
  Meteor.publish('allUsers', function () {
    return Meteor.users.find({}, {fields: {
      'services.twitter.lang': 1,
      'services.twitter.screenName': 1,
      'services.twitter.profile_image_url': 1,
    }});
  });
```

```
JS: Meteor.subscribe('allUsers');
```

* cool layout (optional)

```
$ cp ../tapPlus.css .
$ cp ../tap.html .
```

* deploy again!

```
$ meteor deploy tap
```

* let's users play http://tap.meteor.com
