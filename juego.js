(function () {
  "use strict";
  var CF = window.CF,
    J = null,
    BARRA = [
      [3.22, 5.52],
      [10.58, 6.75],
      [19.79, 6.6],
      [28.99, 5.67],
      [37.42, 8.44],
      [49.08, 7.98],
      [60.58, 7.21],
      [70.25, 4.6],
      [77.3, 5.37],
      [83.59, 5.21],
      [90.64, 5.98],
    ],
    K_SAL = [580, 620, 610, 650, 700],
    OBJ = [1, 2, 2, 3, 3];

  function t(k) {
    var W = window.__JUEGO.i18n;
    return (W[CF.idioma()] && W[CF.idioma()][k]) || W["65"][k] || k;
  }
  function tabla(nombre) {
    var W = window.__JUEGO[nombre];
    return W[CF.idioma()] || W["65"];
  }
  function num(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
    return h;
  }
  function hex(c) {
    return [
      parseInt(c.substr(1, 2), 16),
      parseInt(c.substr(3, 2), 16),
      parseInt(c.substr(5, 2), 16),
    ];
  }
  function rgb(a) {
    return (
      "rgb(" +
      a
        .map(function (v) {
          return Math.max(0, Math.min(255, Math.round(v)));
        })
        .join(",") +
      ")"
    );
  }

  /* Valores provisionales: fuerza, salario y valor se calculan con una fórmula aproximada
     calibrada con una captura del juego original; se reemplaza cuando armemos la lógica. */
  function jugador(p, club) {
    var h = hash(p[0] + club.i),
      f = Math.max(8, Math.min(99, Math.round(club.f * 2.52 + (h % 13) - 6))),
      fe = p[2] <= 20 ? 1.65 : p[2] <= 21 ? 1.55 : p[2] <= 25 ? 1.3 : 1;
    return {
      nombre: p[0],
      nac: p[1],
      edad: p[2],
      pos: p[3],
      rasgos: [p[5], p[6]],
      lado: p[7],
      f: f,
      cond: 100,
      salario: Math.round((f * K_SAL[p[3]]) / 10) * 10,
      valor: Math.round(f * f * 1.75 * fe * 1000) + (h % 1000),
      g: 0,
      ta: 0,
    };
  }
  /* Los equipos con menos de 11 jugadores se completan con jugadores de la misma liga. */
  function completar(plantel, club, pool) {
    while (plantel.length < 11) {
      var cuenta = [0, 0, 0, 0, 0],
        pos = 3;
      plantel.forEach(function (p) {
        cuenta[p.pos]++;
      });
      for (var i = 4; i >= 0; i--) if (cuenta[i] < OBJ[i]) pos = i;
      var cand = pool.filter(function (p) {
        return p[3] === pos;
      });
      plantel.push(
        jugador(cand[Math.floor(Math.random() * cand.length)] || pool[0], club),
      );
    }
  }
  function crear(cfg) {
    var clubes = window.__CLUBES && window.__CLUBES[cfg.liga];
    if (!clubes) return null;
    var liga = CF.D.ligas.filter(function (l) {
        return l.id === cfg.liga;
      })[0],
      cand = clubes.filter(function (c) {
        return c.d === liga.div;
      }),
      club = cand[Math.floor(Math.random() * cand.length)],
      pool = [];
    clubes.forEach(function (c) {
      if (c.d)
        c.j.forEach(function (p) {
          pool.push(p);
        });
    });
    var plantel = club.j.map(function (p) {
      return jugador(p, club);
    });
    completar(plantel, club, pool);
    plantel.sort(function (a, b) {
      return a.pos - b.pos;
    });
    var rivales = clubes.filter(function (c) {
      return c.d && c.i !== club.i;
    });
    return {
      cfg: cfg,
      club: club,
      div: club.d,
      tec: cfg.nombre.trim(),
      fecha: "24/3/2010",
      dinero: 12000000,
      noticias: 1,
      conf: [100, 100],
      plantel: plantel,
      sel: 0,
      rival: rivales[Math.floor(Math.random() * rivales.length)],
    };
  }
  function conf(txt, v) {
    return (
      "<div>" +
      CF.E(txt) +
      '<div class="j-bar"><b style="width:' +
      v +
      '%"></b><span>' +
      v +
      "%</span></div></div>"
    );
  }
  function img(ruta, extra) {
    return '<img src="' + CF.U(ruta) + '" alt=""' + (extra || "") + " />";
  }
  var OCULTAR = " onerror=\"this.style.visibility='hidden'\"";

  function dibujar() {
    var D = CF.D,
      E = CF.E,
      club = J.club,
      P = D.paises[CF.idioma()] || D.paises["65"],
      c = hex(club.k[0]),
      luz = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255,
      fc = luz < 0.15 ? [96, 96, 96] : c,
      nm =
        luz > 0.5
          ? rgb(
              c.map(function (v) {
                return v * 0.55;
              }),
            )
          : "#fff",
      ab = tabla("posAb"),
      rA = tabla("rasgosA"),
      rN = tabla("rasgosN"),
      p = J.plantel[J.sel],
      rival = J.rival,
      ant = document.querySelector(".j-tabla"),
      pos = ant ? [ant.scrollTop, ant.scrollLeft] : [0, 0],
      noticias =
        J.noticias === 1
          ? t("noticia1")
          : t("noticiaN").replace("{n}", J.noticias);
    var cab =
      '<div class="j-fila j-th"><div class="j-fx"><span class="c1"></span><span class="c2">' +
      E(t("h_p")) +
      '</span><span class="c3"></span><span class="c4 n">' +
      E(t("h_nombre")) +
      "</span></div>" +
      '<span class="c5">' +
      E(t("h_lado")) +
      '</span><span class="c6">' +
      E(t("h_f")) +
      '</span><span class="c7">' +
      E(t("h_cond")) +
      '</span><span class="c8">' +
      E(t("h_sal")) +
      '</span><span class="c9">' +
      E(t("h_valor")) +
      '</span><span class="c10">' +
      E(t("h_g")) +
      '</span><span class="c11">' +
      E(t("h_char")) +
      '</span><span class="c12">' +
      E(t("h_e")) +
      '</span><span class="c13">' +
      E(t("h_m")) +
      "</span></div>";
    var filas = J.plantel
      .map(function (q, i) {
        return (
          '<div class="j-fila' +
          (i === J.sel ? " sel" : "") +
          '" data-i="' +
          i +
          '"><div class="j-fx"><span class="c1">' +
          img("assets/hub/il5/0.png") +
          '</span><span class="c2">' +
          E(ab[q.pos]) +
          '</span><span class="c3"></span><span class="c4 n">' +
          E(q.nombre) +
          "</span></div>" +
          '<span class="c5">' +
          (q.lado ? "I" : "D") +
          '</span><span class="c6">' +
          q.f +
          '</span><span class="c7">' +
          q.cond +
          '%<i class="j-cb"></i></span><span class="c8">' +
          num(q.salario) +
          '</span><span class="c9">' +
          num(Math.round(q.valor / 1000)) +
          ' k</span><span class="c10">' +
          q.g +
          '</span><span class="c11">' +
          E(rA[q.rasgos[0]] + "/" + rA[q.rasgos[1]]) +
          '</span><span class="c12 e' +
          (q.edad >= 33 ? " v" : "") +
          '">' +
          q.edad +
          '</span><span class="c13">' +
          img("assets/hub/il1/10.png") +
          "</span></div>"
        );
      })
      .join("");
    var ficha =
      '<div class="j-ficha"><div class="j-fh"><b>' +
      E(p.nombre) +
      "</b><span>" +
      img("assets/flags/" + p.nac + ".png", OCULTAR) +
      E(ab[p.pos]) +
      img("assets/hub/estadisticas2.png") +
      '</span></div><div class="j-fg"><span><b>' +
      E(t("fuerza")) +
      ":</b>" +
      p.f +
      "</span><span><b>" +
      E(t("edad")) +
      ":</b>" +
      p.edad +
      "</span><span><b>" +
      E(t("valor")) +
      ":</b>$ " +
      num(p.valor) +
      "</span><span><b>" +
      E(t("salario")) +
      ":</b> " +
      num(p.salario) +
      "</span></div><div><b>" +
      E(t("partidos")) +
      ":</b>0 <b>" +
      E(t("goles")) +
      ":</b>" +
      p.g +
      " <b>" +
      E(t("ta")) +
      ":</b>" +
      p.ta +
      "</div><div><b>" +
      E(t("caract")) +
      ":</b>" +
      E(rN[p.rasgos[0]] + "/" + rN[p.rasgos[1]]) +
      '</div><div class="j-fb"><button type="button">' +
      E(t("vender")) +
      '</button><button type="button">' +
      E(t("contrato")) +
      '</button><button type="button" disabled>' +
      E(t("jubilar")) +
      "</button></div></div>";
    CF.A.innerHTML =
      '<div class="j" style="--j-base:' +
      rgb(c) +
      ";--j-claro:" +
      rgb([c[0] + 35, c[1] + 35, c[2] + 55]) +
      ";--j-f1:" +
      rgb(
        fc.map(function (v) {
          return v + 70;
        }),
      ) +
      ";--j-f2:" +
      rgb(fc) +
      ";--j-f3:" +
      rgb(
        fc.map(function (v) {
          return v * 0.6;
        }),
      ) +
      ";--j-tx:" +
      (luz > 0.5 ? "#000" : "#fff") +
      ";--j-nombre:" +
      nm +
      '"><div class="j-barra">' +
      img("assets/hub/barra.png") +
      BARRA.map(function (b) {
        return '<i style="left:' + b[0] + "%;width:" + b[1] + '%"></i>';
      }).join("") +
      '</div><div class="j-fecha">' +
      J.fecha +
      '</div><div class="j-cab">' +
      img("assets/escudos/" + club.i + ".png", ' class="j-escudo"' + OCULTAR) +
      '<div><div class="j-nombre">' +
      E(club.n) +
      '</div><div class="j-div">' +
      E(t("div" + J.div)) +
      '</div><div class="j-tec">' +
      E(J.tec) +
      '</div></div></div><div class="j-conf">' +
      conf(t("conf_dir"), J.conf[0]) +
      conf(t("conf_afi"), J.conf[1]) +
      '</div><div class="j-estado"><div>' +
      img("assets/hub/dinero.png") +
      num(J.dinero) +
      "</div><div>" +
      img("assets/hub/noticia.png") +
      E(noticias) +
      "</div><div>" +
      img("assets/hub/grupo.png") +
      J.plantel.length +
      " " +
      E(t("jugadores")) +
      "</div><div>" +
      img("assets/hub/colores.png") +
      E(t("colores")) +
      '</div></div><div class="j-prox"><img class="j-strip" src="' +
      CF.U("assets/hub/proximo.png") +
      '" alt="" /><div class="j-pt"><span>' +
      E(t("proximo")) +
      "</span><span>" +
      img("assets/hub/estadisticas.png") +
      img("assets/hub/arbitro.png") +
      '</span></div><div class="j-pr">' +
      img("assets/escudos/" + rival.i + ".png", OCULTAR) +
      "<div><div>" +
      E(rival.n) +
      "</div><div>" +
      E(t("copa") + " " + P[club.p]) +
      "</div><div>" +
      E(t("local") + " - " + t("fase1") + " - " + t("ida")) +
      '</div></div></div><button class="j-btn" type="button">' +
      E(t("formacion")) +
      "</button></div>" +
      ficha +
      '<div class="j-tabla">' +
      cab +
      filas +
      '</div><div class="j-pie">CyberFoot 2010 - www.cyberfoot.org</div></div>';
    var tb = document.querySelector(".j-tabla");
    tb.scrollTop = pos[0];
    tb.scrollLeft = pos[1];
    tb.onclick = function (e) {
      var f = e.target.closest("[data-i]");
      if (f) {
        J.sel = +f.getAttribute("data-i");
        dibujar();
      }
    };
  }
  CF.pantallas.juego = dibujar;
  CF.comenzar = function (cfg) {
    var s = crear(cfg);
    if (!s) return;
    J = s;
    CF.ir("juego");
  };
})();
