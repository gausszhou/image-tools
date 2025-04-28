
// 获取图片尺寸
function getImageDimensions(dataUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
            resolve({
                width: img.width,
                height: img.height
            });
        };
        img.src = dataUrl;
    });
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


function onLoad() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const webpPreview = document.getElementById('webpPreview');
    const originalInfo = document.getElementById('originalInfo');
    const webpInfo = document.getElementById('webpInfo');
    const previewContainer = document.getElementById('previewContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('conversionProgress');
    const statusText = document.getElementById('statusText');
    const errorText = document.getElementById('errorText');

    let currentFile = null;
    let webpBlob = null;

    // 更新质量显示
    qualitySlider.addEventListener('input', function () {
        qualityValue.textContent = this.value;
    });

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', function () {
        fileInput.click();
    });

    // 处理文件选择
    fileInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 处理拖放
    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('highlight');
    });

    uploadArea.addEventListener('dragleave', function () {
        uploadArea.classList.remove('highlight');
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('highlight');

        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // 处理文件
    function handleFile(file) {
        // 重置状态
        errorText.textContent = '';
        previewContainer.style.display = 'none';

        // 检查文件类型
        if (!file.type.match('image.*')) {
            errorText.textContent = '请选择有效的图片文件';
            return;
        }

        currentFile = file;

        // 显示原始图片
        const reader = new FileReader();
        reader.onload = function (e) {
            originalPreview.src = e.target.result;

            // 显示文件信息
            originalInfo.textContent = `
                ${file.name} (${formatFileSize(file.size)})
                ${getImageDimensions(e.target.result).then(dim => `${dim.width}×${dim.height}`)}
            `;

            // 开始转换
            convertToWebP(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // 转换为WebP
    function convertToWebP(imageDataUrl) {
        progressContainer.style.display = 'block';
        progressBar.value = 0;
        statusText.textContent = '正在转换...';

        // 使用setTimeout让UI有机会更新
        setTimeout(() => {
            const quality = parseInt(qualitySlider.value) / 100;
            const img = new Image();

            img.onload = function () {
                // 创建canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                // 绘制图像
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                progressBar.value = 50;
                statusText.textContent = '编码WebP...';

                // 再次使用setTimeout确保进度条更新
                setTimeout(() => {
                    // 转换为WebP
                    canvas.toBlob(function (blob) {
                        if (!blob) {
                            errorText.textContent = '转换失败，浏览器可能不支持WebP编码';
                            progressContainer.style.display = 'none';
                            return;
                        }

                        webpBlob = blob;
                        const webpUrl = URL.createObjectURL(blob);

                        // 显示WebP图片
                        webpPreview.src = webpUrl;
                        webpInfo.textContent = `
                            converted.webp (${formatFileSize(blob.size)})
                            ${img.width}×${img.height}
                        `;

                        // 设置下载链接
                        downloadBtn.href = webpUrl;
                        downloadBtn.download = currentFile.name.replace(/\.[^/.]+$/, '') + '.webp';

                        // 完成
                        progressBar.value = 100;
                        statusText.textContent = '转换完成!';
                        previewContainer.style.display = 'flex';

                        // 3秒后隐藏进度条
                        setTimeout(() => {
                            progressContainer.style.display = 'none';
                        }, 3000);
                    }, 'image/webp', quality);
                }, 0);
            };

            img.onerror = function () {
                errorText.textContent = '无法加载图片';
                progressContainer.style.display = 'none';
            };

            img.src = imageDataUrl;
        }, 0);
    }
}

document.addEventListener('DOMContentLoaded', onLoad);
