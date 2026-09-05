/* ============================================================
   common.js — 全ページ共通の挙動
   - reveal演出(スクロールでフェードイン)
   - ハンバーガーメニューの開閉
   - ナビゲーションの現在地ハイライト(トップ:スクロールスパイ / サブページ:固定)
   - モバイル固定CTAバーの表示・非表示
   - 「トップへ戻る」ボタンの表示・スクロール
   - 埋め込みiframe(操船・カラー シミュレーター)の高さ自動調整
============================================================ */
(function () {
  'use strict';

  /* ---- Reveal on scroll ---- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      targets.forEach(function (t) { obs.observe(t); });
    } else {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
    }
  }

  /* ---- Hamburger menu ---- */
  function initNavToggle() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    function openNav() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      if (isOpen) { closeNav(); } else { openNav(); }
    });

    // Close the menu after a link is tapped, and on Escape.
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---- Nav active-state ----
     Pages other than the top page set <body data-page="simulator|color|company">
     and get a fixed highlight. The top page (no data-page) gets a scrollspy
     that watches each section referenced by the nav (data-nav="...").
  */
  function initNavActive() {
    var navLinks = document.querySelectorAll('#siteNav a[data-nav]');
    if (!navLinks.length) return;
    var page = document.body.getAttribute('data-page');

    if (page) {
      navLinks.forEach(function (a) {
        if (a.getAttribute('data-nav') === page) a.classList.add('active');
      });
      return;
    }

    // Scrollspy for the top page.
    var sections = [];
    navLinks.forEach(function (a) {
      var name = a.getAttribute('data-nav');
      var section = document.getElementById(name);
      if (section) sections.push({ id: name, el: section, link: a });
    });
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var current = null;
    function setActive(id) {
      if (id === current) return;
      current = id;
      sections.forEach(function (s) { s.link.classList.toggle('active', s.id === id); });
    }

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          var match = sections.find(function (s) { return s.id === id; });
          if (match) setActive(id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ---- Back-to-top button ---- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    function update() {
      if (window.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }
    window.addEventListener('scroll', update, { passive: true });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    update();
  }

  /* ---- Mobile fixed CTA bar ----
     Shows once the page's primary CTA (#ctaBarShow marker) scrolls out of
     view above the viewport, hides again once the page's contact/footer
     zone (#ctaBarHide marker) scrolls into view.
     Uses a plain scroll listener (rAF-throttled) rather than
     IntersectionObserver, so it stays correct even on a fast flick/fling
     scroll or an instant programmatic jump that skips intermediate frames
     (a jump like that can move a marker from "below the viewport" straight
     to "above the viewport" without ever reporting as intersecting, which
     would make an IntersectionObserver-only approach miss the transition).
  */
  function initMobileCtaBar() {
    var bar = document.getElementById('mobileCtaBar');
    if (!bar) return;
    var showMarker = document.getElementById('ctaBarShow');
    var hideMarker = document.getElementById('ctaBarHide');
    if (!showMarker) return;

    var ticking = false;

    function update() {
      ticking = false;
      var pastShow = showMarker.getBoundingClientRect().top < 0;
      var nearHide = hideMarker ? (hideMarker.getBoundingClientRect().top < window.innerHeight) : false;
      var visible = pastShow && !nearHide;
      bar.classList.toggle('is-visible', visible);
      document.body.classList.toggle('cta-bar-active', visible);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---- Auto-fit embedded iframes (trainer / color simulator) ---- */
  function initIframeAutoResize() {
    var frames = document.querySelectorAll('iframe[data-autoresize]');
    if (!frames.length) return;
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'yk-iframe-resize') return;
      frames.forEach(function (frame) {
        if (frame.contentWindow === e.source) {
          frame.style.height = Math.max(200, e.data.height) + 'px';
        }
      });
    });
  }

  function init() {
    initReveal();
    initNavToggle();
    initNavActive();
    initBackToTop();
    initMobileCtaBar();
    initIframeAutoResize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
