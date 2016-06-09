_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var Post = Backbone.Model.extend({});
var Posts = Backbone.Collection.extend({
  model: Post,
  url: "/posts"
});

var PostView = Backbone.View.extend({
  template: _.template($("#postView").html()),
  events: {
    'click a': 'handleClick'
  },
  render: function(){
    var model = this.model.toJSON();
    model.pubDate = new Date(Date.parse(model.pubDate)).toDateString();
    this.el.innerHTML = this.template(model);
    return this;
  },
  handleClick: function(e){
    e.preventDefault();
    postRouter.navigate($(e.currentTarget).attr("href"),
      {trigger: true});
    return false;
  }
});

var PostListView = Backbone.View.extend({
  tagName: "li",
  template: _.template("<a href='/posts/{{id}}'>{{title}}</a>"),
  render: function(){
    this.el.innerHTML = this.template(this.model.toJSON());
    return this;
  },
  events: {
    'click a': "handleClick"
  },
  handleClick: function(e){
    e.preventDefault();
    postRouter.navigate($(e.currentTarget).attr("href"),
      {trigger: true});
  }
});

var PostsListView = Backbone.View.extend({
  template: _.template("<h1>My Blog</h1><ul></ul>"),
  render: function(){
    this.el.innerHTML = this.template();
    var ul = this.$el.find("ul");
    this.collection.forEach(function(post){
      ul.append(new PostListView({
        model: post
      }).render().el);
    })
    return this;
  }
});

var PostFormView = Backbone.View.extend({
  tagName: 'form',
  template: _.template($("#postFormView").html()),
  initialize: function(options){
    this.posts = options.posts
  },
  events: {
    'click button': 'createPost'
  },
  render: function(){
    this.el.innerHTML = this.template();
    return this;
  },
  createPost: function(e){
    var postAttrs = {
      content: $("#postText").val(),
      title: $("#postTitle").val(),
      pubDate: new Date()
    };
    this.posts.create(postAttrs);
    postRouter.navigate("/", {trigger: true});
    return false;
  }
});

var PostRouter = Backbone.Router.extend({
  initialize: function(options){
    this.posts = options.posts;
    this.main = options.main;
  },
  routes: {
    '': 'index',
    'posts/new': 'newPost',
    'posts/:id': 'singlePost'

  },
  index: function(){
    var pv = new PostsListView({collection: this.posts})
    this.main.html(pv.render().el);
  },
  singlePost: function(id){
    var post = this.posts.get(id);
    var pv = new PostView({model: post});
    this.main.html(pv.render().el);
  },
  newPost: function(){
    var pfv = new PostFormView({ posts: this.posts });
    this.main.html(pfv.render().el);
  }
});
