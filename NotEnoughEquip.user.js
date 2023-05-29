// ==UserScript==
// @name        GuguTown Automatic Beach Refresh
// @name:zh-CN  咕咕镇沙滩自动刷新
// @name:zh-TW  咕咕鎮沙灘自動刷新
// @name:ja     咕咕镇ビーチの自動更新
// @namespace   https://github.com/GuguTown/NotEnoughEquip
// @homepage    https://github.com/GuguTown/NotEnoughEquip
// @version     0.1.02
// @description WebGame GuguTown Automatic Beach Refresh.
// @description:zh-CN 气人页游 咕咕镇 沙滩自动刷新。
// @description:zh-TW 氣人頁遊 咕咕鎮 沙灘自動刷新。
// @description:ja オンラインゲーム 咕咕镇 ビーチの自動更新
// @icon        https://sticker.inari.site/favicon.ico
// @author      ikarosf
// @copyright   2020.09-2023.04 ikarosf
// @match       https://*.guguzhen.com/fyg_beach.php
// @match       https://*.momozhen.com/fyg_beach.php
// @run-at      document-end
// @license     MIT License
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// ==/UserScript==
/* eslint-env jquery */

function FLASHbeach() {
    'use strict';
    var xingshaflashremainder = 0;
    var flashbyxingshaNUM = 0;
    if(FM_getValue('flashbyxingshaNUM')!=null){
        flashbyxingshaNUM = FM_getValue('flashbyxingshaNUM');
    }

    var flashbyxingshaNUMbox = document.createElement("div")
    flashbyxingshaNUMbox.setAttribute('style',"display: inline-block;float: right!important;");

    let flashbyxingshaNUMlabel = document.createElement('i');
    flashbyxingshaNUMlabel.innerText = "使用随机装备箱刷新次数：";
    flashbyxingshaNUMbox.appendChild(flashbyxingshaNUMlabel);

    let flashbyxingshaNUMInput = document.createElement('input');
    flashbyxingshaNUMInput.setAttribute('type','text');
    flashbyxingshaNUMInput.setAttribute('oninput',"value=value.replace(/[^\\d]/g,'')");
    flashbyxingshaNUMInput.setAttribute('style',"width: 40px;margin-right:15px;");
    flashbyxingshaNUMInput.value = flashbyxingshaNUM;
    flashbyxingshaNUMInput.onchange = function(){
        var localNUM = parseInt(flashbyxingshaNUMInput.value);
        if(isNaN(localNUM)){
            flashbyxingshaNUM = 0;
        }else{
            if(localNUM>20){
                localNUM = 20;
            }else if(localNUM<0){
                localNUM = 0;
            }
            flashbyxingshaNUM = localNUM;
        }
        FM_setValue('flashbyxingshaNUM',flashbyxingshaNUM );
    };
    flashbyxingshaNUMbox.appendChild(flashbyxingshaNUMInput);
    $(".btn-group.pull-right").after(flashbyxingshaNUMbox)




    var mydiv = $(".row>.row>.col-md-12>.panel>.panel-heading>.pull-right")[0];
    var text = mydiv.textContent
    if(!text.startsWith("距离下次随机装备")){
        alert("咕咕镇沙滩自动刷新脚本未获取到时间！");
        return;
    }
    var patt1 = /\d+/;
    var minute = text.match(patt1)
    minute = parseInt(minute[0]) + 1
    setTimeout(async function(){
        await getstpage()
        await getstdata()
        for(var i = 0;i < flashbyxingshaNUM ; i++){
            await sxstbyxs()
            await getstpage()
            await getstdata()
        }
        unsafeWindow.location.reload();
    }, minute*60*1000);
    mydiv.textContent = text + " 将自动刷新"

}

var user = $("button[class*='btn btn-lg'][onclick*='fyg_index.php']")[0].innerText;

function FM_setValue(name, value){
    var oldvalue = GM_getValue(user);
    if(oldvalue === undefined){
        oldvalue = {};}
    oldvalue[name] = value;
    GM_setValue(user,oldvalue);
}

function FM_getValue(name, defaultValue){
    var thisvalue = GM_getValue(user);
    if(thisvalue != undefined&&name in thisvalue){
        return thisvalue[name]
    }
    if(defaultValue != null){
        return defaultValue;
    }
    return null;
}

function getPostData(p1,p2){
    let data = -1;
    for(let s of document.getElementsByTagName('script')){
        let func = s.innerText.match(p1)
        if(func!=null){
            data = func[0].match(p2)[0];
            break;
        }
    }
    return data
}

function get_saveid(){
    return getPostData(/gx_sxst\(\)\{[\s\S]*\}/m,/data: ".*"/).slice(-7,-1);
}

function getstpage(){
    return new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
            method: "get",
            url:   unsafeWindow.location.origin + "/fyg_beach.php",
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(res){
                if(res.status === 200){
                    //console.log(res.responseText)
                    resolve(res.responseText)
                }else{
                    console.log(res)
                    reject()
                }
            },
            onerror : function(err){
                console.log(err)
                reject()
            }
        });
    })
}

function getstdata(){
    return new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
            method: "post",
            url:   unsafeWindow.location.origin + "/fyg_read.php",
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data:"f=1",
            onload: function(res){
                if(res.status === 200){
                    //console.log(res.responseText)
                    resolve(res.responseText)
                }else{
                    console.log(res)
                    reject()
                }
            },
            onerror : function(err){
                console.log(err)
                reject()
            }
        });
    })
}

function sxstbyxs(){
    return new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
            method: "post",
            url:   unsafeWindow.location.origin + "/fyg_click.php",
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data:"c=12&safeid=" + get_saveid(),
            onload: function(res){
                if(res.status === 200){
                    console.log(res.responseText)
                    resolve(res.responseText)
                }else{
                    console.log(res)
                    reject()
                }
            },
            onerror : function(err){
                console.log(err)
                reject()
            }
        });
    })
}

FLASHbeach();
unsafeWindow.FM_getValue = FM_getValue;
