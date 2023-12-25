(async () => {
    const redirectURL = await get_value_from_chrome_storage("redirect-url");
    const originURL = await get_value_from_chrome_storage("orgin-url");
    const last_redirected_time = await get_value_from_chrome_storage("redirected-time");
    const sleep = t=>new Promise(r=>setTimeout(r, t));

    if (![redirectURL, originURL].includes(location.href) && (Date.now() - last_redirected_time) < 60*1000)  {
        set_value_at_chrome_storage('redirected-time', 0);
        await sleep(50);
        location  = redirectURL;
    }
})();
