window.App = {};

window.onload = function() {

}

App.BookModel = Backbone.Model.extend({
  defaults: {
    autor: '',
    title: '',
    year: ''
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