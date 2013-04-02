function openTicketInZendesk(tab) {
  var match = tab.url.match(/^https?:\/\/(.*)\.zendesk.com\/tickets\/(\d+)$/);

  if (match) {
    var domain  = match[1],
        pattern = '*://' + domain + '.zendesk.com/agent/*',
        id      = match[2];

    chrome.tabs.query({ url: pattern }, function(tabs) {
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
