/**
 * 晓视界管理系统 - 全局JavaScript函数
 */

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 激活当前页面的侧边栏链接
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop();
            if (currentPage === linkPage) {
                link.classList.add('active');
            } else if (currentPage === 'index.html' && href.includes('index.html')) {
                link.classList.add('active');
            }
        }
    });
    
    // 初始化退出登录按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    // 绑定所有文件上传预览
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            const previewContainer = this.closest('form')?.querySelector('.preview-container');
            if (previewContainer) {
                handleFilePreview(this, previewContainer);
            }
        });
    });
    
    // 设置删除确认按钮
    setupDeleteConfirmation();
    
    // 设置编辑按钮
    setupEditButtons();
    
    // 设置文章发布按钮
    setupPublishArticleButton();
    
    // 设置视频发布按钮
    setupPublishVideoButton();
    
    // 设置列表中的发布按钮
    setupRowPublishButtons();
    
    // 初始化用户角色和权限控制
    initUserRoleAndPermissions();
});

// 处理登出功能
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('确定要退出登录吗？')) {
        showToast('退出中', '正在退出系统...', 'info');
        
        // 模拟退出过程
        setTimeout(function() {
            // 根据当前路径确定登录页面的相对路径
            const loginUrl = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
            window.location.href = loginUrl;
        }, 1500);
    }
}

// Toast通知函数
function showToast(title, message, type = 'success') {
    // 检查toast容器是否存在，不存在则创建
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // 创建toast元素
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // 设置toast内容
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong>: ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastEl);
    
    // 检查Bootstrap是否可用
    if (typeof bootstrap !== 'undefined') {
        // 初始化Bootstrap toast
        const toast = new bootstrap.Toast(toastEl, {
            delay: 3000,
            autohide: true
        });
        
        // 显示toast
        toast.show();
        
        // Toast关闭后移除DOM元素
        toastEl.addEventListener('hidden.bs.toast', function() {
            toastEl.remove();
        });
    } else {
        // 简单的后备方案，如果Bootstrap不可用
        toastEl.style.display = 'block';
        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transition = 'opacity 0.5s';
            setTimeout(() => toastEl.remove(), 500);
        }, 3000);
    }
}

// 处理文件上传预览
function handleFilePreview(input, previewContainer) {
    if (!input || !input.files || !input.files[0] || !previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    const file = input.files[0];
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <div class="mt-3 mb-3">
                    <h6>预览:</h6>
                    <img src="${e.target.result}" alt="预览图片" class="img-fluid mb-2" style="max-height: 200px; max-width: 100%;">
                    <p class="text-muted">${file.name} (${Math.round(file.size / 1024)} KB)</p>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <div class="mt-3 mb-3">
                    <h6>预览:</h6>
                    <audio controls class="w-100 mb-2">
                        <source src="${e.target.result}" type="${file.type}">
                        您的浏览器不支持音频预览
                    </audio>
                    <p class="text-muted">${file.name} (${Math.round(file.size / 1024)} KB)</p>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <div class="mt-3 mb-3">
                    <h6>预览:</h6>
                    <video controls class="w-100 mb-2" style="max-height: 200px;">
                        <source src="${e.target.result}" type="${file.type}">
                        您的浏览器不支持视频预览
                    </video>
                    <p class="text-muted">${file.name} (${Math.round(file.size / 1024)} KB)</p>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        previewContainer.innerHTML = `
            <div class="mt-3 mb-3">
                <h6>预览:</h6>
                <div class="card p-3 mb-2">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-earmark-pdf text-danger fs-1 me-3"></i>
                        <div>
                            <p class="mb-0">${file.name}</p>
                            <small class="text-muted">${Math.round(file.size / 1024)} KB</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        previewContainer.innerHTML = `
            <div class="mt-3 mb-3">
                <h6>文件信息:</h6>
                <div class="card p-3 mb-2">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-earmark text-primary fs-1 me-3"></i>
                        <div>
                            <p class="mb-0">${file.name}</p>
                            <small class="text-muted">${Math.round(file.size / 1024)} KB</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// 确认删除处理
function setupDeleteConfirmation() {
    // 首先移除旧的事件监听器，防止重复绑定
    document.querySelectorAll('.btn-delete-toggle').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    document.querySelectorAll('.btn-delete-confirm').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // 绑定删除切换按钮
    document.querySelectorAll('.btn-delete-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const confirmBtn = this.nextElementSibling;
            if (!confirmBtn || confirmBtn.classList.contains('d-none') === false) return;
            
            this.classList.add('d-none');
            confirmBtn.classList.remove('d-none');
            
            // 5秒后恢复原状
            setTimeout(() => {
                if (!confirmBtn.parentNode) return; // 如果已经被删除，不执行
                this.classList.remove('d-none');
                confirmBtn.classList.add('d-none');
            }, 5000);
        });
    });
    
    // 绑定确认删除按钮
    document.querySelectorAll('.btn-danger:not(.btn-delete-toggle)').forEach(btn => {
        if (btn.textContent.trim() === '确认删除') {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                if (row) {
                    row.style.backgroundColor = '#FFEBEE';
                    row.style.opacity = '0.5';
                    
                    // 模拟删除操作
                    setTimeout(() => {
                        row.remove();
                        showToast('删除成功', '记录已被删除', 'success');
                    }, 500);
                } else {
                    const card = this.closest('.card');
                    if (card) {
                        card.style.opacity = '0.5';
                        
                        // 模拟删除操作
                        setTimeout(() => {
                            card.remove();
                            showToast('删除成功', '记录已被删除', 'success');
                        }, 500);
                    }
                }
            });
        }
    });
}

// 编辑按钮处理
function setupEditButtons() {
    document.querySelectorAll('.btn-warning').forEach(btn => {
        // 确保是编辑按钮
        if (btn.innerHTML.includes('编辑') || btn.innerHTML.includes('bi-pencil')) {
            btn.addEventListener('click', function() {
                // 获取当前行/卡片的数据
                const row = this.closest('tr');
                let title, content, id;
                
                if (row) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 0) {
                        id = cells[0].textContent;
                        title = cells.length > 2 ? cells[2].textContent : cells[1].textContent;
                    }
                    
                    showToast('编辑操作', `正在编辑: ${title}`, 'info');
                    
                    // 在这里可以根据当前页面类型打开对应的编辑模态框
                    const pageType = getPageType();
                    
                    if (pageType) {
                        // 模拟打开编辑模态框
                        const modalId = getEditModalId(pageType);
                        if (modalId && document.getElementById(modalId)) {
                            const modal = new bootstrap.Modal(document.getElementById(modalId));
                            modal.show();
                            populateEditForm(modalId, id, title);
                        } else {
                            // 如果没有找到对应的模态框，显示一个通用消息
                            showToast('编辑功能', `ID为${id}的项目正在编辑中`, 'info');
                        }
                    }
                } else {
                    // 处理卡片样式的内容编辑
                    const card = this.closest('.card');
                    if (card) {
                        const cardTitle = card.querySelector('h5')?.textContent || '未知项目';
                        showToast('编辑操作', `正在编辑: ${cardTitle}`, 'info');
                    }
                }
            });
        }
    });
}

// 获取当前页面类型
function getPageType() {
    const path = window.location.pathname;
    if (path.includes('star.html')) return 'star';
    if (path.includes('observe.html')) return 'observe';
    if (path.includes('sky.html')) return 'sky';
    if (path.includes('explore.html')) return 'explore';
    if (path.includes('profile.html')) return 'profile';
    if (path.includes('settings.html')) return 'settings';
    return null;
}

// 获取对应编辑模态框ID
function getEditModalId(pageType) {
    // 获取当前激活的标签页
    let activeTab = null;
    if (pageType === 'explore') {
        const articlesTab = document.getElementById('articles-tab');
        const videosTab = document.getElementById('videos-tab');
        
        if (articlesTab && videosTab) {
            // 检查哪个标签页处于活动状态
            if (articlesTab.classList.contains('active')) {
                activeTab = 'articles';
            } else if (videosTab.classList.contains('active')) {
                activeTab = 'videos';
            }
        }
    }
    
    // 根据页面类型和标签页返回相应的模态框ID
    const modalIds = {
        'star': 'uploadVideoModal',
        'observe': 'uploadBeidouContentModal',
        'sky': 'uploadStarmapModal',
        'explore': activeTab === 'videos' ? 'uploadVideoModal' : 'uploadArticleModal', // 根据标签页区分
        'profile': 'uploadQRCodeModal',
        'settings': 'basicSettingsForm'
    };
    
    return modalIds[pageType];
}

// 根据ID填充编辑表单数据
function populateEditForm(modalId, id, title) {
    // 此函数根据模态框ID和内容ID填充表单字段
    // 实际应用中，您可能需要从服务器获取数据
    
    // 模拟数据填充
    if (modalId) {
        const titleInput = document.querySelector(`#${modalId} input[id$="Title"]`);
        if (titleInput) {
            titleInput.value = title || '';
        }
        
        // 处理文章编辑的情况 - 处理三段文本内容
        if (modalId === 'uploadArticleModal') {
            const pageType = getPageType();
            if (pageType === 'explore') {
                // 填充文章类型和标签
                const typeSelect = document.querySelector('#articleType');
                if (typeSelect) {
                    // 根据ID选择不同的类型
                    if (id === '1') {
                        typeSelect.value = '天文时事';
                    } else {
                        typeSelect.value = '天文回顾';
                    }
                }
                
                const tagsInput = document.querySelector('#articleTags');
                if (tagsInput) {
                    if (id === '1') {
                        tagsInput.value = '望远镜,深空';
                    } else {
                        tagsInput.value = '望远镜,历史';
                    }
                }
                
                // 填充三段文本内容
                const content1 = document.querySelector('#articleContent1');
                const content2 = document.querySelector('#articleContent2');
                const content3 = document.querySelector('#articleContent3');
                
                if (content1 && content2 && content3) {
                    if (id === '1') {
                        content1.value = '韦伯望远镜（James Webb Space Telescope）作为哈勃望远镜的继任者，自从2021年发射以来，一直在为人类揭示宇宙的奥秘。最近，科学家们通过韦伯望远镜的观测数据，发现了迄今为止最遥远的星系，这些星系形成于宇宙大爆炸后仅3亿年。这一发现挑战了我们对于早期宇宙形成的理解。';
                        content2.value = '这些新发现的星系比科学家之前预计的更为明亮和复杂。传统理论认为早期宇宙中的星系应该较小且结构简单，但韦伯望远镜的观测显示，这些星系已经具有成熟的结构和活跃的恒星形成区域。这意味着星系演化过程可能比我们想象的更加迅速，或者宇宙大爆炸的时间点需要重新评估。';
                        content3.value = '科学家们计划继续利用韦伯望远镜的强大能力，进一步研究这些早期星系的化学成分和演化过程。通过了解宇宙最初几亿年的状态，我们有望解答关于宇宙起源和演化的根本问题，例如第一代恒星是何时以及如何形成的，以及这些早期天体如何影响了后来的宇宙结构。';
                    } else {
                        content1.value = '哈勃望远镜自从1990年发射升空以来，已经度过了它的第30个年头。这个轨道天文台改变了我们对宇宙的理解，拍摄了一些最为壮观的太空图像，并为数千项科学研究提供了宝贵数据。';
                        content2.value = '在过去的30年中，哈勃望远镜帮助科学家确定了宇宙的年龄，确认了宇宙加速膨胀的事实(导致暗能量的发现)，拍摄了著名的"深空视野"图像，观测到了遥远星系中的超大质量黑洞，并研究了系外行星的大气层成分。';
                        content3.value = '虽然哈勃望远镜已经远远超过了它最初的设计寿命，但NASA和ESA计划继续运行它，直到至少2025年。与此同时，它的继任者韦伯望远镜已经成功发射并开始工作，将继续拓展哈勃的科学遗产，帮助人类揭示更多宇宙奥秘。';
                    }
                }
                
                // 填充习题与思考
                const exercise = document.querySelector('#articleExercise');
                if (exercise) {
                    if (id === '1') {
                        exercise.value = '1. 韦伯望远镜与哈勃望远镜在观测能力上有何主要区别？\n2. 为什么早期宇宙星系的发现对我们理解宇宙演化如此重要？\n3. 思考：如果宇宙大爆炸的时间点需要重新评估，这将如何影响现有的宇宙学理论？';
                    } else {
                        exercise.value = '1. 列举哈勃望远镜的三项重要科学发现。\n2. 哈勃望远镜与地面望远镜相比有什么优势？\n3. 思考：如果没有哈勃望远镜，现代天文学会有何不同？';
                    }
                }
            }
        } else {
            // 处理其他非文章表单的情况
            const descInput = document.querySelector(`#${modalId} textarea`);
            if (descInput) {
                descInput.value = `ID ${id} 的内容描述`;
            }
        }
        
        // 添加编辑状态标记
        const form = document.querySelector(`#${modalId} form`);
        if (form) {
            form.dataset.editMode = 'true';
            form.dataset.editId = id;
            
            // 修改提交按钮文本
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = '保存修改';
            }
        }
    }
}

// 设置文章编辑自动保存功能
function setupAutoSave() {
    const formElements = document.querySelectorAll('.article-upload-form input, .article-upload-form textarea, .article-upload-form select');
    let autoSaveTimer = null;
    const autoSaveDelay = 5000; // 5秒后自动保存
    let lastSaveTime = null;
    
    // 保存表单数据到本地存储
    function saveFormData() {
        const formData = {};
        formElements.forEach(element => {
            if (element.type === 'file') return; // 跳过文件输入项
            
            if (element.type === 'radio') {
                if (element.checked) {
                    const groupName = element.name;
                    if (!formData[groupName]) {
                        formData[groupName] = element.value;
                    }
                }
            } else {
                formData[element.id] = element.value;
            }
        });
        
        localStorage.setItem('articleFormAutoSave', JSON.stringify(formData));
        lastSaveTime = new Date();
        
        // 显示自动保存提示
        showToast('自动保存', `表单已自动保存 (${lastSaveTime.toLocaleTimeString()})`, 'info');
    }
    
    // 加载本地存储的表单数据
    function loadFormData() {
        const savedData = localStorage.getItem('articleFormAutoSave');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            formElements.forEach(element => {
                if (element.type === 'file') return; // 跳过文件输入项
                
                if (element.type === 'radio') {
                    if (formData[element.name] && formData[element.name] === element.value) {
                        element.checked = true;
                    }
                } else if (formData[element.id]) {
                    element.value = formData[element.id];
                }
            });
            
            showToast('表单恢复', '已恢复上次编辑的内容', 'success');
        }
    }
    
    // 为每个表单元素添加监听器
    formElements.forEach(element => {
        element.addEventListener('input', () => {
            // 清除现有的计时器
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
            
            // 设置新的计时器
            autoSaveTimer = setTimeout(saveFormData, autoSaveDelay);
            
            // 更新状态指示器
            const statusIndicator = document.getElementById('autoSaveStatus');
            if (statusIndicator) {
                statusIndicator.innerHTML = '<span class="spinner-border spinner-border-sm text-secondary" role="status"></span> 正在编辑...';
            }
        });
    });
    
    // 监听模态框打开事件，加载保存的表单数据
    const articleModal = document.getElementById('uploadArticleModal');
    if (articleModal) {
        articleModal.addEventListener('shown.bs.modal', loadFormData);
        
        // 添加自动保存状态指示器
        const modalHeader = articleModal.querySelector('.modal-header');
        if (modalHeader) {
            const statusIndicator = document.createElement('div');
            statusIndicator.id = 'autoSaveStatus';
            statusIndicator.className = 'ms-auto me-3 small text-white';
            statusIndicator.innerHTML = '表单将自动保存';
            
            const closeButton = modalHeader.querySelector('.btn-close');
            modalHeader.insertBefore(statusIndicator, closeButton);
        }
    }
    
    // 当点击保存按钮时，清除自动保存的数据
    const saveButton = document.getElementById('publishArticleBtn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            localStorage.removeItem('articleFormAutoSave');
        });
    }
}

// 设置文章发布按钮
function setupPublishArticleButton() {
    // 实现文章发布逻辑
    const publishBtn = document.getElementById('publishArticleBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            // 模拟文章表单验证
            const form = document.querySelector('.article-upload-form');
            const title = document.getElementById('articleTitle')?.value;
            const publishDateTime = document.getElementById('publishDateTime')?.value;
            
            if (form && title) {
                // 处理计划发布时间
                let publishMessage = '正在保存文章...';
                if (publishDateTime) {
                    // 设置为选定日期的凌晨5点
                    const dateObj = new Date(publishDateTime);
                    dateObj.setHours(5, 0, 0, 0);
                    
                    const formattedDate = dateObj.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    publishMessage = `文章将在 ${formattedDate} 发布`;
                }
                
                // 模拟提交文章
                showToast('保存中', publishMessage, 'info');
                
                // 获取模态框实例
                const modalEl = this.closest('.modal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                
                // 检查是否处于编辑模式
                const isEditMode = form.dataset.editMode === 'true';
                const editId = form.dataset.editId;
                
                // 模拟发布过程
                setTimeout(function() {
                    // 关闭模态框
                    if (modal) {
                        modal.hide();
                    }
                    
                    // 清除自动保存的数据
                    localStorage.removeItem('articleFormAutoSave');
                    
                    // 处理编辑模式 - 更新现有行
                    if (isEditMode && editId) {
                        // 找到对应ID的行
                        const tableBody = document.querySelector('#articles table tbody');
                        if (tableBody) {
                            const rows = tableBody.querySelectorAll('tr');
                            for (let i = 0; i < rows.length; i++) {
                                const row = rows[i];
                                const cells = row.querySelectorAll('td');
                                if (cells.length > 0 && cells[0].textContent === editId) {
                                    // 更新行数据
                                    const tags = document.getElementById('articleTags')?.value || '';
                                    const articleType = document.getElementById('articleType')?.value || '天文时事';
                                    
                                    cells[1].textContent = articleType;
                                    cells[2].textContent = title;
                                    cells[4].innerHTML = `<span class="badge bg-primary">${tags}</span>`;
                                    
                                    // 清除编辑模式标记
                                    form.removeAttribute('data-edit-mode');
                                    form.removeAttribute('data-edit-id');
                                    
                                    // 清空表单
                                    form.reset();
                                    
                                    showToast('更新成功', `文章"${title}"已成功更新`, 'success');
                                    return;
                                }
                            }
                        }
                    }
                    
                    // 如果不是编辑模式或没找到对应行，则添加新行
                    // 清空表单
                    form.reset();
                    
                    // 刷新文章列表（这里简单示例，实际应用中可能需要更复杂的处理）
                    const tableBody = document.querySelector('#articles table tbody');
                    if (tableBody) {
                        const newRow = document.createElement('tr');
                        const currentDate = new Date().toISOString().split('T')[0];
                        const tags = document.getElementById('articleTags')?.value || '';
                        const articleType = document.getElementById('articleType')?.value || '天文时事';
                        
                        // 获取新ID
                        const rows = tableBody.querySelectorAll('tr');
                        const newId = rows.length + 1;
                        
                        newRow.innerHTML = `
                            <td>${newId}</td>
                            <td>${articleType}</td>
                            <td>${title}</td>
                            <td>${currentDate}</td>
                            <td><span class="badge bg-primary">${tags}</span></td>
                            <td>
                                <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#previewArticleModal">
                                    <i class="bi bi-eye"></i> 预览
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-warning">
                                    <i class="bi bi-pencil"></i> 编辑
                                </button>
                                <button class="btn btn-sm btn-primary">
                                    <i class="bi bi-cloud-arrow-up"></i> 发布
                                </button>
                                <button class="btn btn-sm btn-danger btn-delete-toggle">
                                    <i class="bi bi-trash"></i> 删除
                                </button>
                                <button class="btn btn-sm btn-danger d-none btn-delete-confirm">
                                    确认删除
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(newRow);
                        
                        // 重新绑定编辑和删除按钮
                        setupEditButtons();
                        setupDeleteConfirmation();
                        setupRowPublishButtons();
                        
                        // 显示发布成功或计划发布的消息
                        if (publishDateTime) {
                            showToast('计划发布', '文章已成功设置为定时发布', 'success');
                        } else {
                            showToast('保存成功', '新文章已成功保存', 'success');
                        }
                    }
                }, 1500);
            } else {
                showToast('保存失败', '请填写完整的文章信息', 'danger');
            }
        });
    }
}

// 设置视频发布按钮
function setupPublishVideoButton() {
    const publishVideoBtn = document.getElementById('publishVideoBtn');
    if (!publishVideoBtn) return;
    
    publishVideoBtn.addEventListener('click', function() {
        // 获取表单元素
        const titleInput = document.getElementById('videoTitle');
        const descriptionInput = document.getElementById('videoDescription');
        const fileInput = document.getElementById('videoFile');
        const publishDateTimeInput = document.getElementById('videoPublishDateTime');
        
        // 验证必填字段
        if (!titleInput || !titleInput.value.trim()) {
            showToast('验证失败', '请输入视频标题', 'danger');
            return;
        }
        
        if (!descriptionInput || !descriptionInput.value.trim()) {
            showToast('验证失败', '请输入视频描述', 'danger');
            return;
        }
        
        // 检查视频文件 - 允许可选的文件上传或URL输入
        let videoSource;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            // 使用本地文件处理
            const file = fileInput.files[0];
            if (!file.type.startsWith('video/')) {
                showToast('验证失败', '请上传有效的视频文件', 'danger');
                return;
            }
            // 使用 FileReader 创建临时本地 URL
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                videoSource = e.target.result;
                // 继续保存流程
                saveVideoProcess(titleInput.value, descriptionInput.value, videoSource, publishDateTimeInput ? publishDateTimeInput.value : null);
            };
            return; // 等待异步读取完成
        } else {
            // 使用默认示例视频
            videoSource = '../assets/videos/demo-video.mp4';
            saveVideoProcess(titleInput.value, descriptionInput.value, videoSource, publishDateTimeInput ? publishDateTimeInput.value : null);
        }
    });
}

// 保存视频处理过程
function saveVideoProcess(title, description, videoSource, publishDateTime) {
    // 显示保存提示
    showToast('保存中', '正在保存视频信息，请稍候...', 'info');
    
    // 模拟保存过程
    setTimeout(() => {
        const videoId = 'video_' + Date.now();
        const currentDate = new Date().toISOString().split('T')[0];
        
        // 根据是否设置了发布日期显示不同提示
        if (publishDateTime) {
            const formattedDate = new Date(publishDateTime).toLocaleString('zh-CN', {
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            showToast('保存成功', `视频已保存，将于 ${formattedDate} 自动发布`, 'success');
        } else {
            showToast('保存成功', '视频已保存并发布', 'success');
        }
        
        // 添加到视频列表
        const tableBody = document.querySelector('#videos-tab table tbody');
        if (tableBody) {
            const newRow = document.createElement('tr');
            newRow.setAttribute('data-id', videoId);
            newRow.innerHTML = `
                <td>${videoId}</td>
                <td>${title}</td>
                <td>${description.substring(0, 50)}${description.length > 50 ? '...' : ''}</td>
                <td>${currentDate}</td>
                <td>
                    <span class="badge ${publishDateTime ? 'bg-warning' : 'bg-success'}">
                        ${publishDateTime ? '待发布' : '已发布'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#previewVideoModal">
                        <i class="bi bi-eye"></i> 预览
                    </button>
                    <button class="btn btn-sm btn-warning">
                        <i class="bi bi-pencil"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-primary btn-video-publish" ${!publishDateTime ? 'disabled' : ''}>
                        <i class="bi bi-cloud-upload"></i> ${!publishDateTime ? '已发布' : '立即发布'}
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-toggle">
                        <i class="bi bi-trash"></i> 删除
                    </button>
                    <button class="btn btn-sm btn-danger d-none btn-delete-confirm">
                        确认删除
                    </button>
                </td>
            `;
            
            tableBody.prepend(newRow);
            
            // 重新绑定按钮事件
            setupDeleteConfirmation();
            setupRowPublishButtons();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadVideoModal'));
            if (modal) {
                modal.hide();
            }
            
            // 重置表单
            document.getElementById('videoTitle').value = '';
            document.getElementById('videoDescription').value = '';
            document.getElementById('videoFile').value = '';
            const publishDateTimeInput = document.getElementById('videoPublishDateTime');
            if (publishDateTimeInput) {
                publishDateTimeInput.value = '';
            }
        }
    }, 1500);
}

// 设置列表中的发布按钮
function setupRowPublishButtons() {
    // 为表格中每行的发布按钮绑定事件
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.innerHTML.includes('发布') || btn.innerHTML.includes('bi-cloud-arrow-up')) {
            btn.addEventListener('click', function() {
                // 获取当前行数据
                const row = this.closest('tr');
                let title, type, id;
                
                if (row) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 0) {
                        id = cells[0].textContent;
                        type = cells.length > 2 ? cells[1].textContent : '';
                        title = cells.length > 3 ? cells[2].textContent : cells[1].textContent;
                    }
                    
                    // 判断当前状态
                    const isPublished = btn.classList.contains('btn-success');
                    
                    if (isPublished) {
                        // 如果已发布，则撤销发布
                        if (confirm(`确定要撤销发布"${title}"吗？`)) {
                            btn.classList.remove('btn-success');
                            btn.classList.add('btn-primary');
                            btn.innerHTML = '<i class="bi bi-cloud-arrow-up"></i> 发布';
                            showToast('操作成功', `已撤销发布: ${title}`, 'info');
                        }
                    } else {
                        // 创建日期时间选择器模态框
                        createDateTimePickerModal(title, (selectedDate) => {
                            // 模拟发布过程
                            btn.disabled = true;
                            
                            if (selectedDate) {
                                // 设置为选定日期的凌晨5点
                                const dateObj = new Date(selectedDate);
                                dateObj.setHours(5, 0, 0, 0);
                                
                                const formattedDate = dateObj.toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                
                                btn.innerHTML = `<i class="bi bi-calendar-check"></i> ${formattedDate} 发布`;
                                
                                setTimeout(() => {
                                    btn.disabled = false;
                                    btn.classList.remove('btn-primary');
                                    btn.classList.add('btn-info');
                                    showToast('计划发布', `文章将在 ${formattedDate} 发布`, 'info');
                                }, 1000);
                            } else {
                                // 立即发布
                                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 发布中...';
                                
                                setTimeout(() => {
                                    btn.disabled = false;
                                    btn.classList.remove('btn-primary');
                                    btn.classList.add('btn-success');
                                    btn.innerHTML = '<i class="bi bi-check-circle"></i> 已发布';
                                    showToast('发布成功', `已成功发布: ${title}`, 'success');
                                }, 1000);
                            }
                        });
                    }
                }
            });
        }
    });
}

// 创建日期时间选择器模态框
function createDateTimePickerModal(title, callback) {
    // 检查是否已存在该模态框
    let modal = document.getElementById('dateTimePickerModal');
    if (modal) {
        document.body.removeChild(modal);
    }
    
    // 创建模态框HTML
    const modalHTML = `
        <div class="modal fade" id="dateTimePickerModal" tabindex="-1" aria-labelledby="dateTimePickerModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="dateTimePickerModalLabel">选择发布时间</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>请为"${title}"选择预定发布日期，将在所选日期的凌晨5:00发布</p>
                        <div class="mb-3">
                            <label for="modalPublishDateTime" class="form-label">发布日期</label>
                            <input type="date" class="form-control" id="modalPublishDateTime">
                            <div class="form-text">留空则立即发布</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-success" id="publishNowBtn">立即发布</button>
                        <button type="button" class="btn btn-primary" id="schedulePublishBtn">预定发布</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加模态框到页面
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement.firstElementChild);
    
    // 获取新模态框实例
    modal = document.getElementById('dateTimePickerModal');
    const bsModal = new bootstrap.Modal(modal);
    
    // 绑定按钮事件
    document.getElementById('publishNowBtn').addEventListener('click', function() {
        bsModal.hide();
        callback(null); // 立即发布
    });
    
    document.getElementById('schedulePublishBtn').addEventListener('click', function() {
        const dateInput = document.getElementById('modalPublishDateTime').value;
        if (dateInput) {
            bsModal.hide();
            callback(dateInput); // 预定发布
        } else {
            showToast('提示', '请选择日期或点击"立即发布"', 'warning');
        }
    });
    
    // 显示模态框
    bsModal.show();
    
    // 模态框关闭时清理
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// 初始化用户角色和权限控制
function initUserRoleAndPermissions() {
    // 从localStorage获取用户角色或使用默认值
    const userRole = localStorage.getItem('userRole') || 'admin';
    const userName = localStorage.getItem('userName') || '管理员';
    
    // 更新顶部导航中的用户角色显示
    const currentUserRole = document.getElementById('current-user-role');
    const currentUserName = document.getElementById('current-user-name');
    
    if (currentUserRole) {
        currentUserRole.textContent = userRole === 'admin' ? '管理员' : '编辑员';
        currentUserRole.className = userRole === 'admin' 
            ? 'badge bg-success ms-2 user-role' 
            : 'badge bg-info ms-2 user-role';
    }
    
    if (currentUserName) {
        currentUserName.textContent = userName;
    }
    
    // 应用角色权限控制
    applyRoleBasedPermissions(userRole);
}

// 应用基于角色的权限控制
function applyRoleBasedPermissions(userRole) {
    // 管理员可见的元素
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    
    // 所有表格中的删除按钮
    const deleteButtons = document.querySelectorAll('.btn-delete-toggle');
    
    // 导航菜单项
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    
    if (userRole === 'admin') {
        // 管理员拥有所有权限
        adminOnlyElements.forEach(el => el.style.display = '');
        deleteButtons.forEach(btn => btn.style.display = '');
        navItems.forEach(item => item.style.display = '');
    } else {
        // 编辑员只能访问探索页面和个人中心，不能删除内容
        adminOnlyElements.forEach(el => el.style.display = 'none');
        deleteButtons.forEach(btn => btn.style.display = 'none');
        
        // 隐藏不相关的导航项
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link) {
                const href = link.getAttribute('href');
                if (href && (
                    href.includes('explore.html') || 
                    href.includes('profile.html') ||
                    href.includes('index.html') // 保留首页访问权限
                )) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            }
        });
        
        // 如果当前页面不是编辑员可访问的页面，则重定向到探索页面
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage && 
            !currentPage.includes('index.html') && 
            !currentPage.includes('explore.html') && 
            !currentPage.includes('profile.html')) {
            window.location.href = 'explore.html';
        }
    }
}

// 设置侧边栏切换功能
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
}

// 设置退出登录功能
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
}

// 设置文件上传预览功能
function setupFilePreview() {
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            const previewContainer = this.closest('form')?.querySelector('.preview-container');
            if (previewContainer) {
                handleFilePreview(this, previewContainer);
            }
        });
    });
}

// 初始化管理员功能
function initAdminFunctions() {
    try {
        console.log('初始化管理员功能...');
        
        // 设置侧边栏切换
        setupSidebarToggle();
        
        // 设置退出登录功能
        setupLogout();
        
        // 删除确认按钮
        setupDeleteConfirmation();
        
        // 编辑按钮
        setupEditButtons();
        
        // 文章发布按钮
        setupPublishArticleButton();
        
        // 文章行中的发布按钮
        setupRowPublishButtons();
        
        // 文件上传预览
        setupFilePreview();
        
        // 设置自动保存功能
        setupAutoSave();
        
        console.log('管理员功能初始化完成');
    } catch (error) {
        console.error('初始化管理员功能出错:', error);
    }
} 