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
document.getElementById('clear').addEventListener('click', function () {
    console.log('clear');
    localStorage.clear();
});
var today = new Date().getDate();
var html = localStorage.getItem(today);
if (html) {
    article.innerHTML = html;
    selector.value = new Date().getDate() + '';
} else {
    chrome.browserAction.setBadgeText({ text: 'load' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 200, 255] });
    axios.get('https://github.com/trending').then(function (response) {
        var trendList = /<ol[\s\S]+\<\/ol>/m.exec(response.data);
        chrome.browserAction.setBadgeText({ text: 'done' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 200, 255] });
        var html = trendList[0];
        html = html.replace(/href="(\S+)"/gm, 'href="https://github.com$1"');
        localStorage.setItem(new Date().getDate(), html);
        article.innerHTML = html;
        var option = document.createElement('option');
        option.textContent = new Date().getDate() + '';
        selector.appendChild(option);
    }).catch(function (e) {
        alert('数据获取不成功');
    });
}

article.addEventListener('click', function (event) {
    if (event.target.href) {
        window.open(event.target.href);
    }
});