// Visits and contact-button clicks are separate from confirmed customer inquiries.
(() => {
  'use strict';
  if (window.moavanAnalyticsLoaded) return;
  window.moavanAnalyticsLoaded = true;
  const measurementId = 'G-0SCHQV5RPX';
  const current = new URL(location.href);
  const rules = {
    utm_source: /^(threads|facebook|instagram|naver|youtube|wordpress)$/,
    utm_medium: /^(organic_social|owned_content)$/,
    utm_campaign: /^(moavan_daily3|MOAVAN_PG_\d{6})$/,
    utm_content: /^(g\d{3}-(info|promo)-(steps|faq)|pg_\d{1,10})$/
  };
  const attribution = {};
  for (const [key, rule] of Object.entries(rules)) {
    const value = current.searchParams.get(key);
    if (value && rule.test(value)) attribution[key] = value;
  }
  // Carry only known campaign fields along the guide -> product-page journey.
  for (const link of document.querySelectorAll('a[href]')) {
    if (link.getAttribute('href').startsWith('#')) continue;
    const destination = new URL(link.href, current);
    if (destination.origin !== current.origin || !['http:', 'https:'].includes(destination.protocol)) continue;
    for (const [key, value] of Object.entries(attribution)) {
      if (!destination.searchParams.has(key)) destination.searchParams.set(key, value);
    }
    link.href = destination.href;
  }
  // Local previews never send test traffic to the production analytics property.
  if (!['moavan.com', 'www.moavan.com'].includes(current.hostname)) return;
  const page = new URL(current.origin + current.pathname);
  for (const [key, value] of Object.entries(attribution)) page.searchParams.set(key, value);
  let referrer = '';
  try { referrer = new URL(document.referrer).origin; } catch { /* direct visit */ }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    page_location: page.href,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  window.gtag('event', 'page_view', {
    send_to: measurementId,
    page_location: page.href,
    page_referrer: referrer,
    page_title: document.title
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  tag.referrerPolicy = 'no-referrer';
  document.head.append(tag);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const destination = new URL(link.href, current);
    const method = destination.protocol === 'tel:' ? 'phone'
      : destination.protocol === 'sms:' ? 'sms'
      : destination.hostname === 'pf.kakao.com' && destination.pathname === '/_IxbxgXG/chat' ? 'kakao' : null;
    if (!method) return;
    // No form values, contact text, phone numbers or arbitrary URL queries.
    window.gtag('event', 'contact_click', {
      send_to: measurementId,
      contact_method: method,
      content_key: attribution.utm_content || 'direct',
      page_location: page.href,
      page_referrer: referrer
    });
  });
})();
