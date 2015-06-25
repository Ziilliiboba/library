require.config({
  paths: {
    jquery : "../bower_components/jquery/dist/jquery.min",
    underscore : "../bower_components/underscore-amd/underscore-min",
    backbone : "../bower_components/backbone-amd/backbone-min",
    knockout : "../bower_components/knockout/dist/knockout.debug",
    epoxy : "../bower_components/backbone.epoxy/backbone.epoxy"
  },

  shim: {
    epoxy: {
      deps: ["backbone"],
      exports: "Backbone.Epoxy"
    }
  }
});

require(['library'], function(App) {
  App.libraryCollection = new App.LibraryCollection();
  new App.FormView( {collection: App.libraryCollection} );
  new App.LibraryView( {collection: App.libraryCollection} );
  new App.Router();
});