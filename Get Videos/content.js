chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getDOM") sendResponse({ dom: document.all[0].outerHTML });
});
