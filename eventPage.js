function openTicketInZendesk(tab) {
  var match = tab.url.match(/^https?:\/\/(.*)\.zendesk.com\/(agent\/#\/)?tickets\/(\d+)$/);

  if (match) {
    var domain  = match[1],
        pattern = '*://' + domain + '.zendesk.com/agent/*',
        id      = match[3];

    // Current tab should be ignored when looking for New Zendesk tabs (avoid new tab matching itself if tab.url is a New Zendesk url)
    chrome.tabs.query({ url: pattern, active: false }, function(tabs) {
      var lotusTab = tabs[0];

      if (lotusTab) {
        var hash = '#/tickets/' + id;
        chrome.tabs.executeScript(lotusTab.id, { code: 'window.location.hash = "' + hash + '";' })
        chrome.tabs.update(lotusTab.id, { active: true });
        chrome.tabs.remove(tab.id);
      }
    });
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  openTicketInZendesk({ id: details.tabId, url: details.url });
}, { url: [ { hostSuffix: 'zendesk.com' } ] });
