function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "oldalmenu") {
      x.className += " responsive";
    } else {
      x.className = "oldalmenu";
    }
  
    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop;
  
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  }
  
  var toggleIcon = document.getElementById("toggle-icon");
  toggleIcon.addEventListener("click", myFunction);
  
  window.onscroll = function() { myFunction() };
  





  function setActiveStyleSheet(title) {
    var i, a, main;
    for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
      if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
        a.disabled = true;
        if(a.getAttribute("title") == title) a.disabled = false;
      }
    }
  }
  
  function getActiveStyleSheet() {
    var i, a;
    for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
      if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
    }
    return null;
  }
  
  function getPreferredStyleSheet() {
    var i, a;
    for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
      if(a.getAttribute("rel").indexOf("style") != -1
         && a.getAttribute("rel").indexOf("alt") == -1
         && a.getAttribute("title")
         ) return a.getAttribute("title");
    }
    return null;
  }
  
  
  window.onload = function(e) {
    var cookie = readCookie("style");
    var title = cookie ? cookie : getPreferredStyleSheet();
    setActiveStyleSheet(title);
  }
  
  window.onunload = function(e) {
    var title = getActiveStyleSheet();
    createCookie("style", title, 365);
  }