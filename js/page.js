(function() {

  var BDT = window.BDT;

  BDT.page = {
  
    // helpers for evaluating JS code in the context of inspected page

    eval: function(scriptName, args, callback) {
      args = args || [];
      var paramsString = args.map(JSON.stringify).join(",")

      chrome.devtools.inspectedWindow.eval(
        "(" + BDT.page[scriptName].toString() + ")(" + paramsString + ")",
        callback
      );
    },

    // functions to be executed in the context of inspected page

    getBackboneViews: function() {
      var tree = { __proto__: null };

      // get jQuery/Zepto
      var $ = window.Backbone && window.Backbone.$ || window.jQuery || window.Zepto;
      if (!($ && $0)) return tree;

      // Backbone jQuery extension is required
      if (typeof $.fn.backbone != 'function') return tree;

      // display elemens as eg. div#todoapp
      function pretty(elem) {
        return elem.tagName.toLowerCase() + (elem.id && ("#" + elem.id));
      }

      // we need to prefix element names if we want to preserve the order
      var index = 0;

      // start with currently selected DOM Element
      var elem = $($0);
      tree[index + ' ' + pretty(elem[0])] = elem.backbone();

      // go up the Backbone Views tree
      while (true) {
        var parentView = elem.backbone('parent')
        if (!parentView) break;
        elem = parentView.$el;
        tree[++index + ' ' + pretty(elem[0])] = parentView;
      }

      return tree;
    },

    debug: function(){
      console.log.apply(console, arguments);
    },

    set$view: function(loadedTemplates) {
      // get jQuery/Zepto
      var $ = window.Backbone && window.Backbone.$ || window.jQuery || window.Zepto;
      if (!($ && $0)) return;

      // Backbone jQuery extension is required
      if (typeof $.fn.backbone != 'function') return;
      window.$view = $($0).backbone('closest');
      for(var i=0;i < document.getElementsByClassName("bdt-highlight").length;i++){
        var el = document.getElementsByClassName("bdt-highlight")[i];
        el.className = el.className.replace(/\bbdt-highlight\b/, '');
      };

      window.$view.$el.addClass("bdt-highlight");

      var tmplName = "";
      for(var tmpl in loadedTemplates){
        if(loadedTemplates[tmpl]===window.$view.template){
          tmplName = tmpl;
          break;
        }
      }

      for(var i=0;i < document.getElementsByClassName("bdt-info").length;i++){
        var el = document.getElementsByClassName("bdt-info")[i];
        el.parentNode.removeChild(el);
      };

      window.$view.$el.prepend("<div class='bdt-info'>"+ tmplName+"</div>");
    },


    showAllViewInfo: function(loadedTemplates){
      console.log("show all views");

      var $ = window.Backbone && window.Backbone.$ || window.jQuery || window.Zepto;
      var views = [];
      $("*").each(function(index, view){
        if($(view).data('_backbone_view')){
          views.push(view);
        };
      });

      console.log("views", views);
      for(var i=0;i<views.length; i++){
        var view = views[i];
        $(view).addClass("bdt-highlight");

        var tmplName = "";
        for(var tmpl in loadedTemplates){
          if(loadedTemplates[tmpl]===window.$view.template){
            tmplName = tmpl;
            break;
          }
        }
        $(view).prepend("<div class='bdt-info'>tmpl"+ tmplName+"</div>");
      }
    },

    hideAllViewInfo: function(){
      var $ = window.Backbone && window.Backbone.$ || window.jQuery || window.Zepto;
      $(".bdt-highlight").removeClass("bdt-highlight");
      $(".bdt-info").remove();
    }, 

    isBackboneDebugReachable: function() {
      return window.Backbone && window.Backbone.debug && true;
    },

    isLoggerReachable: function() {
      return typeof window.Backbone.debug.logger.getData === 'function';
    },

    getData: function(type, fromIndex, limit) {
      return window.Backbone.debug.logger.getData(type, fromIndex, limit);
    },

    clearData: function(type) {
      window.Backbone.debug.logger.clearData(type);
    },

    enableInjection: function() {
      window.sessionStorage['_backbone_debug_injection'] = 'enabled';
    },

    disableInjection: function() {
      window.sessionStorage.removeItem('_backbone_debug_injection');
    },

    isInjectionEnabled: function() {
      return window.sessionStorage['_backbone_debug_injection'] === 'enabled';
    },

    updateTimeout: function(ms) {
      window.sessionStorage['_backbone_debug_injection_timeout'] = String(ms);
    },

    getTimeout: function() {
      return window.sessionStorage['_backbone_debug_injection_timeout'];
    }

  };

})();
