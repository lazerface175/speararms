/* ============================================================
   SpearArms — site scripts
   All dynamic content pulls from window.SPEARARMS (config.js)
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.SPEARARMS || {};
  var biz = CFG.business || {};
  var fees = CFG.fees || {};
  var stateWait = CFG.stateWaitDays || {};
  var states = CFG.states || [];

  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Inject business details ---------------- */
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  var addrEl = document.getElementById("contactAddress");
  if (addrEl && biz.addressLines) {
    addrEl.innerHTML = biz.addressLines
      .map(function (l) { return l.replace(/&/g, "&amp;").replace(/</g, "&lt;"); })
      .join("<br>");
  }
  setText("contactPhone", biz.phoneDisplay || "");
  setText("contactHours", biz.hours || "");
  var emailLink = document.getElementById("contactEmail");
  if (emailLink && biz.email) {
    emailLink.textContent = biz.email;
    emailLink.href = "mailto:" + biz.email;
  }
  document.querySelectorAll("a[href^='tel:']").forEach(function (a) {
    if (biz.phoneTel) a.href = "tel:" + biz.phoneTel;
  });
  document.querySelectorAll("a[href^='mailto:']").forEach(function (a) {
    if (biz.email && a.id !== "contactEmail") a.href = "mailto:" + biz.email;
  });

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(
    ".card, .step, .stat, .nfa-card, .form-panel, .estimator, .faq-item, .section-title, .section-lede"
  );
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     ESTIMATOR
     ============================================================ */
  var estType = document.getElementById("est-type");
  var estCondition = document.getElementById("est-condition");
  var estState = document.getElementById("est-state");
  var estLines = document.getElementById("estimateLines");
  var estTotal = document.getElementById("estimateTotal");
  var estTimeline = document.getElementById("estimateTimeline");

  if (estState) {
    states.forEach(function (pair) {
      var opt = document.createElement("option");
      opt.value = pair[0];
      opt.textContent = pair[1];
      estState.appendChild(opt);
    });
  }

  var ITEM_LABELS = {
    handgun: "Handgun transfer",
    longgun: "Rifle / shotgun transfer",
    suppressor: "Suppressor (NFA) transfer",
    sbr: "SBR / NFA transfer"
  };
  var NFA_ITEMS = { suppressor: true, sbr: true };

  function calcEstimate() {
    if (!estType || !estLines || !estTotal || !estTimeline) return;

    var type = estType.value;
    var condition = estCondition ? estCondition.value : "new";
    var state = estState ? estState.value : "";
    var isNFA = !!NFA_ITEMS[type];

    var lines = [];
    var subtotal = 0;

    function addLine(label, amount, cls) {
      lines.push({ label: label, amount: amount, cls: cls || "" });
      if (cls !== "line-subtotal") subtotal += amount;
    }

    // Base transfer + NICS
    addLine("Transfer fee", fees.transferBase || 0);
    addLine("NICS background check", fees.nicsFee || 0);

    // Handling differs for used firearms (non-NFA)
    if (!isNFA) {
      addLine(
        "Handling — " + (condition === "used" ? "used firearm" : "new in box"),
        condition === "used" ? (fees.handlingUsed || 0) : (fees.handlingNew || 0)
      );
    }

    // NFA tax stamp
    if (isNFA && CFG.nfa) {
      addLine("ATF NFA tax stamp (Form 4)", CFG.nfa.taxStamp || 200);
    }

    // Add-ons
    var addons = document.querySelectorAll(".est-addon:checked");
    addons.forEach(function (cb) {
      var key = cb.getAttribute("data-fee");
      var label = cb.closest("label").textContent.trim();
      addLine(label, fees[key] || 0);
    });

    // Render lines
    estLines.innerHTML = "";
    lines.forEach(function (line) {
      var row = document.createElement("div");
      row.className = line.cls;
      var dt = document.createElement("dt");
      dt.textContent = line.label;
      var dd = document.createElement("dd");
      dd.textContent = money.format(line.amount);
      row.appendChild(dt);
      row.appendChild(dd);
      estLines.appendChild(row);
    });
    estTotal.textContent = money.format(subtotal);

    // Timeline
    var itemKey = (type === "handgun") ? "handgun" : "longgun";
    var wait = state && stateWait[state] ? (stateWait[state][itemKey] || 0) : 0;
    var stateName = "";
    states.forEach(function (p) { if (p[0] === state) stateName = p[1]; });

    if (isNFA && CFG.nfa) {
      estTimeline.textContent =
        "NFA timeline: ATF Form 4 approval typically takes " +
        (CFG.nfa.typicalWeeksMin || 2) + "–" + (CFG.nfa.typicalWeeksMax || 12) +
        " weeks after filing, then ~3–5 business days for the transfer itself. File early — the tax stamp clock starts when ATF receives it.";
    } else if (!state) {
      estTimeline.textContent = "Select your state to see the estimated timeline.";
    } else if (wait > 0) {
      estTimeline.textContent =
        stateName + " has a ~" + wait + "-day waiting period for this item type. " +
        "Once your firearm arrives, expect roughly " + (wait + 2) + "–" + (wait + 4) +
        " business days total. State law can change — we confirm at intake.";
    } else {
      estTimeline.textContent =
        stateName + " has no state-mandated waiting period for this item. " +
        "After the firearm arrives and NICS clears, expect pickup in about 2–4 business days.";
    }
  }

  [estType, estCondition, estState].forEach(function (el) {
    if (el) el.addEventListener("change", calcEstimate);
  });
  document.querySelectorAll(".est-addon").forEach(function (cb) {
    cb.addEventListener("change", calcEstimate);
  });
  calcEstimate();

  /* ============================================================
     TRANSFER REQUEST FORM
     ============================================================ */
  var trForm = document.getElementById("transferRequestForm");
  var trStatus = document.getElementById("transferStatus");
  var printArea = document.getElementById("printArea");

  function trVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function setFieldError(inputId, errId, bad) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(errId);
    if (input) input.setAttribute("aria-invalid", String(bad));
    if (err) err.hidden = !bad;
    return !bad;
  }

  function validateTransferForm() {
    var ok = true;
    ok = setFieldError("tr-name", "err-tr-name", !trVal("tr-name")) && ok;
    ok = setFieldError("tr-phone", "err-tr-phone", !trVal("tr-phone")) && ok;
    ok = setFieldError("tr-item", "err-tr-item", !trVal("tr-item")) && ok;
    ok = setFieldError("tr-sender", "err-tr-sender", !trVal("tr-sender")) && ok;
    return ok;
  }

  function buildTransferSummary() {
    var rows = [
      ["Name", trVal("tr-name")],
      ["Phone", trVal("tr-phone")],
      ["Email", trVal("tr-email")],
      ["Item", trVal("tr-item")],
      ["Sending FFL / seller", trVal("tr-sender")],
      ["Desired completion date", trVal("tr-date") || "Flexible"],
      ["Notes", trVal("tr-notes") || "—"]
    ];
    return rows;
  }

  function transferText() {
    var lines = ["TRANSFER REQUEST — " + (biz.name || "SpearArms"), ""];
    buildTransferSummary().forEach(function (r) {
      lines.push(r[0].toUpperCase() + ": " + r[1]);
    });
    if (biz.phoneDisplay) lines.push("", "Contact: " + biz.phoneDisplay);
    if (biz.email) lines.push("Email: " + biz.email);
    return lines.join("\n");
  }

  function setStatus(msg, isErr) {
    if (!trStatus) return;
    trStatus.textContent = msg;
    trStatus.classList.toggle("is-error", !!isErr);
  }

  if (trForm) {
    ["tr-name", "tr-phone", "tr-item", "tr-sender"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function () { validateTransferForm(); });
    });

    var btnCopy = document.getElementById("btnCopyTransfer");
    if (btnCopy) {
      btnCopy.addEventListener("click", function () {
        if (!validateTransferForm()) { setStatus("Please fill in the required fields first.", true); return; }
        var text = transferText();
        function done() { setStatus("Summary copied to clipboard — paste it into an email or text."); }
        function fail() { setStatus("Copy failed — select the text below manually.", true); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fail);
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (e) { fail(); }
          document.body.removeChild(ta);
        }
      });
    }

    var btnEmail = document.getElementById("btnEmailTransfer");
    if (btnEmail) {
      btnEmail.addEventListener("click", function () {
        if (!validateTransferForm()) { setStatus("Please fill in the required fields first.", true); return; }
        var subject = "Transfer request — " + trVal("tr-item");
        var to = biz.email || "";
        window.location.href = "mailto:" + to +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(transferText());
        setStatus("Opening your email app…");
      });
    }

    var btnPrint = document.getElementById("btnPrintTransfer");
    if (btnPrint) {
      btnPrint.addEventListener("click", function () {
        if (!validateTransferForm()) { setStatus("Please fill in the required fields first.", true); return; }
        if (printArea) {
          var html = "<h1>Transfer Request — " + (biz.name || "SpearArms") + "</h1><dl>";
          buildTransferSummary().forEach(function (r) {
            html += "<dt>" + r[0] + "</dt><dd>" + escapeHtml(r[1]) + "</dd>";
          });
          html += "</dl>";
          if (biz.addressLines) {
            html += "<p>" + biz.addressLines.map(escapeHtml).join("<br>") + "</p>";
          }
          printArea.innerHTML = html;
        }
        window.print();
      });
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ============================================================
     CONTACT FORM → mailto
     ============================================================ */
  var cf = document.getElementById("contactForm");
  if (cf) {
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("cf-name").value || "").trim();
      var email = (document.getElementById("cf-email").value || "").trim();
      var topic = document.getElementById("cf-topic").value;
      var message = (document.getElementById("cf-message").value || "").trim();

      var bad = false;
      if (!name) { document.getElementById("cf-name").setAttribute("aria-invalid", "true"); bad = true; }
      if (!email) { document.getElementById("cf-email").setAttribute("aria-invalid", "true"); bad = true; }
      if (!message) { document.getElementById("cf-message").setAttribute("aria-invalid", "true"); bad = true; }
      if (bad) return;

      var body = "Name: " + name + "\nEmail: " + email + "\nTopic: " + topic + "\n\n" + message;
      var to = biz.email || "";
      window.location.href = "mailto:" + to +
        "?subject=" + encodeURIComponent("Website inquiry — " + topic) +
        "&body=" + encodeURIComponent(body);
      cf.reset();
    });

    cf.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        if (el.value.trim()) el.setAttribute("aria-invalid", "false");
      });
    });
  }
})();
