(function () {
  "use strict";
  var CF = window.CF,
    J = null,
    activo = false,
    S = { sel: null, abierto: "", aviso: "" };
  /* Posiciones de las camisetas en la cancha (% del ancho y alto). 4-4-2 sale de la captura original;
     las otras formaciones son aproximadas. Cada punto es [tipo de posición, x, y]. */
  var P0 = [0, 41.5, 93],
    D4 = [
      [1, 11.2, 71.2],
      [2, 26.8, 73.2],
      [2, 56.8, 73.2],
      [1, 71.5, 71.2],
    ],
    D3 = [
      [2, 20, 73],
      [2, 41, 74],
      [2, 62, 73],
    ],
    D5 = [
      [1, 8, 68],
      [2, 24, 73],
      [2, 41, 74],
      [2, 58, 73],
      [1, 74, 68],
    ],
    M22 = [
      [3, 27, 57.5],
      [3, 57, 57.5],
      [3, 27, 42.5],
      [3, 57, 42.5],
    ],
    M3 = [
      [3, 18, 50],
      [3, 41, 50],
      [3, 64, 50],
    ],
    M5 = [
      [3, 10, 48],
      [3, 25.5, 48],
      [3, 41, 48],
      [3, 56.5, 48],
      [3, 72, 48],
    ],
    A1 = [[4, 41, 14]],
    A2 = [
      [4, 27, 14.2],
      [4, 57, 14.2],
    ],
    A3 = [
      [4, 14, 17],
      [4, 41, 13],
      [4, 67, 17],
    ];
  var TAC = {
    "4-4-2": [P0].concat(D4, M22, A2),
    "4-3-3": [P0].concat(D4, M3, A3),
    "4-5-1": [P0].concat(D4, M5, A1),
    "3-4-3": [P0].concat(D3, M22, A3),
    "3-5-2": [P0].concat(D3, M5, A2),
    "5-3-2": [P0].concat(D5, M3, A2),
    "5-4-1": [P0].concat(D5, M22, A1),
  };
  var BANCO = [14.3, 24, 35.5, 45.6, 55.7, 65.8, 75.8];

  function t(k) {
    var W = window.__TACTICA.i18n,
      l = CF.idioma();
    return (W[l] && W[l][k]) || W["65"][k] || k;
  }
  function h(k) {
    var W = window.__JUEGO.i18n,
      l = CF.idioma();
    return (W[l] && W[l][k]) || W["65"][k] || k;
  }
  function tabla(n) {
    var W = window.__JUEGO[n];
    return W[CF.idioma()] || W["65"];
  }
  function img(ruta, clase, extra) {
    return (
      "<img" +
      (clase ? ' class="' + clase + '"' : "") +
      ' src="' +
      CF.U(ruta) +
      '" alt=""' +
      (extra || "") +
      " />"
    );
  }
  function abrev(n) {
    var w = n.split(" ");
    return n.length <= 10 || w.length < 2
      ? n
      : w[0] + " " + w[1].charAt(0) + ".";
  }
  /* Alineación automática: para cada puesto, el jugador libre más cercano en posición y de mayor fuerza. */
  function auto(tac) {
    var usado = {};
    return TAC[tac].map(function (s) {
      var mejor = -1,
        mp = 1e9;
      J.plantel.forEach(function (p, i) {
        if (usado[i]) return;
        var d =
            Math.abs(p.pos - s[0]) +
            ((s[0] === 0 || p.pos === 0) && s[0] !== p.pos ? 10 : 0),
          sc = d * 1000 - (p.f * p.cond) / 100;
        if (sc < mp) {
          mp = sc;
          mejor = i;
        }
      });
      usado[mejor] = 1;
      return mejor;
    });
  }
  function mejorF(filtro) {
    var m = 0;
    J.plantel.forEach(function (p, i) {
      if (filtro(p, i) && (!filtro(J.plantel[m], m) || p.f > J.plantel[m].f))
        m = i;
    });
    return m;
  }
  function grupo(p) {
    return p.pos === 0 ? 0 : p.pos <= 2 ? 1 : p.pos === 3 ? 2 : 3;
  }
  var OBJB = [1, 2, 2, 2];
  function completarBanco() {
    var uso = {},
      cuenta = [0, 0, 0, 0];
    J.alin.concat(J.banco).forEach(function (i) {
      if (i >= 0) uso[i] = 1;
    });
    J.banco.forEach(function (i) {
      if (i >= 0) cuenta[grupo(J.plantel[i])]++;
    });
    function mejor(g) {
      var m = -1;
      J.plantel.forEach(function (p, i) {
        if (
          !uso[i] &&
          (g < 0 || grupo(p) === g) &&
          (m < 0 || p.f > J.plantel[m].f)
        )
          m = i;
      });
      return m;
    }
    for (var k = 0; k < J.banco.length; k++) {
      if (J.banco[k] >= 0) continue;
      var g = -1,
        q;
      for (q = 0; q < 4; q++)
        if (cuenta[q] < OBJB[q]) {
          g = q;
          break;
        }
      var m = mejor(g);
      if (m < 0) m = mejor(-1);
      if (m < 0) break;
      J.banco[k] = m;
      uso[m] = 1;
      cuenta[grupo(J.plantel[m])]++;
    }
  }
  function iniciar() {
    if (J.tac) return;
    J.tac = "4-4-2";
    J.alin = auto(J.tac);
    J.banco = [-1, -1, -1, -1, -1, -1, -1];
    completarBanco();
    J.act = 0;
    J.pres = 0;
    J.ata = 0;
    J.cap = mejorF(function (p, i) {
      return J.alin.indexOf(i) >= 0;
    });
    J.lanz = mejorF(function (p, i) {
      return J.alin.indexOf(i) >= 0 && p.pos === 3;
    });
  }
  function lugar(i) {
    var a = J.alin.indexOf(i);
    if (a >= 0) return ["a", a];
    var b = J.banco.indexOf(i);
    return b >= 0 ? ["b", b] : null;
  }
  function arr(z) {
    return z === "a" ? J.alin : J.banco;
  }
  function permutar(a, b) {
    var la = lugar(a),
      lb = lugar(b);
    if (la) arr(la[0])[la[1]] = b;
    if (lb) arr(lb[0])[lb[1]] = a;
  }
  function mover(j, z, n) {
    var l = lugar(j);
    if (l) arr(l[0])[l[1]] = -1;
    arr(z)[n] = j;
  }
  function tocarR(z, n) {
    var p = arr(z)[n],
      s = S.sel;
    if (!s) S.sel = p >= 0 ? { j: p } : { z: z, n: n };
    else if (s.j !== undefined) {
      if (s.j === p) S.sel = null;
      else {
        if (p >= 0) permutar(s.j, p);
        else mover(s.j, z, n);
        S.sel = null;
      }
    } else if (p >= 0) {
      mover(p, s.z, s.n);
      S.sel = null;
    } else S.sel = { z: z, n: n };
  }
  function tocarJ(i) {
    var s = S.sel;
    if (!s) S.sel = { j: i };
    else if (s.j !== undefined) {
      if (s.j === i) S.sel = null;
      else {
        permutar(s.j, i);
        S.sel = null;
      }
    } else {
      mover(i, s.z, s.n);
      S.sel = null;
    }
  }
  function combo(id, etiqueta, opciones, valor) {
    var abierto = S.abierto === id;
    return (
      '<div class="t-c"><div class="t-l">' +
      CF.E(etiqueta) +
      '</div><div class="t-cb' +
      (abierto ? " abierto" : "") +
      '"><button type="button" data-cb="' +
      id +
      '"><span>' +
      CF.E(opciones[valor]) +
      "</span><i></i></button>" +
      (abierto
        ? '<div class="t-dd">' +
          opciones
            .map(function (o, k) {
              return (
                '<div class="t-it' +
                (k === valor ? " on" : "") +
                '" data-cb="' +
                id +
                '" data-v="' +
                k +
                '">' +
                CF.E(o) +
                "</div>"
              );
            })
            .join("") +
          "</div>"
        : "") +
      "</div></div>"
    );
  }
  function camiseta(s, i, k, z, x, y, p, ab) {
    var on =
      S.sel &&
      ((S.sel.j !== undefined && S.sel.j === i && i >= 0) ||
        (S.sel.z === z && S.sel.n === k));
    return (
      '<div class="t-sl' +
      (on ? " sel" : "") +
      (i < 0 ? " vacio" : "") +
      '" data-z="' +
      z +
      '" data-n="' +
      k +
      '" style="left:' +
      x +
      "%;top:" +
      y +
      '%">' +
      img(
        "assets/tac/camisa" +
          (s === 0 ? 2 : i < 0 ? 0 : z === "a" ? 1 : 3) +
          ".png",
      ) +
      (p
        ? '<span class="t-pct">' +
          p.cond +
          "%</span><b>" +
          CF.E(abrev(p.nombre)) +
          "</b><small>" +
          CF.E(ab[p.pos]) +
          "</small>"
        : "") +
      "</div>"
    );
  }
  function dibujar() {
    var E = CF.E,
      pl = J.plantel,
      ab = tabla("posAb"),
      rA = tabla("rasgosA"),
      ant = document.querySelector(".t-sc"),
      pos = ant ? ant.scrollTop : 0;
    var campo =
      img("assets/tac/campo.jpg", "t-fondo") +
      TAC[J.tac]
        .map(function (s, k) {
          return camiseta(
            s[0],
            J.alin[k],
            k,
            "a",
            s[1],
            s[2],
            pl[J.alin[k]],
            ab,
          );
        })
        .join("") +
      BANCO.map(function (y, k) {
        return camiseta(1, J.banco[k], k, "b", 89.9, y, pl[J.banco[k]], ab);
      }).join("");
    var cab =
      '<div class="t-fila t-th"><span class="c1"></span><span class="c2">' +
      E(h("h_p")) +
      '</span><span class="c3"></span><span class="c4 n">' +
      E(h("h_nombre")) +
      '</span><span class="c5">' +
      E(h("h_f")) +
      '</span><span class="c6">' +
      E(h("h_cond")) +
      '</span><span class="c7">' +
      E(h("h_lado")) +
      '</span><span class="c8">' +
      E(h("h_g")) +
      '</span><span class="c9">' +
      E(h("h_char")) +
      '</span><span class="c10">' +
      E(h("h_e")) +
      "</span></div>";
    var filas = pl
      .map(function (p, i) {
        var lg = lugar(i);
        return (
          '<div class="t-fila' +
          (S.sel && S.sel.j === i ? " sel" : "") +
          '" data-j="' +
          i +
          '"><span class="c1">' +
          img(
            "assets/hub/il2/" + (lg ? (lg[0] === "a" ? 9 : 13) : 10) + ".png",
          ) +
          '</span><span class="c2">' +
          E(ab[p.pos]) +
          '</span><span class="c3"></span><span class="c4 n">' +
          E(p.nombre) +
          '</span><span class="c5">' +
          p.f +
          '</span><span class="c6">' +
          p.cond +
          '%<i class="t-bar"></i></span><span class="c7">' +
          (p.lado ? "I" : "D") +
          '</span><span class="c8">' +
          p.g +
          '</span><span class="c9">' +
          E(rA[p.rasgos[0]] + "/" + rA[p.rasgos[1]]) +
          '</span><span class="c10">' +
          p.edad +
          "</span></div>"
        );
      })
      .join("");
    var nombres = pl.map(function (p) {
        return p.nombre + " - " + ab[p.pos];
      }),
      tacs = Object.keys(TAC);
    CF.A.innerHTML =
      '<div class="t"><div class="t-sc"><div class="t-campo">' +
      campo +
      '</div><div class="t-ctl">' +
      combo("tac", t("tactica"), tacs, tacs.indexOf(J.tac)) +
      combo("act", t("actitud"), [t("a0"), t("a1"), t("a2")], J.act) +
      combo("lanz", t("lanzador"), nombres, J.lanz) +
      combo("pres", t("presion"), [t("p0"), t("p1"), t("p2")], J.pres) +
      combo("ata", t("ataques"), [t("t0"), t("t1")], J.ata) +
      combo("cap", t("capitan"), nombres, J.cap) +
      '</div><div class="t-tabla">' +
      cab +
      filas +
      '</div></div><div class="t-pie">' +
      (S.aviso ? '<div class="t-aviso">' + E(S.aviso) + "</div>" : "") +
      '<button type="button" data-a="v">' +
      E(t("volver")) +
      '</button><button type="button" data-a="c">' +
      E(t("comenzar")) +
      "</button></div></div>";
    var sc = document.querySelector(".t-sc");
    sc.scrollTop = pos;
    sc.onclick = function (e) {
      var x = e.target,
        f;
      if ((f = x.closest("[data-z]"))) {
        tocarR(f.getAttribute("data-z"), +f.getAttribute("data-n"));
        S.abierto = "";
        dibujar();
      } else if ((f = x.closest("[data-j]"))) {
        tocarJ(+f.getAttribute("data-j"));
        S.abierto = "";
        dibujar();
      } else if ((f = x.closest("[data-v]"))) {
        var id = f.getAttribute("data-cb"),
          v = +f.getAttribute("data-v");
        if (id === "tac") {
          J.tac = tacs[v];
          J.alin = auto(J.tac);
          J.banco = J.banco.map(function (b) {
            return J.alin.indexOf(b) >= 0 ? -1 : b;
          });
          completarBanco();
        } else J[id] = v;
        S.abierto = "";
        S.sel = null;
        dibujar();
      } else if ((f = x.closest("[data-cb]"))) {
        S.abierto =
          S.abierto === f.getAttribute("data-cb")
            ? ""
            : f.getAttribute("data-cb");
        dibujar();
      }
      e.stopPropagation();
    };
    document.querySelector('[data-a="v"]').onclick = function () {
      activo = false;
      S.sel = null;
      S.abierto = "";
      S.aviso = "";
      CF.ir("juego");
    };
    document.querySelector('[data-a="c"]').onclick = function () {
      S.aviso = J.alin.indexOf(-1) >= 0 ? t("min11") : "";
      dibujar();
    };
  }
  document.addEventListener("click", function () {
    if (activo && S.abierto) {
      S.abierto = "";
      dibujar();
    }
  });
  CF.pantallas.tactica = dibujar;
  CF.tactica = function (juego) {
    J = juego;
    iniciar();
    activo = true;
    S.sel = null;
    S.abierto = "";
    S.aviso = "";
    CF.ir("tactica");
  };
})();
