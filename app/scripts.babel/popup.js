'use strict';
let article = document.querySelector('article'),
selector = document.getElementById('cache');
// 根据localstorage生成日期选项
let historyArr = Object.keys(localStorage);
selector.innerHTML = historyArr.map(key => `<option value="${key}">${key}</option>`).join('');
selector.onchange = function(){
    article.innerHTML = localStorage.getItem(selector.selectedOptions[0].value);
}

// 获取今天的trending
let now = new Date();
let now_date = now.getDate();
let today = (now.getMonth() + 1) + '-' + now_date;
let html = localStorage.getItem(today);
if(html){
    article.innerHTML = html;
    selector.value = today;
}else{
    // 拉取新的trending
    chrome.browserAction.setBadgeText({text: 'load'});
    chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 200, 255]});

    axios.get('https://github.com/trending').then(response => {
        let trendList = /<ol[\s\S]+\<\/ol>/m.exec(response.data);
        chrome.browserAction.setBadgeText({text: 'done'});
        chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 200, 255]});
        let html = trendList[0]
        html = html.replace(/href="\/(\S+)"/gm,'href="https://github.com/$1"')
        localStorage.setItem(today, html);
        article.innerHTML = html;
        let option = document.createElement('option');
        option.textContent = today;
        option.selected = true;
        selector.appendChild(option);
    }).catch(e => {
        alert('数据获取不成功');
    })

    // 如果有上个月当天的缓存，则清除
    let dayReg = new RegExp('-' + now_date + '$')
    for (let day of historyArr) {
        if(day !== today && dayReg.test(day)){
            localStorage.removeItem(day);
            console.log('remove', day);
            let theOption = selector.querySelector(`value="${day}"`);
            theOption && theOption.remove();
        }
    }
}
// 打开项目
article.addEventListener('click',function (event) {
    if(event.target.href){
        window.open(event.target.href)
    }
})

// 清除缓存
document.getElementById('clear').addEventListener('click', function(){
    this.innerHTML = '清除完成✅'
    setTimeout(() => {
        this.innerHTML = '清除缓存'
    }, 2000)
    localStorage.clear();
})