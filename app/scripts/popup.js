'use strict';

var article = document.querySelector('article'),
    selector = document.getElementById('cache');
//生成日期选项
selector.innerHTML = Object.keys(localStorage).map(function (key) {
    return '<option value="' + key + '">' + key + '</option>';
}).join('');

selector.onchange = function () {
    article.innerHTML = localStorage.getItem(selector.selectedOptions[0].value);
};
// 获取今天的trending
var today = new Date().getDate();
var html = localStorage.getItem(today);
if (html) {
    article.innerHTML = html;
} else {
    chrome.browserAction.setBadgeText({ text: 'load' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 200, 255] });
    axios.get('https://github.com/trending').then(function (response) {
        var trendList = /<ol[\s\S]+\<\/ol>/m.exec(response.data);
        chrome.browserAction.setBadgeText({ text: 'done' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 200, 255] });
        var html = trendList[0];
        html = html.replace(/href="\/(\S+)"/gm, 'href="https://github.com/$1"');
        localStorage.setItem(new Date().getDate(), html);
        article.innerHTML = html;
        var option = document.createElement('option');
        option.textContent = new Date().getDate() + '';
        selector.appendChild(option);
    }).catch(function (e) {
        alert('数据获取不成功');
    });
}
selector.value = new Date().getDate() + '';
// 打开项目
article.addEventListener('click', function (event) {
    if (event.target.href) {
        window.open(event.target.href);
    }
});

// 清除缓存
document.getElementById('clear').addEventListener('click', function () {
    var _this = this;

    this.innerHTML = '清除完成✅';
    setTimeout(function () {
        _this.innerHTML = '清除缓存';
    }, 2000);
    localStorage.clear();
});