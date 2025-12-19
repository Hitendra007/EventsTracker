(function() {

  const API_URL = 'http://localhost:8000/api/v1/events';

  function getSessionId() {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  
  // Send event to backend API
  async function sendEvent(eventData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        console.error('Failed to send event:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }
  
  // Track page view event
  function trackPageView() {
    const eventData = {
      session_id: getSessionId(),
      event_type: 'page_view',
      page_url: window.location.href,
      timestamp: Date.now(),
    };
    
    console.log('📄 Page View Tracked:', eventData);
    sendEvent(eventData);
  }
  
  // Track click events
  function trackClick(event) {
    const eventData = {
      session_id: getSessionId(),
      event_type: 'click',
      page_url: window.location.href,
      timestamp: Date.now(),
      click_x: event.clientX,
      click_y: event.clientY,
    };
    
    console.log('🖱️ Click Tracked:', eventData);
    sendEvent(eventData);
  }
  
  function initTracking() {
    console.log('🚀 Analytics Tracker Initialized');
    
    // Track initial page view
    trackPageView();
    
    // Add click event listener to document - will detect click events on page
    document.addEventListener('click', trackClick);
  }
  
  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
})();