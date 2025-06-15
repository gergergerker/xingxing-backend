/**
 * 星空页面专用JavaScript函数
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('sky.js: 页面加载完成');
    initSkyPage();
});

// 星空页面初始化
function initSkyPage() {
    try {
        console.log('sky.js: 初始化星空页面');
        
        // 初始化Tab切换事件
        initSkyTabs();
        
        // 初始化删除确认按钮
        if (typeof setupDeleteConfirmation === 'function') {
            setupDeleteConfirmation();
        } else {
            console.warn('sky.js: setupDeleteConfirmation函数未定义');
            // 实现一个基本的删除确认功能
            setupBasicDeleteConfirmation();
        }
        
        // 初始化编辑按钮
        if (typeof setupEditButtons === 'function') {
            setupEditButtons();
        } else {
            console.warn('sky.js: setupEditButtons函数未定义');
            // 实现一个基本的编辑功能
            setupBasicEditButtons();
        }
        
        console.log('sky.js: 星空页面初始化完成');
    } catch (error) {
        console.error('sky.js: 初始化错误:', error);
        showError('初始化星空页面时出错: ' + error.message, error.stack);
    }
}

// 初始化标签页切换
function initSkyTabs() {
    const skyTabs = document.getElementById('skyTabs');
    if (!skyTabs) {
        console.error('sky.js: 找不到skyTabs元素');
        return;
    }
    
    console.log('sky.js: 设置标签页切换事件');
    
    // 监听标签页切换事件
    skyTabs.addEventListener('shown.bs.tab', function(event) {
        try {
            const tabId = event.target.getAttribute('data-bs-target');
            if (!tabId) {
                console.error('sky.js: 标签页目标ID不存在');
                return;
            }
            
            const actualTabId = tabId.substring(1);
            console.log('sky.js: 切换到标签页:', actualTabId);
            loadTabContent(actualTabId);
        } catch (error) {
            console.error('sky.js: 标签页切换事件处理出错:', error);
            showError('标签页切换时出错: ' + error.message, error.stack);
        }
    });
    
    // 初始加载当前活动标签页
    const activeTab = skyTabs.querySelector('.nav-link.active');
    if (activeTab) {
        const tabId = activeTab.getAttribute('data-bs-target');
        if (tabId) {
            const actualTabId = tabId.substring(1);
            console.log('sky.js: 初始加载活动标签页:', actualTabId);
            loadTabContent(actualTabId);
        } else {
            console.error('sky.js: 活动标签页缺少data-bs-target属性');
        }
    } else {
        console.error('sky.js: 找不到活动标签页');
    }
}

// 加载标签页内容
function loadTabContent(tabId) {
    console.log(`sky.js: 加载${tabId}标签页内容`);
    
    try {
        // 根据不同的标签页ID加载不同的内容
        switch(tabId) {
            case 'chinese-starmap':
                loadChineseStarmap();
                break;
            case 'xingxiu':
                loadXingxiu();
                break;
            case 'xingxiu-functions':
                loadXingxiuFunctions();
                break;
            case 'expressions':
                loadExpressions();
                break;
            default:
                console.log('sky.js: 未知标签页:', tabId);
        }
    } catch (error) {
        console.error(`sky.js: 加载标签页${tabId}时出错:`, error);
        showError(`加载${tabId}标签页时出错: ` + error.message, error.stack);
    }
}

// 加载华夏星空内容
function loadChineseStarmap() {
    console.log('sky.js: 加载华夏星空内容');
    
    try {
        // 示例数据
        const sampleData = [
            {id: 1, title: '华夏星空图 - 春季', description: '中国传统春季星空图，展示了古代天文学家对春季星空的记录和观测'},
            {id: 2, title: '华夏星空图 - 夏季', description: '中国传统夏季星空图，记录了夏季天空中可见的主要星象和星座'},
            {id: 3, title: '华夏星空图 - 秋季', description: '中国传统秋季星空图，包含了古代天文学中对秋季星空的系统记录'},
            {id: 4, title: '华夏星空图 - 冬季', description: '中国传统冬季星空图，展示了冬季夜空中的重要星座和天文现象'}
        ];
        
        // 渲染数据到表格
        renderTableData('#chinese-starmap table tbody', sampleData, renderChineseStarmapRow);
    } catch (error) {
        console.error('sky.js: 加载华夏星空内容时出错:', error);
        showError('加载华夏星空内容时出错: ' + error.message, error.stack);
    }
}

// 加载二十八星宿内容
function loadXingxiu() {
    console.log('sky.js: 加载二十八星宿内容');
    
    try {
        // 示例数据 - 按方位分组的28星宿
        const sampleData = [
            {id: 1, name: '角宿', direction: '东方青龙'},
            {id: 2, name: '亢宿', direction: '东方青龙'},
            {id: 3, name: '氐宿', direction: '东方青龙'},
            {id: 4, name: '房宿', direction: '东方青龙'},
            {id: 5, name: '心宿', direction: '东方青龙'},
            {id: 6, name: '尾宿', direction: '东方青龙'},
            {id: 7, name: '箕宿', direction: '东方青龙'}
            // 省略其他星宿数据
        ];
        
        // 渲染数据到表格
        renderTableData('#xingxiu table tbody', sampleData, renderXingxiuRow);
    } catch (error) {
        console.error('sky.js: 加载二十八星宿内容时出错:', error);
        showError('加载二十八星宿内容时出错: ' + error.message, error.stack);
    }
}

// 加载星宿功能内容
function loadXingxiuFunctions() {
    console.log('sky.js: 加载星宿功能内容');
    
    try {
        // 示例数据
        const sampleData = [
            {id: 1, name: '导航功能', description: '古代利用星宿进行导航的方法与实践经验'},
            {id: 2, name: '时间记录', description: '二十八星宿与古代历法系统的关系'},
            {id: 3, name: '农事指导', description: '星宿与农业作物种植收获的关系'},
            {id: 4, name: '命运推算', description: '星宿在古代命理学中的应用'}
        ];
        
        // 渲染数据到表格
        renderTableData('#xingxiu-functions table tbody', sampleData, renderXingxiuFunctionRow);
    } catch (error) {
        console.error('sky.js: 加载星宿功能内容时出错:', error);
        showError('加载星宿功能内容时出错: ' + error.message, error.stack);
    }
}

// 加载星象表达内容
function loadExpressions() {
    console.log('sky.js: 加载星象表达内容');
    
    try {
        // 示例数据
        const sampleData = [
            {id: 1, type: '文学', title: '诗词中的星空', description: '古代诗词中对星空的描述与表达'},
            {id: 2, type: '占星', title: '星座与命运', description: '中西方占星学中星象与人生命运的关系'},
            {id: 3, type: '神话', title: '星空中的神话故事', description: '关于星空和星座的各种神话传说'},
            {id: 4, type: '艺术', title: '绘画中的星空', description: '不同时期艺术作品中的星空表现'}
        ];
        
        // 渲染数据到表格
        renderTableData('#expressions table tbody', sampleData, renderExpressionRow);
    } catch (error) {
        console.error('sky.js: 加载星象表达内容时出错:', error);
        showError('加载星象表达内容时出错: ' + error.message, error.stack);
    }
}

// 通用表格数据渲染函数
function renderTableData(selector, data, rowRenderer) {
    const tableBody = document.querySelector(selector);
    if (!tableBody) {
        console.error(`sky.js: 找不到表格 ${selector}`);
        return;
    }
    
    // 清空现有内容
    tableBody.innerHTML = '';
    
    // 填充数据
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = rowRenderer(item);
        tableBody.appendChild(row);
    });
    
    console.log(`sky.js: 表格 ${selector} 渲染完成`);
    
    // 重新绑定事件
    setupBasicDeleteConfirmation();
    setupBasicEditButtons();
}

// 渲染华夏星空行
function renderChineseStarmapRow(item) {
    return `
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>
            <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#previewStarmapModal">
                <i class="bi bi-eye"></i> 预览
            </button>
        </td>
        <td>
            <button class="btn btn-sm btn-warning sky-edit-btn" data-id="${item.id}" data-type="starmap">
                <i class="bi bi-pencil"></i> 编辑
            </button>
            <button class="btn btn-sm btn-danger sky-delete-toggle" data-id="${item.id}" data-type="starmap">
                <i class="bi bi-trash"></i> 删除
            </button>
            <button class="btn btn-sm btn-danger d-none sky-delete-confirm" data-id="${item.id}" data-type="starmap">
                确认删除
            </button>
        </td>
    `;
}

// 渲染二十八星宿行
function renderXingxiuRow(item) {
    return `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.direction}</td>
        <td>
            <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#previewXingxiuModal">
                <i class="bi bi-eye"></i> 预览
            </button>
        </td>
        <td>
            <button class="btn btn-sm btn-warning sky-edit-btn" data-id="${item.id}" data-type="xingxiu">
                <i class="bi bi-pencil"></i> 编辑
            </button>
            <button class="btn btn-sm btn-danger sky-delete-toggle" data-id="${item.id}" data-type="xingxiu">
                <i class="bi bi-trash"></i> 删除
            </button>
            <button class="btn btn-sm btn-danger d-none sky-delete-confirm" data-id="${item.id}" data-type="xingxiu">
                确认删除
            </button>
        </td>
    `;
}

// 渲染星宿功能行
function renderXingxiuFunctionRow(item) {
    return `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>
            <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#previewFunctionModal">
                <i class="bi bi-eye"></i> 预览
            </button>
        </td>
        <td>
            <button class="btn btn-sm btn-warning sky-edit-btn" data-id="${item.id}" data-type="function">
                <i class="bi bi-pencil"></i> 编辑
            </button>
            <button class="btn btn-sm btn-danger sky-delete-toggle" data-id="${item.id}" data-type="function">
                <i class="bi bi-trash"></i> 删除
            </button>
            <button class="btn btn-sm btn-danger d-none sky-delete-confirm" data-id="${item.id}" data-type="function">
                确认删除
            </button>
        </td>
    `;
}

// 渲染星象表达行
function renderExpressionRow(item) {
    return `
        <td>${item.id}</td>
        <td>${item.type}</td>
        <td>${item.title}</td>
        <td>
            <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#previewExpressionModal">
                <i class="bi bi-eye"></i> 预览
            </button>
        </td>
        <td>
            <button class="btn btn-sm btn-warning sky-edit-btn" data-id="${item.id}" data-type="expression">
                <i class="bi bi-pencil"></i> 编辑
            </button>
            <button class="btn btn-sm btn-danger sky-delete-toggle" data-id="${item.id}" data-type="expression">
                <i class="bi bi-trash"></i> 删除
            </button>
            <button class="btn btn-sm btn-danger d-none sky-delete-confirm" data-id="${item.id}" data-type="expression">
                确认删除
            </button>
        </td>
    `;
}

// 基本删除确认功能
function setupBasicDeleteConfirmation() {
    // 删除旧的事件监听器
    document.querySelectorAll('.sky-delete-toggle').forEach(btn => {
        btn.removeEventListener('click', handleDeleteToggle);
        btn.addEventListener('click', handleDeleteToggle);
    });
    
    document.querySelectorAll('.sky-delete-confirm').forEach(btn => {
        btn.removeEventListener('click', handleDeleteConfirm);
        btn.addEventListener('click', handleDeleteConfirm);
    });
}

// 处理删除切换
function handleDeleteToggle(event) {
    const toggleBtn = event.currentTarget;
    const confirmBtn = toggleBtn.nextElementSibling;
    
    if (!confirmBtn || !confirmBtn.classList.contains('sky-delete-confirm')) {
        console.error('sky.js: 找不到确认删除按钮');
        return;
    }
    
    toggleBtn.classList.add('d-none');
    confirmBtn.classList.remove('d-none');
    
    // 5秒后恢复原状
    setTimeout(() => {
        if (toggleBtn.parentNode) {
            toggleBtn.classList.remove('d-none');
            confirmBtn.classList.add('d-none');
        }
    }, 5000);
}

// 处理删除确认
function handleDeleteConfirm(event) {
    const btn = event.currentTarget;
    const itemId = btn.getAttribute('data-id');
    const itemType = btn.getAttribute('data-type');
    
    if (!itemId || !itemType) {
        console.error('sky.js: 删除按钮缺少必要的数据属性');
        return;
    }
    
    console.log(`sky.js: 删除 ${itemType} ID=${itemId}`);
    
    // 模拟删除操作 - 实际应用中通常是API调用
    const row = btn.closest('tr');
    if (row) {
        row.style.opacity = '0.5';
        setTimeout(() => {
            row.remove();
        }, 500);
    }
    
    // 显示成功消息
    showMessage('删除成功', `已删除${getTypeName(itemType)}项目 (ID: ${itemId})`, 'success');
}

// 基本编辑按钮功能
function setupBasicEditButtons() {
    document.querySelectorAll('.sky-edit-btn').forEach(btn => {
        btn.removeEventListener('click', handleEdit);
        btn.addEventListener('click', handleEdit);
    });
}

// 处理编辑按钮点击
function handleEdit(event) {
    const btn = event.currentTarget;
    const itemId = btn.getAttribute('data-id');
    const itemType = btn.getAttribute('data-type');
    
    if (!itemId || !itemType) {
        console.error('sky.js: 编辑按钮缺少必要的数据属性');
        return;
    }
    
    console.log(`sky.js: 编辑 ${itemType} ID=${itemId}`);
    
    // 显示消息
    showMessage('编辑模式', `正在编辑${getTypeName(itemType)}项目 (ID: ${itemId})`, 'info');
}

// 获取类型名称
function getTypeName(type) {
    switch(type) {
        case 'starmap': return '华夏星空';
        case 'xingxiu': return '二十八星宿';
        case 'function': return '星宿功能';
        case 'expression': return '星象表达';
        default: return type;
    }
}

// 显示消息
function showMessage(title, message, type = 'success') {
    // 检查是否有showToast函数
    if (typeof showToast === 'function') {
        showToast(title, message, type);
        return;
    }
    
    // 备用实现
    console.log(`${title}: ${message} (${type})`);
    
    // 创建一个简单的toast提示
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong>: ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // 使用Bootstrap Toast初始化
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Toast !== 'undefined') {
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        
        // 监听关闭事件
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    } else {
        // 简单显示
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

// 显示错误信息在页面上
function showError(message, stack) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const errorStack = document.getElementById('error-stack');
    
    if (errorContainer && errorMessage) {
        errorMessage.textContent = message || '未知错误';
        if (errorStack) {
            errorStack.textContent = stack || '';
        }
        errorContainer.classList.remove('d-none');
    }
    
    console.error(message, stack);
} 