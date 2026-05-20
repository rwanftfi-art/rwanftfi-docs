/*
  Language-switcher flags.

  Mintlify shows native flags only for its officially supported locales. This
  site also ships hi/vi/uk, which drops the native flags from the switcher.
  CSS can't target the switcher reliably (its markup/classes are generated and
  vary), so we match each entry by its visible language label and inject a flag
  image. Flags: flagcdn.com (SVG, renders on every OS).
*/
(function () {
  var FLAGS = {
    "English": "gb",
    "Русский": "ru", "Russian": "ru",
    "Türkçe": "tr", "Turkish": "tr",
    "简体中文": "cn", "中文": "cn", "Chinese": "cn",
    "Español": "es", "Spanish": "es",
    "Deutsch": "de", "German": "de",
    "Português": "pt", "Portuguese": "pt",
    "Hindi": "in", "हिन्दी": "in",
    "Italiano": "it", "Italian": "it",
    "Français": "fr", "French": "fr",
    "العربية": "sa", "Arabic": "sa",
    "Bahasa Indonesia": "id", "Indonesian": "id",
    "日本語": "jp", "Japanese": "jp",
    "Tiếng Việt": "vn", "Vietnamese": "vn",
    "Українська": "ua", "Ukrainian": "ua"
  };

  function inject(el, code) {
    if (el.querySelector(":scope > img.rwa-lang-flag")) return;
    var img = document.createElement("img");
    img.className = "rwa-lang-flag";
    img.src = "https://flagcdn.com/" + code + ".svg";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.style.cssText =
      "display:inline-block;width:1.25em;height:.9em;margin-inline-end:.5em;" +
      "vertical-align:-0.1em;border-radius:2px;object-fit:cover;flex:0 0 auto;" +
      "box-shadow:0 0 0 1px rgba(0,0,0,.08);";
    el.insertBefore(img, el.firstChild);
  }

  function scan() {
    var nodes = document.querySelectorAll(
      'a, button, li, span, div, [role="option"], [role="menuitem"], [role="menuitemradio"]'
    );
    var matches = [];
    for (var i = 0; i < nodes.length; i++) {
      var t = (nodes[i].textContent || "").trim();
      if (FLAGS[t]) matches.push(nodes[i]);
    }
    // Only flag the deepest element whose entire text is the label, so a
    // <a><span>English</span></a> structure gets exactly one flag.
    for (var j = 0; j < matches.length; j++) {
      var el = matches[j];
      var deeper = false;
      for (var k = 0; k < matches.length; k++) {
        if (matches[k] !== el && el.contains(matches[k])) { deeper = true; break; }
      }
      if (!deeper) inject(el, FLAGS[(el.textContent || "").trim()]);
    }
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; scan(); });
  }

  if (document.readyState !== "loading") scan();
  document.addEventListener("DOMContentLoaded", scan);
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
