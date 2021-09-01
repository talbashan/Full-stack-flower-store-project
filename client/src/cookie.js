function setCookie(response) {
    const value = "user_name=" + response
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = value + "::" + expires;
}

function getCookie() {
    console.log(document.cookie)
    let value = ""
    try {
        var all_fields = document.cookie.split('::')[0].split('-')
        var expires = document.cookie.split('::')[1]
        if (expires != "expired") {
            value = {
                firstname: all_fields[0].split('=')[1],
                id: all_fields[1],
                type: all_fields[2]
            };
        }
        return value
    }
    catch (e) {
        return "";
    }
}

export {setCookie, getCookie};