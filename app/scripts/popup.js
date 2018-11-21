'use strict';

var article = document.querySelector('article'),
    selector = document.getElementById('cache');
// 根据localstorage生成日期选项
var historyArr = Object.keys(localStorage);
selector.innerHTML = historyArr.map(function (key) {
    return '<option value="' + key + '">' + key + '</option>';
}).join('');
selector.onchange = function () {
    article.innerHTML = localStorage.getItem(selector.selectedOptions[0].value);
};

// 获取今天的trending
var now = new Date();
var now_date = now.getDate();
var today = now.getMonth() + 1 + '-' + now_date;
var html = localStorage.getItem(today);
if (html) {
    article.innerHTML = html;
    selector.value = today;
} else {
    // 拉取新的trending
    chrome.browserAction.setBadgeText({ text: 'load' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 200, 255] });

    axios.get('https://github.com/trending').then(function (response) {
        var trendList = /<ol[\s\S]+\<\/ol>/m.exec(response.data);
        chrome.browserAction.setBadgeText({ text: 'done' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 200, 255] });
        var html = trendList[0];
        html = html.replace(/href="\/(\S+)"/gm, 'href="https://github.com/$1"');
        localStorage.setItem(today, html);
        article.innerHTML = html;
        var option = document.createElement('option');
        option.textContent = today;
        option.selected = true;
        selector.appendChild(option);
    }).catch(function (e) {
        alert('数据获取不成功');
    });

    // 如果有上个月当天的缓存，则清除
    var dayReg = new RegExp('-' + now_date + '$');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = historyArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var day = _step.value;

            if (day !== today && dayReg.test(day)) {
                localStorage.removeItem(day);
                console.log('remove', day);
                var theOption = selector.querySelector('value="' + day + '"');
                theOption && theOption.remove();
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
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