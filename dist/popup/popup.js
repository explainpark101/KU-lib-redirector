const get_value_from_chrome_storage = (key) => (new Promise(res=>{chrome.storage.local.get(key, res)})).then(resp=>resp?.[key]);
const set_value_at_chrome_storage = (key, value) => chrome.storage.local.set(Object.fromEntries([[key, value]]));

const redirectToLib = async (학교명) => {
    const 학교목록 = {
        연세대학교: "-ssl.access.yonsei.ac.kr",
        고려대학교: "-ssl.oca.korea.ac.kr",
        한양대학교: "-ssl.access.hanyang.ac.kr",
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
    set_value_at_chrome_storage("default_lib", 학교명);
};

document.querySelector("div.button-group").addEventListener("click", async (e)=>{
    let target = e.target;
    while(target?.tagName != "BUTTON" && target != e.currentTarget) target = target.parentElement;
    set_value_at_chrome_storage("default_lib", (e.target.dataset?.name || e.target.parentElement.dataset?.name));
    document.querySelectorAll("div.button-group button").forEach(el=>el.classList.remove("selected"));
    target.classList.add("selected");
});
(async () => {
    const defaultLibrary = await get_value_from_chrome_storage("default_lib") ?? "고려대학교";
    document.querySelectorAll("div.button-group button").forEach(el=>{
        el.classList.remove("selected");
        if(el.dataset?.name == defaultLibrary) el.classList.add("selected");
    });
})();