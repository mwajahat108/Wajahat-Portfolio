/**
 * Portfolio JavaScript: Muhammad Wajahat
 * Web Engineering Submission
 *
 * Lightweight, accessible vanilla JS for:
 * 1. Mobile menu toggle & accessible ARIA state management
 * 2. Sticky navigation height offset & smooth scrolling fallback
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // DOM Elements
  // -------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopLink = document.getElementById('back-to-top');

  // -------------------------------------------------------------------------
  // Helper: Get Current Sticky Header Height
  // -------------------------------------------------------------------------
  function getHeaderHeight() {
    return header ? header.offsetHeight : 74;
  }

  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle & Accessibility
  // -------------------------------------------------------------------------
  function closeMobileMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-active');
  }

  function openMobileMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-active');
  }

  function toggleMobileMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when user clicks outside the header
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press for keyboard accessibility
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
        navToggle.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Smooth Scrolling with Sticky Nav Offset
  // -------------------------------------------------------------------------
  /**
   * Smoothly scrolls to target section accounting for the fixed/sticky header
   * @param {string} targetId - CSS selector for target element (e.g. "#about")
   */
  function scrollToTarget(targetId) {
    if (targetId === '#top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const navOffset = getHeaderHeight();
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Set focus to the section for screen readers / keyboard users
    targetElement.setAttribute('tabindex', '-1');
    targetElement.focus({ preventScroll: true });
  }

  // Attach smooth scrolling to all in-page anchor links
  const internalAnchors = document.querySelectorAll('a[href^="#"]');

  internalAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      // Close mobile menu if open
      closeMobileMenu();

      // Check if target exists on page
      if (href === '#top' || document.querySelector(href)) {
        e.preventDefault();
        scrollToTarget(href);

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, '', href);
        } else {
          location.hash = href;
        }
      }
    });
  });

})();
