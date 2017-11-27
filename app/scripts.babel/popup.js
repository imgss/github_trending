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
let html = localStorage.getItem(new Date().getDate());
if(html){
    article.innerHTML = html;
}else{
    axios.get('https://github.com/trending').then(response => {
        let trendList = /<ol[\s\S]+\<\/ol>/m.exec(response.data);
        let html = trendList[0]
        html = html.replace(/href="(\S+)"/gm,'href="https://github.com$1"')
        localStorage.setItem(new Date().getDate(), html);//每月一号会覆盖之前的记录
        article.innerHTML = html;
    }).catch(e => {
        alert('数据获取不成功');
    })
}

article.addEventListener('click',function (event) {
    if(event.target.href){
        window.open(event.target.href)
    }
})