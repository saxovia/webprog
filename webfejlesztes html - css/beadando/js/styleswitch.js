function toggleTheme(value) {
  
    if (theme.getAttribute('href') == './css/nagybetus.css') {
        theme.setAttribute('href', './css/alap.css');
    } else {
        theme.setAttribute('href', './css/nagybetus.css');
    }
}