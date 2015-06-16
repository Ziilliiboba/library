window.App = {};

window.onload = function() {
  App.bookModel = new App.BookModel();
  App.bookView = new App.BookView({model: App.bookModel});
}

App.BookModel = Backbone.Model.extend({
  defaults: {
    autor: "Autor's name",
    title: "Book's title",
    year: 2000
  },

  validate: function( attrs ) {
    console.log(attrs);
 
    if ( ! attrs.autor ) {
      return 'Attribute AUTOR is not filled';
    }

    if ( ! attrs.title ) {
      return 'Attribute TITLE is not filled';
    }

    if ( ! attrs.year ) {
      return 'Attribute YEAR is not filled';
    } 
  }
});

App.BookView = Backbone.View.extend({
  tagName: 'li',

  initialize: function() {
    this.render();
  },

  takeInLine: function() {
    return this.model.get('autor') + '    ' +
      this.model.get('title') + '   ' +
      this.model.get('year');
  },

  render: function() {
    this.$el.html ( this.takeInLine() );
    return this;
  }
});

App.LibraryCollection = Backbone.Collection.extend({
  model: App.BookModel
});