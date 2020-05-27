// JavaScript Document

var ck = {
  style_cookie_name: "style",
  style_cookie_duration: 30,
  style_domain: "tempuslibre.io"
};

document.body.onload = set_style_from_cookie();

function switch_style(css_title) {
  let link_tag = document.getElementsByTagName("link");
  for (let i = 0; i < link_tag.length; i++) {
    if ((link_tag[i].rel.indexOf("stylesheet") != -1) && link_tag[i].title) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false;
      }
    }
    set_cookie(ck.style_cookie_name, css_title,
      ck.style_cookie_duration, ck.style_domain);
  }
}

function set_style_from_cookie() {
  let css_title = get_cookie(ck.style_cookie_name);
  if (css_title.length) {
    switch_style(css_title);
  }
}

function set_cookie(cookie_name, cookie_value,
  lifespan_in_days, valid_domain) {
  var domain_string = valid_domain
    ? ("; domain=" + valid_domain) : '';
  document.cookie = cookie_name
    + "=" + encodeURIComponent(cookie_value)
    + "; max-age=" + 60 * 60
    * 24 * lifespan_in_days
    + "; path=/" + domain_string;
}

function get_cookie(cookie_name) {
  // https://www.thesitewizard.com/javascripts/cookies.shtml
  var cookie_string = document.cookie;
  if (cookie_string.length != 0) {
    var cookie_array = cookie_string.split('; ');
    for (let i = 0; i < cookie_array.length; i++) {
      let cookie_value = cookie_array[i].match(cookie_name + '=(.*)');
      if (cookie_value != null) {
        return decodeURIComponent(cookie_value[1]);
      }
    }
  }
  return '';
}
