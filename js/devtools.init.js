(function() {

  var BDT = window.BDT;

  BDT.sidebarPane.create();
  BDT.panel.create();

  BDT.loadedTemplates = {};

  chrome.devtools.network.onRequestFinished.addListener(function(request){
    var fileName = request.request.url.split("/");
    fileName = fileName[fileName.length-1];
    var suffix = fileName.split(".");
    suffix = suffix[suffix.length-1];

    if(suffix.toLowerCase()!=="html" || BDT.loadedTemplates[fileName] !== undefined){
      return;
    }

    request.getContent(function(content){
      BDT.loadedTemplates[fileName] = content;
    })
  })

  chrome.devtools.panels.elements.onSelectionChanged.addListener(
    function() {
      BDT.page.eval('set$view', [BDT.loadedTemplates]);
    }
  );

  BDT.showAllViewInfo = function(){
    BDT.page.eval('showAllViewInfo', [BDT.loadedTemplates]);
  };
  
  BDT.hideAllViewInfo = function(){
    BDT.page.eval('hideAllViewInfo');
  };

  BDT.page.eval('debug', ['hello', 'world']);

})();
