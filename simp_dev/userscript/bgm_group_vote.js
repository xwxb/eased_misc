// ==UserScript==
// @name         班固米帖帖投票组件
// @version      0.1
// @description  可视化地进行帖帖投票
// @match        https://bgm.tv/group/topic/*
// @match        https://bamgumi.tv/group/topic/*
// @match        https://chii.in/group/topic/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const replyList = $('#comment_list div');
    let title = '';
    let options = [];
    replyList.slice(0, 3).each(function () {
        const messageDiv = $(this).find('.message');
        const messageContent = messageDiv.text();
        if (messageContent.startsWith('{vote}')) {
            // get title
            title = messageContent.replace('{vote}', '').trim();
            title = title.replace(/\n/g, '');

            // find options
            const subReplyDivs = $(this).find('.sub_reply_bg>.inner');
            subReplyDivs.each(function () {
                const subReplyMsg = $(this).find('.cmt_sub_content');
                const subContent = subReplyMsg.text();
                if (subContent.startsWith('{opt}')) {
                    const option = subContent.replace('{opt}', '').trim();

                    // 统计帖帖： 1. 只统计 +1 类型帖帖的数量，应该是选择 data-like-value=140就行
                    const plusOneReactionCntString = $(this).find('.item').filter('.selected').filter('[data-like-value="140"]').find('.num');
                    const cnt = plusOneReactionCntString.text() || '0';
                    const optionPair = [option, parseInt(cnt)];
                    options.push(optionPair);
                }
            });
            return false; // exit the each loop if '{vote}' is found
        }
    });

    // log titile and opts
    console.log(title, options)

    // 先在主楼提供一个可视化投票的组件和投票按钮
    // Create the voting component
    const votingComponent = $('<div>').addClass('voting-component');

    // Create the title element
    const titleElement = $('<h2>').text(title).addClass('voting-title');
    votingComponent.append(titleElement);

    // Create the options list
    const optionsList = $('<ul>').addClass('voting-options');
    options.forEach(option => {
        const optionItem = $('<li>').addClass('voting-option');
        const optionText = $('<span>').text(option[0]).addClass('option-text');
        const voteCount = option[1];
        const voteBarLen = voteCount * 3;
        const voteBarContainer = $('<div>').addClass('vote-bar-container');
        const voteBar = $('<div>').addClass('vote-bar').css('width', `${voteBarLen}px`);
        const voteCountText = $('<span>').text(voteCount).addClass('vote-count');
        voteBarContainer.append(voteBar);
        optionItem.append(optionText, voteBarContainer, voteCountText);
        optionsList.append(optionItem);
    });
    votingComponent.append(optionsList);

    // Append the voting component to the .postTopic div
    $('.postTopic').append(votingComponent);

    // Add styling to create a bar chart effect
    $('.vote-bar').css({
        'background-color': 'blue',
        'height': '10px',
        'margin-top': '5px',
        'transition': 'width 0.5s ease-in-out'
    });

    // Add styling to the vote count text
    $('.vote-count').css({
        'margin-left': '5px'
    });

    // 最后再移除 {vote} 楼层

})();




// --- note ---

// 想法来源于 https://bgm.tv/group/topic/356278

// 有帖帖之后，这个想法有了新的实现

// ---
// 抛弃的想法：
// 目前构思的语法是这样的，有改进欢迎提：
// ```
// {vote}[title, option1, option2, ...]
// ```

// 然后自动在前三楼找到，title 的回帖，然后在子楼层找到选项，使用 +1 帖帖进行投票
// （这样设计的主要目的是可以不用太担心会被抢楼影响投票，缺点是需要确保 title 和 option 确实出现两次）

// 然后暂时没考虑设置截止时间和单多选，因为帖帖统计也没法拦截
// 语法目前是尽量简单，再复杂点就需要考虑做一个生成器了

// 实现思路：
// 1. 识别正文内容，找到 `{vote}` ，触发脚本，否则就直接结束
// 2. 识别进 title 和 options，存入变量，然后在前三楼回帖中先定位 title 和 options
// 3. 去掉当前楼层的显示，把投票组件渲染进主楼，添加投票增加帖帖js

// ---

// 主要考虑方便写、弱依赖（不装组件也还看着挺正常）
// 新的设计：
// 1. 直接识别前三层有 `{vote}` ，然后直接根据回复的 `{opt}` 标记识别选项（处理回车）
// 2. 识别完之后，还是删除 `{vote}` 楼层
// 3. 主楼添加投票组件，设置增加帖帖 JS

// 有考虑可能有恶意影响投票组件的行为存在
// 这个基本也不能完全解决，只能靠时间顺序来大致解决
// 目前的规则是这样：
// 1. 只识别首个 {vote} 一级楼层
// 2. 是识别和 {vote} 相同 user_id 的子回复 （还没实现）


// ---

// 未来计划：
// - [ ] 只识别楼主的userid发布的内容
// - [ ] 来一个快速格式化发布的功能，就是同时发布投票主题和选项回复
// - [ ] 考虑楼中楼的选项影响情况如何防止
