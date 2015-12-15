var PROJECT_NAME = {
    controls: {
    },
    browser: (function () {

        var os = '',
            version,
            ua = window.navigator.userAgent,
            platform = window.navigator.platform,
            result = {
                os: {
                    win: false,
                    mac: false,
                    linux: false,
                    android: false,
                    ios: false
                },
                browser: {
                    opera: false,
                    ie: false,
                    firefox: false,
                    chrome: false,
                    safari: false,
                    android: false
                },
                version: 0
            };

        if (/MSIE/.test(ua)) {
            version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
            result.browser.ie = true;
            result.version = parseInt(version, 10);
        } else if (/Android/.test(ua)) {
            result.os.android = true;
            result.browser.android = true;

            if (/Chrome/.test(ua)) {
                version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
                result.version = parseInt(version, 10);
                result.browser.chrome = true;

                result.browser.android = false;
            }

            if (/Firefox/.test(ua)) {
                version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
                result.browser.firefox = true;
                result.version = parseInt(version, 10);

                result.browser.android = false;
            }

        } else if (/Chrome/.test(ua)) {
            version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
            result.browser.chrome = true;
            result.version = parseInt(version, 10);
        } else if (/Opera/.test(ua)) {
            result.browser.opera = true;
        } else if (/Firefox/.test(ua)) {
            version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
            result.browser.firefox = true;
            result.version = parseInt(version, 10);
        } else if (/Safari/.test(ua)) {

            if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) {
                result.os.ios = true;
            }

            result.browser.safari = true;
        }

        if (!version) {

            version = /Version\/[\.\d]+/.exec(ua);

            if (version) {

                if (version) {
                    version = version[0].split('/')[1];
                } else {
                    version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
                }

                result.version = parseInt(version, 10);
            } else {

                if (document.all.length) {
                    result.version = 11;
                    result.browser.ie = true;
                }

            }
        }

        if (platform === 'MacIntel' || platform === 'MacPPC') {
            result.os.mac = true;
        } else if (platform === 'Win32' || platform === 'Win64') {
            result.os.win = true;
        } else if (!os && /Linux/.test(platform)) {
            result.os.linux = true;
        } else if (!os && /Windows/.test(ua)) {
            result.os.win = true;
        } else if (!os && /android/.test(ua)) {
            result.os.android = true;
        }

        return result;

    }()),
    global: {
        addEvents: function (list, event, handler) {
            var count = list.length,
                i;

            for (i = 0; i < count; i++) {
                list[i].addEventListener(event, handler, false);
            }
        }
    },

    getControls: function () {
        var ctrl = PROJECT_NAME.controls;
    },

    setEventList: function () {
        var ctrl = PROJECT_NAME.controls,
            global = PROJECT_NAME.global;
    },

    setConfig: function () {
        var ctrl = PROJECT_NAME.controls;
    },

    init: function () {
        window.addEventListener('DOMContentLoaded', function () {
            PROJECT_NAME.getControls();
            PROJECT_NAME.setEventList();
            PROJECT_NAME.setConfig();
        }, false);
    }
};

PROJECT_NAME.init();