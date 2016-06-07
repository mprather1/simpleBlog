_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var Post = Backbone.Model.extend({});
var Posts = Backbone.Collection.extend({
  model: Post,
  url: "/posts"
});

var PostListView = Backbone.View.extend({
  tagName: "li",
  template: _.template("a href='/posts/{{id}}'>{{title}}</a>"),
  render: function(){
    this.el.innerHTML = this.template(this.model.toJSON());
    return this;
  }
});
