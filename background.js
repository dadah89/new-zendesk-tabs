  // "browser_action": {
  //   "default_name":  "New Zendesk Tabs"
  // },

function openTicketInZendesk(tab) {
  // console.log('tab before match', tab);
  var match = tab.url.match(/^https?:\/\/(.*)\.zendesk.com\/tickets\/(\d+)$/);
  if (match) {
    var domain = match[1],
        pattern = '*://' + domain + '.zendesk.com/agent/*',
        id = match[2];
    // console.log('domain', domain, 'pattern', pattern);
    // chrome.browserAction.setBadgeText({ "text": id, tabId: tab.id });
    chrome.tabs.query({ url: pattern }, function(tabs) {
      var lotusTab = tabs[0];
      // console.log('tabs', tabs);

      if (lotusTab) {
        var newUrl = 'https://' + domain + '.zendesk.com/agent/#/tickets/' + id;
        chrome.tabs.executeScript(lotusTab.id, { code: 'window.location.hash = "#/tickets/' + id + '";' })
        chrome.tabs.update(lotusTab.id, { active: true });
        chrome.tabs.remove(tab.id);
      }
    });
  }
}

chrome.tabs.onUpdated.addListener(function(tabId, props, tab) {
  if (props.status == "complete") {
    openTicketInZendesk(tab);
  }
});
