(async () => {
    const redirectURL = await get_value_from_chrome_storage("redirect-url");
    const originURL = await get_value_from_chrome_storage("orgin-url");
    const last_redirected_time = await get_value_from_chrome_storage("redirected-time");
    if ([redirectURL, originURL].includes(location.href) && last_redirected_time) 
        set_value_at_chrome_storage("redirected-time", 0);
})();