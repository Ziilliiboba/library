define(['epoxy', 'knockout'], function() {

  var App = {};

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
        var bookView = new App.BookView( { model: model} );
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


  App.BookModel = Backbone.Epoxy.Model.extend({
    defaults: {
      autor: "Autor's name",
      title: "Book's title",
      year: 2000,
      
      remove: false
    },

    computeds: {
      textYear: {
        deps: ["year"],
        get: function( year ){
          return year + ' г.';
        },
        set: function( value ){
          return {year: parseInt(value.replace(" г.", ""))}
        }
      },

      //may be this metod can be realisated like path of the metod BookView.render
      inLineDescription: {
        deps: ["autor", "title", "textYear"],
        get: function( autor, title, textYear ) {
          return autor + ' --- ' + title + ' --- ' + textYear;
        }
      }
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

  App.BookView = Backbone.Epoxy.View.extend({
    el: "<li><p></p><a href='#' class='remove'> | Удалить |</a></li>",
    ui: {},

    bindings: {
      'p': "text:inLineDescription"
    },
    bindingHandlers: {
      removeBook: function() {
        this.model.set('remove', true);
        event.stopPropagation();

        return false;
      },

      openBook: function() {
        document.location.assign( location.href + '#book/' + this.model.cid );
      }
    },

    events: {
      "click .remove": "remove",
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
      document.location.assign( location.href + '#book/' + this.model.cid );
    },

    render: function() {

      return this;
    }
  });

  App.FormView = Backbone.Epoxy.View.extend({
    el: '#inputForm',
    model: new App.BookModel(),

    bindings: {
      "input.autor": "value:autor,events:['keyup']",
      "input.title": "value:title,events:['keyup']",
      "input.year": "value:year,events:['keyup']",

      "p.autorNon": "text:'Поле АВТОР не заполнено',toggle:not(autor)",
      "p.titleNon": "text:'Поле НАЗВАНИЕ КНИГИ не заполнено',toggle:not(title)",
      "p.yearNon": "text:'Поле ГОД ИЗДАНИЯ не заполнено',toggle:not(year)",

      "p.autorError": "text:'Поле АВТОР содержит цифры',toggle:isntLetter(autor)",
      "p.titleError": "text:'Поле НАЗВАНИЕ КНИГИ содержит цифры',toggle:isntLetter(title)",
      "p.yearError": "text:'Поле ГОД ИЗДАНИЯ содержит буквы',toggle:isntNumber(year)"
    },

    bindingFilters: {
      isntLetter: function( text ) {
        return /[0-9]/.exec(text);
      },

      isntNumber: function( text ) { 
        return /[a-zа-яё]/i.exec(text);
      }
    },

    events: {
      "click .add": "addModelInCollection"
    },

    initialize: function() {
    },

    addModelInCollection: function() {
      this.collection.add( this.model.clone() );

      return false;
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

    initialize: function() {
      this.collection.on( 'add', this.render, this );
      this.collection.on( 'remove', this.render, this );
      this.collection.on( 'change:remove', this.remove, this );
    },

    remove: function( model ) {
      //console.log( model );
      this.collection.remove( model );
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

  return App;
});

