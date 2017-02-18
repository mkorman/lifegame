var Common = {};
Common.UrlParams = {};

Common.GetUrlParams = function  () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    while (match = search.exec(query)) {
        Common.UrlParams[decode(match[1])] = decode(match[2]);
    }
};

window.onpopstate = Common.GetUrlParams ();