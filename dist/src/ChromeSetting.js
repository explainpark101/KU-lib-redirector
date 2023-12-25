const get_value_from_chrome_storage = (key) => (new Promise(res=>{chrome.storage.local.get(key, res)})).then(resp=>resp?.[key]);
const set_value_at_chrome_storage = (key, value) => chrome.storage.local.set(Object.fromEntries([[key, value]]));
