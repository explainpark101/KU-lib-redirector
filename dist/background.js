// 도서관 로그인 페이지로 리다이렉트되면,
// 기존의 url을 가져와서, 
// 로그인이 완료된 상태의 "https://library.korea.ac.kr/" == location.href 이면 기존의 url로 리다이렉트 시켜주고
// 기존의 url은 chrome.storage에서 삭제함.
// 
(async () => {
  const get_value_from_chrome_storage = (key) => (new Promise(res=>{chrome.storage.local.get(key, res)})).then(resp=>resp?.[key]);
  const set_value_at_chrome_storage = (key, value) => chrome.storage.local.set(Object.fromEntries([[key, value]]));

  const redirectToLib = (href, 학교명) => {
      set_value_at_chrome_storage("orgin-url", href);
      const 학교목록 = {
          연세대학교: "-ssl.access.yonsei.ac.kr",
          고려대학교: "-ssl.oca.korea.ac.kr",
          한양대학교: "-ssl.access.hanyang.ac.kr",
      }
      let original_host =  (new URL(href)).host;
      for ([학교이름, url] of Object.entries(학교목록)) {
          if (!original_host.endsWith(url)) continue;
          original_host = original_host.replaceAll(url, '');
          break;
      }
      
      
      const host = original_host.replaceAll("." ,"-") + 학교목록[학교명];
      let url_host = (new URL(href)).host;
      
      console.log(original_host, href.replace(url_host, host), url_host.endsWith(학교목록[학교명]));
      set_value_at_chrome_storage("redirected-time", Date.now());
      if (url_host.endsWith(학교목록[학교명])) {
          return href;
      }
      
      set_value_at_chrome_storage("changed-url", href.replace(url_host, host));
      return href.replace(url_host, host);
  };


  chrome.runtime.onInstalled.addListener(() => {
      chrome.contextMenus.create({
        id: "lib-redirect",
        title: "도서관 계정으로 리다이렉트",
        contexts: ["page"]
      });
  })


  async function onClick (info){
      if (info.menuItemId === "lib-redirect") {
          const redirectURL = redirectToLib((info.pageUrl), (await get_value_from_chrome_storage("default_lib") ?? "고려대학교"));
          
          set_value_at_chrome_storage("redirect-url", redirectURL);

          chrome.tabs.create({url: redirectURL}, (_tab) => {
              // chrome.tabs.onUpdated.addListener(async function listener(tabId, changeInfo) {
              //     if (tabId !== _tab.id || changeInfo.status !== 'complete') return;
              //     const last_redirected_time = await get_value_from_chrome_storage("redirected-time");
              //     const changedUrl = await get_value_from_chrome_storage("changed-url");
              // });
          })
        }
  }

  chrome.contextMenus.onClicked.addListener((...args)=>onClick(...args));
})();
