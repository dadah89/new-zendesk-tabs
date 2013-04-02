function openTicketInZendesk(tab) {
  console.log('tab before match', tab);
  var match = tab.url.match(/^https?:\/\/(.*)\.zendesk.com\/tickets\/(\d+)$/);
  if (match) {
    var domain  = match[1],
        pattern = '*://' + domain + '.zendesk.com/agent/*',
        id      = match[2];
    // console.log('domain', domain, 'pattern', pattern);
    chrome.tabs.query({ url: pattern }, function(tabs) {
      var lotusTab = tabs[0];
      // console.log('tabs', tabs);

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
  console.log('onBeforeNavigate details', details);
  openTicketInZendesk({ id: details.tabId, url: details.url });
}, { url: [ { hostSuffix: 'zendesk.com' } ] });
