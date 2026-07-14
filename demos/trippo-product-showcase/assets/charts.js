(function() {
  var tabs = Array.from(document.querySelectorAll('[data-scene]'));
  var scenes = Array.from(document.querySelectorAll('.scene'));

  function activate(id) {
    tabs.forEach(function(tab) {
      tab.classList.toggle('active', tab.getAttribute('data-scene') === id);
    });
    scenes.forEach(function(scene) {
      scene.classList.toggle('active', scene.id === id);
    });
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      activate(tab.getAttribute('data-scene'));
    });
  });
})();
