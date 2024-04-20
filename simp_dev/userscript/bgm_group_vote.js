// ==UserScript==
// @name         班固米贴贴投票组件
// @version      0.1
// @description  可视化地进行贴贴投票
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

    const votingComponent = createVotingComponent(title, options);
    // Append the voting component to the .postTopic div
    $('.postTopic').append(votingComponent);

    // 最后再移除 {vote} 楼层

})();

function createVotingComponent(title, votingData) {
    const maxVotes = Math.max(...votingData.map(option => option[1]));

    let html = `
      <style>
        .voting-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          color: #555;
        }
  
        .voting-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
  
        .voting-bar {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 8px;
        }
  
        .bar {
          position: relative;
          height: 30px;
          background-color: #e0e0e0;
          border-radius: 15px;
          overflow: hidden;
          width: 70%;
        }
  
        .bar-fill {
          height: 100%;
          background-color: #9ccc65;
          border-radius: 15px;
          transition: width 0.3s ease;
        }
  
        .option-text {
          margin-left: 10px;
          font-size: 14px;
          color: #333;
        }
  
        .vote-count {
          margin-left: 10px;
          font-size: 14px;
          font-weight: bold;
        }
      </style>
      <div class="voting-container">
        <div class="voting-title">${title}</div>
    `;

    votingData.forEach(option => {
        const [optionText, voteCount] = option;
        const barWidth = (voteCount / maxVotes) * 100;

        html += `
        <div class="voting-bar">
          <div class="bar">
            <div class="bar-fill" style="width: ${barWidth}%"></div>
          </div>
          <span class="option-text">${optionText}</span>
          <span class="vote-count">${voteCount} votes</span>
        </div>
      `;
    });

    html += '</div>';

    return html;
}


// --- note ---

// 想法来源于 https://bgm.tv/group/topic/356278
// 用例见 https://bgm.tv/group/topic/397128

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
// - [ ] 调整样式（样式是真没什么能力去调，只能ai无脑调，缺失一些技巧
// - [ ] 只识别楼主的userid发布的内容
// - [ ] 来一个快速格式化发布的功能，就是同时发布投票主题和选项回复
// - [ ] 考虑楼中楼的选项影响情况如何防止
