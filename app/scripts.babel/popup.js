'use strict';
let article = document.querySelector('article'),
selector = document.getElementById('cache');
//生成日期选项
selector.innerHTML = Object
                .keys(localStorage)
                .map(key => `<option value="${key}">${key}</option>`)
                .join('');

selector.onchange = function(){
    article.innerHTML = localStorage.getItem(selector.selectedOptions[0].value);
}
document.getElementById('clear').addEventListener('click', function(){
    console.log('clear')
    localStorage.clear();
})
let today = new Date().getDate()
let html = localStorage.getItem(today);
if(html){
    article.innerHTML = html;
    selector.value = new Date().getDate() + '';
}else{
    chrome.browserAction.setBadgeText({text: 'load'});
    chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 200, 255]});
    axios.get('https://github.com/trending').then(response => {
        let trendList = /<ol[\s\S]+\<\/ol>/m.exec(response.data);
        chrome.browserAction.setBadgeText({text: 'done'});
        chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 200, 255]});
        let html = trendList[0]
        html = html.replace(/href="(\S+)"/gm,'href="https://github.com$1"')
        localStorage.setItem(new Date().getDate(), html);
        article.innerHTML = html;
        let option = document.createElement('option');
        option.textContent = new Date().getDate() + '';
        selector.appendChild(option);
    }).catch(e => {
        alert('数据获取不成功');
    })
}

article.addEventListener('click',function (event) {
    if(event.target.href){
        window.open(event.target.href)
    }
})