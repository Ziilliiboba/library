window.App = {};

window.onload = function() {
  App.bookModel = new App.BookModel();
  App.bookModel2 = new App.BookModel();   //to test
  App.bookView = new App.BookView( {model: App.bookModel} );
  App.formView = new App.FormView( {model: App.bookModel} );
  App.libraryCollection = new App.LibraryCollection( [App.bookModel, App.bookModel2] );   //to test
  App.libraryView = new App.LibraryView( {collection: App.libraryCollection} );
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

App.FormView = Backbone.View.extend({
  el: '#inputForm',

  events: {
    "keyup .autor": "setAutor",
    "keyup .title": "setTitle",
    "keyup .year": "setPYear"
  },

  initialize: function() {
    this.model.on( 'invalid', function(model, error, options){
      this.$el.find(options.name+'Error').text( options.validationError );
      console.log( options );
    });
  },

  setAutor: function() {
    this.clear('.autorError');
    this.model.set( 'autor', this.$('.autor').val(), {validate:true, name:'.autor'});
  },

  setTitle: function() {
    this.clear('.titleError');
    this.model.set( 'title', this.$('.title').val(), {validate:true, name:'.title'});
  },

  setYear: function() {
    this.clear('.yearError');
    this.model.set( 'year', '' + this.$('.year').val(), {validate:true, name:'.year'});
  },

  clear: function(elem) {
    this.$el.find(elem).text( '' );
  },

  render: function() {
    return this;
  }
});

App.LibraryCollection = Backbone.Collection.extend({
  model: App.BookModel
});

App.LibraryView = Backbone.View.extend({
  tagName: 'ul',

  initialize: function() {
    this.render();
    $('body').append(this.$el);
  },

  render: function() {
    console.log(this.collection);
    this.collection.each( function(book) {
      var bookView = new App.BookView({model: book});
      console.log(bookView);
      this.$el.append(bookView.render().el);
    }, this );
    return this;
  }  
});






