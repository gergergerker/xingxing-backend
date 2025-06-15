/**
 * 调试工具库 - 用于页面错误处理和调试
 */

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

// 确保错误容器存在
function ensureErrorContainer() {
    if (document.getElementById('error-container')) {
        return; // 容器已存在
    }
    
    // 创建错误容器
    const container = document.createElement('div');
    container.id = 'error-container';
    container.className = 'position-fixed bottom-0 start-0 p-3 d-none';
    container.innerHTML = `
        <div class="alert alert-danger">
            <h6>检测到错误</h6>
            <p id="error-message">未知错误</p>
            <pre id="error-stack" class="mt-2 small" style="max-height: 100px; overflow-y: auto;"></pre>
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="document.getElementById('error-container').classList.add('d-none')">
                关闭
            </button>
        </div>
    `;
    
    document.body.appendChild(container);
}

// 添加全局错误处理
function setupGlobalErrorHandlers() {
    // 确保错误容器存在
    ensureErrorContainer();
    
    // 未捕获的Promise错误处理
    window.addEventListener('unhandledrejection', function(event) {
        console.error('未处理的Promise错误:', event.reason);
        showError('未处理的Promise错误: ' + (event.reason?.message || event.reason), 
                  event.reason?.stack);
        // 阻止默认处理（如控制台打印等）
        event.preventDefault();
    });
    
    // 全局错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.message, e.filename, e.lineno);
        showError('页面错误: ' + e.message, 
                  `位置: ${e.filename}:${e.lineno}:${e.colno}\n堆栈: ${e.error?.stack || '未知'}`);
        // 防止页面崩溃
        e.preventDefault();
    });
    
    console.log('全局错误处理器已设置');
}

// 创建或获取一个调试面板
function createDebugPanel() {
    let panel = document.getElementById('debug-panel');
    
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.className = 'position-fixed top-0 end-0 p-3 bg-dark text-light rounded-bottom-start';
        panel.style.maxHeight = '80vh';
        panel.style.overflowY = 'auto';
        panel.style.zIndex = '9999';
        panel.style.opacity = '0.9';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="m-0">调试面板</h6>
                <button class="btn btn-sm btn-outline-light" onclick="document.getElementById('debug-panel').style.display='none'">关闭</button>
            </div>
            <div id="debug-logs" class="small font-monospace" style="max-height: 300px; overflow-y: auto;"></div>
        `;
        
        document.body.appendChild(panel);
    }
    
    return panel;
}

// 显示调试面板
function showDebugPanel() {
    const panel = createDebugPanel();
    panel.style.display = 'block';
}

// 添加调试日志
function addDebugLog(message) {
    const panel = createDebugPanel();
    const logsContainer = document.getElementById('debug-logs');
    
    if (logsContainer) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry border-bottom py-1';
        
        const timestamp = new Date().toISOString().substring(11, 19);
        logEntry.innerHTML = `<span class="text-secondary">[${timestamp}]</span> ${message}`;
        
        logsContainer.appendChild(logEntry);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }
    
    console.log(message);
}

// 检查页面加载状态
function checkPageLoad() {
    addDebugLog('检查页面加载状态...');
    
    // 检查关键脚本是否加载
    const scripts = ['bootstrap', 'admin.js', 'sky.js'];
    scripts.forEach(script => {
        let loaded = false;
        
        if (script === 'bootstrap') {
            loaded = typeof bootstrap !== 'undefined';
        } else if (script === 'admin.js') {
            loaded = typeof initAdminFunctions === 'function';
        } else if (script === 'sky.js') {
            loaded = typeof initSkyPage === 'function';
        }
        
        addDebugLog(`${script}: ${loaded ? '已加载' : '未加载'}`);
    });
    
    // 检查关键DOM元素
    const elements = ['skyTabs', 'chinese-starmap', 'xingxiu', 'xingxiu-functions', 'expressions'];
    elements.forEach(id => {
        const elem = document.getElementById(id);
        addDebugLog(`#${id}: ${elem ? '已找到' : '未找到'}`);
    });
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('debug.js: 页面已加载，正在设置调试工具...');
    setupGlobalErrorHandlers();
    
    // 创建调试快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D 显示调试面板
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            showDebugPanel();
            checkPageLoad();
            e.preventDefault();
        }
    });
}); 