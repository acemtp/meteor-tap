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

* catch click events on tabs div

```
HTML: <div class="tabs">
```

* catch all the screen

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

* call method

```
JS: Meteor.call('tap');
```

* create method

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

* display in console that taps collection change when we click

```
BROWSER CONSOLE: Taps.findOne();
```

* display the content of the collection, auto sort by tap

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

* add meta for mobile (blocking resize)

```
HTML:
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes" />
```

* add simple client js lib

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

* let's user play http://tap.meteor.com

* add twitte auth

```
$ meteor add accounts-twitter
$ meteor add accounts-ui
```

```
HTML: {{> loginButtons}}<br>
```

* use userId

```
JS: var id = this.userId || "0";
```

* display username and lang

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

* display pic

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

* display nb users

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

* pub/sub all users, only needed fields

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

* cool layout

```
$ cp ../tapPlus.css .
$ cp ../tap.html .
```

* deploy again!

```
$ meteor deploy tap
```
