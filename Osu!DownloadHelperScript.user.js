// ==UserScript==
// @name         Osu!DownloadHelperScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add sayobot download btn to Osu! website
// @author       kongren
// @updateURL    https://github.com/gakongren/OsuDownloadHelperScript/raw/main/Osu!DownloadHelperScript.user.js
// @match        https://osu.ppy.sh/beatmapsets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        GM_xmlhttpRequest
// @connect      api.sayobot.cn
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==
/* global $,waitForKeyElements */

(function() {
    'use strict';

    function getBeatmapID(){
        return location.pathname.match(/\d+/);
    }

    function getDownloadURL(btype){
        let id = getBeatmapID();
        return 'https://dl.sayobot.cn/beatmaps/download/'+btype+'/'+id;
    }

    function initBtn(btnProto, site, desc, btype){
        let newBtn = btnProto.clone();
        let descEle = newBtn.find(".btn-osu-big__left");
        descEle.append('<span class="btn-osu-big__text-top">'+site+'</span>');
        descEle.append('<span class="btn-osu-big__text-bottom">'+desc+'</span>');
        newBtn.attr('href', getDownloadURL(btype));
        return newBtn;
    }

    function queryHasVideo(bid, onQuery){
        let query = 'https://api.sayobot.cn/v2/beatmapinfo?K='+bid;
        GM_xmlhttpRequest(
            {
                method: 'get',
                url: query,
                onload: res=>onQuery(JSON.parse(res.response))
            }
        );
    }

    let id = getBeatmapID();
    queryHasVideo(id, function(beatmapInfo){
        waitForKeyElements(".beatmapset-header__buttons", function(){
            let downloads=$(".beatmapset-header__buttons");
            if(downloads.length==1){
                let btn=$('<a class="btn-osu-big btn-osu-big--beatmapset-header " href="" data-turbolinks="false"><span class="btn-osu-big__content"><span class="btn-osu-big__left"></span><span class="btn-osu-big__icon"><span class="fa fa-fw"><span class="fas fa-download"></span></span></span></span></a>')
                if(beatmapInfo.data.video){
                    downloads.append(initBtn(btn, 'Sayobot', '包含视频', 'full'));
                }
                downloads.append(initBtn(btn, 'Sayobot', '不包含视频', 'novideo'));
            }
        });
    })
})();
