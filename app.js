(function () {
  "use strict";
  var D = window.__DATA__,
    IM = window.__IMGS__ || {},
    A = document.getElementById("app"),
    L = "65",
    O = false;
  var ORD = [
    "57",
    "31",
    "3",
    "97",
    "65",
    "11",
    "72",
    "104",
    "152",
    "154",
    "160",
    "192",
  ];
  var S = "menu",
    OP = "",
    G = { liga: "11", nac: "11", nombre: "" };
  try {
    L = localStorage.getItem("cf_lang") || L;
  } catch (e) {}
  if (ORD.indexOf(L) < 0) L = "65";
  function U(p) {
    return IM[p] || p;
  }
  function T(k) {
    return (D.i18n[L] && D.i18n[L][k]) || D.i18n["65"][k] || k;
  }
  function E(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function N(id) {
    for (var i = 0; i < D.idiomas.length; i++)
      if (D.idiomas[i][0] === id) return D.idiomas[i][1];
    return id;
  }
  function F(id) {
    return (
      '<img class="fl" alt="" src="' + U("assets/flags/" + id + ".png") + '">'
    );
  }
  function drawMenu() {
    var it = ORD.map(function (i) {
      return (
        '<div class="it' +
        (i === L ? " on" : "") +
        '" data-l="' +
        i +
        '">' +
        F(i) +
        "<span>" +
        E(N(i)) +
        "</span></div>"
      );
    }).join("");
    A.innerHTML =
      '<div class="stage" style="background-image:url(' +
      U("assets/inicio.jpg") +
      ')"><span class="lb">' +
      E(T("lang")) +
      '</span><div class="cbx"><button class="cb" id="cb" type="button">' +
      F(L) +
      "<span>" +
      E(N(L)) +
      '</span><i></i></button><div class="dd" id="dd"' +
      (O ? "" : " hidden") +
      ">" +
      it +
      '</div></div><button class="gb" style="top:78.08cqw" data-a="n">' +
      E(T("new")) +
      '</button><button class="gb" style="top:88.28cqw" data-a="c">' +
      E(T("cont")) +
      "</button></div>";
    document.getElementById("cb").onclick = function (e) {
      e.stopPropagation();
      O = !O;
      document.getElementById("dd").hidden = !O;
    };
    var l = A.querySelectorAll("[data-l]");
    for (var i = 0; i < l.length; i++)
      l[i].onclick = function (e) {
        e.stopPropagation();
        L = this.getAttribute("data-l");
        try {
          localStorage.setItem("cf_lang", L);
        } catch (x) {}
        O = false;
        draw();
      };
    A.querySelector('[data-a="n"]').onclick = function () {
      S = "nueva";
      O = false;
      OP = "";
      draw();
    };
  }
  function drawNueva() {
    var P = D.paises[L] || D.paises["65"];
    var ligas = D.ligas.slice().sort(function (a, b) {
      return P[a.id].localeCompare(P[b.id]);
    });
    var liga =
      ligas.filter(function (g) {
        return g.id === G.liga;
      })[0] || ligas[0];
    var ORDS = ["", "primera", "segunda", "tercera", "cuarta"];
    function info(n) {
      return n === 4
        ? T("np_liga4")
        : n === 1
          ? T("np_liga1")
          : T("np_ligaN").replace("{n}", n);
    }
    function nota(n) {
      return n === 1 ? T("np_nota1") : T("np_nota").replace("{d}", ORDS[n]);
    }
    function fila(g) {
      return F(g.id) + "<span>" + E(P[g.id]) + "</span>";
    }
    function combo(id) {
      var actual =
        ligas.filter(function (g) {
          return g.id === G[id];
        })[0] || ligas[0];
      var items = ligas
        .map(function (g) {
          return (
            '<div class="it" data-' +
            id +
            '="' +
            g.id +
            '">' +
            fila(g) +
            "</div>"
          );
        })
        .join("");
      return (
        '<div class="cbx' +
        (OP === id ? " abierto" : "") +
        '"><button class="cb" type="button" data-cb="' +
        id +
        '">' +
        fila(actual) +
        '<i></i></button><div class="dd"' +
        (OP === id ? "" : " hidden") +
        ">" +
        items +
        "</div></div>"
      );
    }
    A.innerHTML =
      '<div class="np"><div class="np-in"><div class="np-panel"><h1 class="np-titulo">' +
      E(T("np_titulo")) +
      '</h1><h2 class="np-seccion">' +
      E(T("np_clubes")) +
      '</h2><p class="np-label">' +
      E(T("np_liga")) +
      "</p>" +
      combo("liga") +
      '<p class="np-info">' +
      E(info(liga.div)) +
      '</p><p class="np-nota">' +
      E(nota(liga.div)) +
      '</p><h2 class="np-seccion">' +
      E(T("coach")) +
      '</h2><p class="np-label">' +
      E(T("np_nac")) +
      "</p>" +
      combo("nac") +
      '</div><label class="np-label" for="nombre">' +
      E(T("np_nombre")) +
      '</label><input class="np-input" id="nombre" maxlength="25" autocomplete="off" value="' +
      E(G.nombre) +
      '" /><div class="np-botones"><button class="np-btn" data-a="v">' +
      E(T("np_volver")) +
      '</button><button class="np-btn" id="empezar" data-a="e"' +
      (G.nombre.trim() ? "" : " disabled") +
      ">" +
      E(T("np_empezar")) +
      "</button></div></div></div>";
    var c = A.querySelectorAll("[data-cb]");
    for (var i = 0; i < c.length; i++)
      c[i].onclick = function (e) {
        e.stopPropagation();
        var id = this.getAttribute("data-cb");
        OP = OP === id ? "" : id;
        draw();
      };
    ["liga", "nac"].forEach(function (id) {
      var f = A.querySelectorAll("[data-" + id + "]");
      for (var j = 0; j < f.length; j++)
        f[j].onclick = function (e) {
          e.stopPropagation();
          G[id] = this.getAttribute("data-" + id);
          OP = "";
          draw();
        };
    });
    document.getElementById("nombre").oninput = function () {
      G.nombre = this.value;
      document.getElementById("empezar").disabled = !G.nombre.trim();
    };
    document.getElementById("empezar").onclick = function () {
      CF.cargar(
        [
          "juego.css",
          "data/juego.js",
          "juego.js",
          "data/clubes/" + G.liga + ".js",
        ],
        function () {
          CF.comenzar(G);
        },
      );
    };
    A.querySelector('[data-a="v"]').onclick = function () {
      S = "menu";
      O = false;
      OP = "";
      draw();
    };
  }
  var CARGADOS = window.__CARGADOS || {};
  function cargar(lista, fin) {
    var n = lista.length;
    lista.forEach(function (u) {
      if (CARGADOS[u]) {
        if (--n === 0) fin();
        return;
      }
      var css = /\.css$/.test(u),
        el = document.createElement(css ? "link" : "script");
      if (css) {
        el.rel = "stylesheet";
        el.href = u;
      } else el.src = u;
      el.onload = el.onerror = function () {
        CARGADOS[u] = 1;
        if (--n === 0) fin();
      };
      document.head.appendChild(el);
    });
  }
  window.CF = {
    D: D,
    A: A,
    T: T,
    E: E,
    F: F,
    U: U,
    pantallas: {},
    cargar: cargar,
    idioma: function () {
      return L;
    },
    ir: function (pantalla) {
      S = pantalla;
      draw();
    },
  };
  function draw() {
    document.body.className = S;
    if (S === "nueva") drawNueva();
    else if (window.CF.pantallas[S]) window.CF.pantallas[S]();
    else drawMenu();
  }
  document.addEventListener("click", function () {
    var d = document.getElementById("dd");
    if (O && d) {
      O = false;
      d.hidden = true;
    }
    if (OP) {
      OP = "";
      draw();
    }
  });
  cargar(["data/ligas.js"], function () {
    D.ligas = window.__LIGAS || D.ligas;
    draw();
  });
  if ("serviceWorker" in navigator) {
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      navigator.serviceWorker.getRegistrations().then(function (r) {
        r.forEach(function (x) {
          x.unregister();
        });
      });
      if (window.caches)
        caches.keys().then(function (k) {
          k.forEach(function (x) {
            caches.delete(x);
          });
        });
    } else if (/^https?:/.test(location.protocol))
      navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
