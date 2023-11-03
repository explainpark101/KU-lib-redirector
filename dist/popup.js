const redirectToLib = async () => {
    const host = window.location.host.replaceAll("." ,"-")+`-ssl.oca.korea.ac.kr`;
    if (location.host.endsWith('-ssl.oca.korea.ac.kr')){
        alert("이미 고려대학교 도서관 계정입니다.");
        return;
    }
    
    try {
        location = location.href.replace(location.host, host);
    }
    catch(err) {
        console.log(host);
        console.log(err);
        alert("리다이렉팅에 실패하였습니다.");
    }
}

const redirectTab = async () => {
    const [currentTab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        function: redirectToLib,
    }, window.close);
};
redirectTab();