const redirectToLib = (학교명) => {
    const 학교목록 = {
        연세대학교: "-ssl.access.yonsei.ac.kr",
        고려대학교: "-ssl.oca.korea.ac.kr",
    }
    let original_host = location.host;
    for ([학교이름, url] of Object.entries(학교목록)) {
        if (location.host.endsWith(url)) {
            if (!confirm(`이미 ${학교이름} 도서관으로 리다이렉팅 되어있습니다.\n다시 리다이렉트 하시겠습니까?`)) return;
            original_host = original_host.replace(url, '').replaceAll("-",".");
        }
    }
    const host = original_host.replaceAll("." ,"-") + 학교목록[학교명];
    if (location.host.endsWith(학교목록[학교명])){
        alert(`이미 ${학교명} 도서관 계정입니다.`);
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
};


const redirectTab = async 학교명 => {
    const [currentTab] = await chrome.tabs.query({active: true, currentWindow: true});
    await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: redirectToLib,
        args: [ 학교명 ],
    }, window.close);
};

document.querySelector("div.button-group").addEventListener("click", async (e)=>{
    await redirectTab(e.target.dataset?.name || e.target.parentElement.dataset?.name || alert('err'));
})