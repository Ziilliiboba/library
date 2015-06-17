window.App = {};

window.onload = function() {
  App.libraryCollection = new App.LibraryCollection();
  App.formView = new App.FormView( {collection: App.libraryCollection} );
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
  }
});

//using only to render model in <li>DATA</li>
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
    "keyup .year": "setYear",
    "click .add": "addModelInCollection"
  },

  initialize: function() {
    this.model = new App.BookModel();

    this.model.on( 'invalid', function(model, error, options){
      this.$el.find(options.name+'Error').text( options.validationError );
    });
  },

  addModelInCollection: function() {
    this.collection.add( this.model );
    this.model = new App.BookModel();

    return false;
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
    this.model.set( 'year', this.$('.year').val(), {validate:true, name:'.year'});
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
  el: '#library',

  events: {
    "click li": "remove"
  },

  initialize: function() {
    this.collection.on( 'add', this.render, this );
    this.render();
    this.render();
  },

  remove: function( event ) {
    this.collection.remove( event.target.id );

    this.render();
  },

  render: function() {
    this.$el.empty();

    this.collection.each( function(book) {
      var bookView = new App.BookView({model: book, id: book.cid});
      this.$el.append(bookView.render().el);
    }, this );

    return this;
  }  
});






