/* ================================================================== *
 *  #TaxDirection  --  public results dashboard logic
 * ------------------------------------------------------------------ *
 *  Reads the public `clusters` table from Supabase (anon key, guarded
 *  by Row-Level Security) and renders:
 *    - headline stats (total directed INR, #clusters, #wishes)
 *    - one card per cluster (problem/location labels, financial weight,
 *      wish count, AI proposal) with a pure-CSS bar visualization.
 *
 *  Depends on:
 *    - supabase-js v2  (loaded from jsDelivr CDN in dashboard.html)
 *    - window.TAXDIRECTION_CONFIG  (from config.js)
 *
 *  Degrades gracefully: shows a clear banner when the backend is not
 *  configured or a query fails, and an empty state when there are no
 *  clusters yet.
 * ================================================================== */
(function () {
  "use strict";

  // ---- DOM handles ----
  var els = {
    banner:   document.getElementById("banner"),
    statTotal:    document.getElementById("stat-total"),
    statClusters: document.getElementById("stat-clusters"),
    statWishes:   document.getElementById("stat-wishes"),
    loading:  document.getElementById("loading"),
    empty:    document.getElementById("empty"),
    clusters: document.getElementById("clusters"),
    refresh:  document.getElementById("refresh-btn")
  };

  // ---- INR formatting (Indian numbering system) ----
  var inrFmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });
  var numFmt = new Intl.NumberFormat("en-IN");

  function formatINR(value) {
    var n = Number(value);
    if (!isFinite(n)) n = 0;
    return inrFmt.format(n);
  }
  function formatNum(value) {
    var n = Number(value);
    if (!isFinite(n)) n = 0;
    return numFmt.format(n);
  }

  // ---- Banner helper ----
  function showBanner(kind, html) {
    els.banner.className = "banner banner-" + kind;
    els.banner.innerHTML = html;
    els.banner.hidden = false;
  }
  function hideBanner() {
    els.banner.hidden = true;
  }

  // ---- Config validation ----
  function getConfig() {
    var cfg = window.TAXDIRECTION_CONFIG || {};
    var url = cfg.SUPABASE_URL || "";
    var key = cfg.SUPABASE_ANON_KEY || "";
    var placeholder =
      !url ||
      !key ||
      url.indexOf("YOUR-PROJECT") !== -1 ||
      url.indexOf("your-project") !== -1 ||
      key.indexOf("PLACEHOLDER") !== -1;
    return { url: url, key: key, configured: !placeholder };
  }

  // ---- Stat state helpers ----
  function setStat(el, text, state) {
    el.textContent = text;
    if (state) el.setAttribute("data-state", state);
    else el.removeAttribute("data-state");
  }
  function setStatsLoading() {
    setStat(els.statTotal, "…", "loading");
    setStat(els.statClusters, "…", "loading");
    setStat(els.statWishes, "…", "loading");
  }
  function setStatsDash() {
    setStat(els.statTotal, "—", "empty");
    setStat(els.statClusters, "—", "empty");
    setStat(els.statWishes, "—", "empty");
  }

  // ---- Safe text escaping for proposal / labels ----
  function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---- View state ----
  function showLoading() {
    els.loading.hidden = false;
    els.empty.hidden = true;
    els.clusters.hidden = true;
  }
  function showEmpty() {
    els.loading.hidden = true;
    els.empty.hidden = false;
    els.clusters.hidden = true;
    setStatsDash();
  }
  function showClusters() {
    els.loading.hidden = true;
    els.empty.hidden = true;
    els.clusters.hidden = false;
  }

  // ---- Render ----
  function renderStats(rows) {
    var totalDirected = 0;
    var totalWishes = 0;
    var allWishCountsNumeric = true;

    rows.forEach(function (r) {
      totalDirected += Number(r.financial_weight_inr) || 0;
      var n = Number(r.wish_count);
      if (r.wish_count === null || r.wish_count === undefined || !isFinite(n)) {
        // A missing/non-numeric wish_count would silently understate the
        // aggregate total, so flag it rather than summing a partial count.
        allWishCountsNumeric = false;
      } else {
        totalWishes += n;
      }
    });

    setStat(els.statTotal, formatINR(totalDirected), "ready");
    setStat(els.statClusters, formatNum(rows.length), "ready");
    if (allWishCountsNumeric) {
      setStat(els.statWishes, formatNum(totalWishes), "ready");
    } else {
      setStat(els.statWishes, "—", "empty");
    }
  }

  function renderClusters(rows) {
    // Largest financial weight drives the bar scale.
    var maxWeight = rows.reduce(function (m, r) {
      var w = Number(r.financial_weight_inr) || 0;
      return w > m ? w : m;
    }, 0);

    els.clusters.innerHTML = "";

    rows.forEach(function (r, idx) {
      var weight = Number(r.financial_weight_inr) || 0;
      var pct = maxWeight > 0 ? (weight / maxWeight) * 100 : 0;

      var problemLabel = r.problem_label || ("Problem cluster " + (r.problem_cluster != null ? r.problem_cluster : "?"));
      var locationLabel = r.location_label || ("Location cluster " + (r.location_cluster != null ? r.location_cluster : "?"));
      var wishCount = (r.wish_count !== null && r.wish_count !== undefined)
        ? formatNum(r.wish_count) + (Number(r.wish_count) === 1 ? " wish" : " wishes")
        : "wish count unavailable";

      var proposalHTML = r.proposal && String(r.proposal).trim().length
        ? "<p>" + escapeHTML(r.proposal) + "</p>"
        : "<p class=\"muted\">An AI project proposal for this cluster has not been generated yet.</p>";

      var card = document.createElement("article");
      card.className = "cluster-card";
      card.innerHTML =
        "<div class=\"cluster-top\">" +
          "<div>" +
            "<div class=\"cluster-labels\">" +
              "<span class=\"tag tag-problem\">" + escapeHTML(problemLabel) + "</span>" +
              "<span class=\"tag tag-location\">" + escapeHTML(locationLabel) + "</span>" +
            "</div>" +
            "<h3 class=\"cluster-title\">#" + (idx + 1) + " &middot; " + escapeHTML(problemLabel) + "</h3>" +
          "</div>" +
          "<div class=\"cluster-amount\">" +
            "<span class=\"amt\">" + formatINR(weight) + "</span>" +
            "<span class=\"amt-label\">Directed</span>" +
          "</div>" +
        "</div>" +
        "<div class=\"bar-wrap\">" +
          "<div class=\"bar-track\">" +
            "<div class=\"bar-fill\" data-pct=\"" + pct.toFixed(1) + "\" " +
              "role=\"img\" aria-label=\"" + pct.toFixed(0) + "% of the top cluster's directed amount\"></div>" +
          "</div>" +
          "<div class=\"bar-meta\">" +
            "<span>Financial weight</span>" +
            "<span>" + pct.toFixed(0) + "% of top cluster</span>" +
          "</div>" +
        "</div>" +
        "<div class=\"cluster-stats\">" +
          "<span><b>" + formatINR(weight) + "</b> directed</span>" +
          "<span><b>" + wishCount + "</b></span>" +
        "</div>" +
        "<div class=\"proposal\">" +
          "<h4>AI project proposal</h4>" +
          proposalHTML +
        "</div>";

      els.clusters.appendChild(card);
    });

    // Animate the bars on the next frame (so the transition fires).
    requestAnimationFrame(function () {
      var fills = els.clusters.querySelectorAll(".bar-fill");
      fills.forEach(function (f) {
        f.style.width = f.getAttribute("data-pct") + "%";
      });
    });
  }

  // ---- Refresh-button state ----
  function setRefreshDisabled(disabled) {
    if (els.refresh) els.refresh.disabled = !!disabled;
  }

  // ---- Data load ----
  var supabaseClient = null;
  var isLoading = false;

  function loadClusters() {
    // In-flight guard: ignore rapid/concurrent invocations.
    if (isLoading) return;
    isLoading = true;
    setRefreshDisabled(true);

    var cfg = getConfig();

    if (!cfg.configured) {
      showBanner(
        "warn",
        "<span><strong>Backend not configured.</strong> " +
        "Set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> in " +
        "<code>config.js</code> to load live results. The anon key is safe to " +
        "expose &mdash; Row-Level Security guards the data.</span>"
      );
      showEmpty();
      isLoading = false;
      setRefreshDisabled(false);
      return;
    }

    if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
      showBanner(
        "error",
        "<span><strong>Could not load supabase-js.</strong> " +
        "The CDN script may be blocked. Check your network and reload.</span>"
      );
      showEmpty();
      isLoading = false;
      setRefreshDisabled(false);
      return;
    }

    hideBanner();
    setStatsLoading();
    showLoading();

    try {
      if (!supabaseClient) {
        supabaseClient = window.supabase.createClient(cfg.url, cfg.key);
      }
    } catch (e) {
      showBanner("error", "<span><strong>Failed to initialise Supabase client.</strong> " + escapeHTML(e.message || e) + "</span>");
      showEmpty();
      isLoading = false;
      setRefreshDisabled(false);
      return;
    }

    supabaseClient
      .from("clusters")
      .select("id, location_cluster, problem_cluster, location_label, problem_label, financial_weight_inr, wish_count, proposal, updated_at")
      .order("financial_weight_inr", { ascending: false })
      .then(function (res) {
        var data = res.data;
        var error = res.error;

        if (error) {
          showBanner(
            "error",
            "<span><strong>Could not fetch results.</strong> " +
            escapeHTML(error.message || "Unknown error") +
            ". Confirm the <code>clusters</code> table exists and has a public " +
            "SELECT Row-Level Security policy for the <code>anon</code> role.</span>"
          );
          showEmpty();
          return;
        }

        if (!data || data.length === 0) {
          hideBanner();
          showEmpty();
          return;
        }

        // Defensive client-side sort so #rank never depends solely on the
        // server ORDER clause (largest financial weight first).
        data.sort(function (a, b) {
          return (Number(b.financial_weight_inr) || 0) - (Number(a.financial_weight_inr) || 0);
        });

        renderStats(data);
        renderClusters(data);
        showClusters();
      })
      .catch(function (err) {
        showBanner(
          "error",
          "<span><strong>Unexpected error.</strong> " + escapeHTML(err.message || String(err)) + "</span>"
        );
        showEmpty();
      })
      .then(function () {
        // Always release the in-flight lock and re-enable refresh,
        // in both the success and error branches.
        isLoading = false;
        setRefreshDisabled(false);
      });
  }

  // ---- Wire up & boot (exactly once) ----
  if (els.refresh) {
    els.refresh.addEventListener("click", loadClusters);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadClusters, { once: true });
  } else {
    // Script is at the end of <body>, so the DOM is already parsed.
    loadClusters();
  }
})();
