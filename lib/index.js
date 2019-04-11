
var SA_SERVER = 'https://sa.lagou.com/collect.gif';
var _navigator = navigator,
    userAgent = _navigator.userAgent,
    appVersion = _navigator.appVersion,
    browserName = _navigator.appName;
var fullVersion = String(parseFloat(appVersion));
var OSName = 'Unknown OS';
var verOffset;
var ix;
var nameOffset;

// 浏览器名称
if ((verOffset = userAgent.indexOf('Opera')) !== -1) {
    browserName = 'Opera';
    fullVersion = userAgent.substring(verOffset + 6);
    if ((verOffset = userAgent.indexOf('Version')) !== -1) fullVersion = userAgent.substring(verOffset + 8);
} else if ((verOffset = userAgent.indexOf('MSIE')) !== -1) {
    browserName = 'Microsoft Internet Explorer';
    fullVersion = userAgent.substring(verOffset + 5);
} else if ((verOffset = userAgent.indexOf('Chrome')) !== -1) {
    browserName = 'Chrome';
    fullVersion = userAgent.substring(verOffset + 7);
} else if ((verOffset = userAgent.indexOf('Safari')) !== -1) {
    browserName = 'Safari';
    fullVersion = userAgent.substring(verOffset + 7);
    if ((verOffset = userAgent.indexOf('Version')) !== -1) fullVersion = userAgent.substring(verOffset + 8);
} else if ((verOffset = userAgent.indexOf('Firefox')) !== -1) {
    browserName = 'Firefox';
    fullVersion = userAgent.substring(verOffset + 8);
} else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (verOffset = userAgent.lastIndexOf('/'))) {
    browserName = userAgent.substring(nameOffset, verOffset);
    fullVersion = userAgent.substring(verOffset + 1);
    if (browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = _navigator.appName;
    }
}

// 系统名称
if (userAgent.indexOf('Win') !== -1) {
    OSName = 'Windows';
} else if (userAgent.indexOf('Mac') !== -1) {
    OSName = 'MacOS'
} else if (appVersion.indexOf('X11') !== -1) {
    OSName = 'UNIX'
} else if (userAgent.indexOf('Linux') !== -1) {
    OSName = 'Linux'
} else if (userAgent.indexOf('Android') !== -1) {
    OSName = 'Android'
} else if (userAgent.indexOf('like Mac') !== -1) {
    OSName = 'iOS'
}

//版本号
if ((ix = fullVersion.indexOf(';')) !== -1) fullVersion = fullVersion.substring(0, ix);
if ((ix = fullVersion.indexOf(' ')) !== -1) fullVersion = fullVersion.substring(0, ix);

var majorVersion = parseInt(String(fullVersion), 10);
if (isNaN(majorVersion)) {
    fullVersion = String(parseFloat(appVersion));
    majorVersion = parseInt(appVersion, 10);
}

// 用户基本信息
var _lgUserSimpleInfo = {};
if (window.CONST_VARS) {
    var _company = window.CONST_VARS('company');
    var _user = window.CONST_VARS('user');
    _lgUserSimpleInfo.LGID = _user.id;
    _lgUserSimpleInfo.easy_company_id = _company.id;
    _lgUserSimpleInfo.lagou_company_id = _company.lgId;
}

module.exports.lgSa = {

    defaultBrowserParam: function() {
        return {
            lt: 'pcclick',
            os: OSName,
            browser: browserName,
            browser_version: fullVersion,
            screen_height: window.screen.height,
            screen_width: window.screen.width,
        }
    },

    defaultUserInfo: function() {
        return Object.assign(_lgUserSimpleInfo, {
            time: (new Date()).getTime()
        });
    },

    track: function(event, actions) {
        if (actions instanceof Object){

            //处理所有手动传递过来的参数
            var allLogData = {
                page_id: event || '',
                click_props: {}
            };

            for (var actionKey in actions) {
                if (actions.hasOwnProperty(actionKey)){
                    if (actionKey === 'address_id' || actionKey === 'content_id') {
                        allLogData[actionKey] = actions[actionKey];
                    }
                    else {
                        allLogData.click_props[actionKey] = String(actions[actionKey]);
                    }
                }
            }

            allLogData = Object.assign(allLogData, this.defaultBrowserParam(), this.defaultUserInfo());

            var uploadLogImg=new Image();
            uploadLogImg.src=`${SA_SERVER}?plat=PC&data=${encodeURIComponent(JSON.stringify(allLogData))}`;
        } else {
            console.warn('error type: not standard object!');
        }
    },

    twoPlatTrack: function(event, actions = {}) {
        this.track(event, actions);

        if (window.sa) {
            if (actions.address_id) {
                actions.aId = actions.address_id;
                delete actions.address_id;
            }
            if (actions.content_id) {
                actions.content = actions.content_id;
                delete actions.content_id;
            }

            window.sa.track(event, actions);
        }

    }
};
window.lgSa = lgSa;