window.App = {};

window.onload = function() {
  App.libraryCollection = new App.LibraryCollection();
  new App.FormView( {collection: App.libraryCollection} );
  new App.LibraryView( {collection: App.libraryCollection} );
  new App.Router();    
}

App.Router = Backbone.Router.extend({
    ui: {},    
    routes: {
        ''     : 'index',
        'book/:cid': 'lookBook',

        '*other' : 'default'
    },

    initialize: function() {
      this.ui.bodyContent = $('body>*');
      this.ui.bookForm = $('#inputForm');
      this.ui.renderCollection = $('#renderCollection');
      this.ui.currentBook = $('#currentBook');

      Backbone.history.start();
    },

    index: function() {
      this.clear();
      this.ui.bookForm.show();
      this.ui.renderCollection.show();
    },

    lookBook: function(cid) {
      this.clear();
      this.ui.currentBook.empty();
      this.ui.currentBook.show();
      var model = App.libraryCollection.get(cid);
      //console.log(model);
      var bookView = new App.BookView( { model: model, id: cid } );
      this.ui.currentBook.append( bookView.render().el );
      
    },

    clear: function() {
      console.log( 'clear function' );
      this.ui.bodyContent.hide();
    },

    default: function ( other ) {
      console.log( 'default route: ' + other );
      $( 'body>*' ).hide();
    }
});


App.BookModel = Backbone.Model.extend({
  defaults: {
    autor: "Autor's name",
    title: "Book's title",
    year: 2000,
    remove: false
  },

  isntLetter: function( text ) {
    return /[0-9]/.exec(text);
  },

  isntNumber: function( text ) { 
    return /[a-zа-яё]/i.exec(text);
  },

  validate: function( attrs ) {
    if ( this.isntLetter(attrs.autor) ) {
      return 'Attribute AUTOR have numbers';
    }

    if ( this.isntLetter(attrs.title) ) {
      return 'Attribute TITLE have numbers';
    }

    if ( this.isntNumber(attrs.year) ) {
      return 'Attribute YEAR have letters';
    }
  }
});

App.BookView = Backbone.View.extend({
  tagName: 'li',
  ui: {},

  events: {
    "click a": "remove",
    "click": "openBook"
  },

  initialize: function() {
    this.render();
  },

  remove: function( event ) {
    this.model.set('remove', true);
    event.stopPropagation();

    return false;
  },

  openBook: function() {
    console.log( this.model.cid )
    document.location.assign( location.href + '#book/' + this.model.cid );
  },

  takeInLine: function() {
    return this.model.get( 'autor' ) + ' --- ' +
      this.model.get( 'title' ) + ' --- ' +
      this.model.get( 'year' ) + 
      "<a href='#' class='remove'> | Удалить |</a>";
  },

  render: function() {
    this.$el.html ( this.takeInLine() );

    return this;
  }
});

App.FormView = Backbone.View.extend({
  el: '#inputForm',
  ui: {}, //objcet for user variables

  events: {
    "keyup .autor": "setAutor",
    "keyup .title": "setTitle",
    "keyup .year": "setYear",
    "click .add": "addModelInCollection"
  },

  initialize: function() {
    this.ui.autor = this.$('.autor');
    this.ui.title = this.$('.title');
    this.ui.year = this.$('.year');

    this.createModel();
  },

  addModelInCollection: function() {
    this.collection.add( this.model );
    this.createModel();

    return false;
  },

  createModel: function() {
    this.model = new App.BookModel();
    this.model.on( 'invalid', function( model, error, options ){
      $(options.name+'Error').text( options.validationError );
    });
  },

  setAutor: function() {
    this.clear('.autorError');
    this.model.set( 'autor', this.ui.autor.val(), {validate:true, name:'.autor'} );
  },

  setTitle: function() {
    this.clear('.titleError');
    this.model.set( 'title', this.ui.title.val(), {validate:true, name:'.title'} );
  },

  setYear: function() {
    this.clear('.yearError');
    this.model.set( 'year', +this.ui.year.val(), {validate:true, name:'.year'} );
  },

  //clear ERROR message from the form
  clear: function(elem) {
    this.$(elem).text( '' );
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
    //"click li": "openBook"
  },

  initialize: function() {
    this.collection.on( 'add', this.render, this );
    this.collection.on( 'remove', this.render, this );
    this.collection.on( 'change:remove', this.remove, this );
  },

  remove: function( model ) {
    //console.log( model );
    this.collection.remove( model );
  },

  openBook: function( event ) {
    console.log( event )
    document.location.assign( location.href + '#book/' + event.target.id );

    return false;
  },

  render: function() {
    this.$el.empty();

    this.collection.each( function(book) {
      var bookView = new App.BookView( { model: book } );
      this.$el.append( bookView.render().el );
    }, this );

    return this;
  }  
});


