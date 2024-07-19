javascript: (function () { var video = document.querySelector('video'); if (!video) { alert('Video element not found!'); return; } var canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; var context = canvas.getContext('2d'); context.drawImage(video, 0, 0, canvas.width, canvas.height); canvas.toBlob(function (blob) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'screenshot.png'; a.click(); }, 'image/png'); })();

// 暂时不知道为何这个是无效的
javascript: (
    function () {
        // 获取视频元素
        var video = document.querySelector('video');

        // 创建一个Canvas元素
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 将视频当前帧绘制到Canvas上
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 将Canvas内容转换为图片数据
        canvas.toBlob(function (blob) {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'screenshot.png'; // 设置下载文件名
            a.click();
        }, 'image/png');
    }()
)
