chrome.runtime.onInstalled.addListener(() => {
  console.log('[QA Extension] Helper installed and ready.')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_TENANT_INFO') {
    sendResponse({ tenant: 'QA-Internal-Dmo', type: 'Enterprise' })
  }
})
