// ==UserScript==
// @name         Bangumi Great Backup
// @description  备份你的bangumi账户！
// @version      0.1
// @author       xban
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/.*$/
// @license      MIT


// 含：
// 基本：点格子记录[短评、评分、进度状态、统计]、日志、时间胶囊、朋友列表[用户名、uid]、
// 参与小组列表、维基编辑记录、签名、介绍
// 人物、日志、目录
// 尝试：小组发表帖子
// 不含，暂时无能为力，有思路请指教：回复过的帖子和自己的回复楼层、条目单集个人吐槽、条目讨论[发表和回复]、人物评论、日志评论

// 脚本能做到的事情有限，做一个基本备份吧。完整版还是直接用别的方法。脚本倒是也有优势，就是可以免去验证。
// 暂时就是先试试纯js，比较可以跳过鉴权，看能备份多少东西


var uname = $('.avatar').attr('href').split('/').pop();
var userHash = $('#badgeUserPanel li a').last().attr('href').split('/').pop();
var pathType = [
    [`/user/${uname}/mono/.+`, 'mono'],
    [`/anime/list/${uname}/.+`, 'list'],
    [`/user/${uname}/timeline$`, 'timeline'],
    [`/user/${uname}/friends$`, 'friends'],
    [`/user/${uname}/blog$`, 'reviews'],
    [`/user/${uname}/index$`, 'index'],
    [`/user/${uname}/index/collect$`, 'indexCollection'],
    [`/user/${uname}/groups$`, 'groups'],
];


// 可以参考 RSS 进行抓取
(function() {

})();