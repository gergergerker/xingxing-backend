/**
 * 晓视界管理系统 - 用户管理模块
 */

// 初始化用户管理功能
function initUserManagement() {
    // 绑定保存用户按钮
    const saveUserBtn = document.getElementById('saveUserBtn');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', handleSaveUser);
    }
    
    // 绑定更新用户按钮
    const updateUserBtn = document.getElementById('updateUserBtn');
    if (updateUserBtn) {
        updateUserBtn.addEventListener('click', handleUpdateUser);
    }
    
    // 绑定用户编辑按钮
    setupUserEditButtons();
    
    // 绑定用户激活按钮
    setupUserActivateButtons();
    
    // 绑定用户搜索
    setupUserSearch();
    
    // 绑定用户角色过滤
    setupUserRoleFilter();
    
    // 初始化当前登录用户信息和权限
    initUserRole();
}

// 保存新用户
function handleSaveUser() {
    const userName = document.getElementById('userName').value;
    const userPhone = document.getElementById('userPhone').value;
    const userPassword = document.getElementById('userPassword').value;
    const userRole = document.getElementById('userRole').value;
    const userActive = document.getElementById('userActive').checked;
    
    if (!userName || !userPhone || !userPassword || !userRole) {
        showToast('验证失败', '请填写所有必填字段', 'danger');
        return;
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(userPhone)) {
        showToast('验证失败', '请输入正确的手机号格式', 'danger');
        return;
    }
    
    // 模拟保存过程
    showToast('保存中', '正在创建新用户...', 'info');
    
    setTimeout(() => {
        // 获取表格元素
        const tableBody = document.querySelector('.table tbody');
        
        if (tableBody) {
            // 获取新行ID
            const rowCount = tableBody.querySelectorAll('tr').length;
            const newId = rowCount + 1;
            
            // 创建新行
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${newId}</td>
                <td>${userName}</td>
                <td>${userPhone}</td>
                <td><span class="badge ${userRole === 'admin' ? 'bg-success' : 'bg-info'}">${userRole === 'admin' ? '管理员' : '编辑员'}</span></td>
                <td>${new Date().toISOString().split('T')[0]}</td>
                <td><span class="badge ${userActive ? 'bg-success' : 'bg-warning'}">${userActive ? '已激活' : '未激活'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning">
                        <i class="bi bi-pencil"></i> 编辑
                    </button>
                    ${!userActive ? `
                    <button class="btn btn-sm btn-success">
                        <i class="bi bi-check-circle"></i> 激活
                    </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger btn-delete-toggle">
                        <i class="bi bi-trash"></i> 删除
                    </button>
                    <button class="btn btn-sm btn-danger d-none btn-delete-confirm">
                        确认删除
                    </button>
                </td>
            `;
            
            // 添加到表格
            tableBody.appendChild(newRow);
            
            // 重新绑定按钮事件
            setupUserEditButtons();
            setupUserActivateButtons();
            setupDeleteConfirmation();
            
            // 关闭模态框
            const modalEl = document.getElementById('addUserModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
                modal.hide();
            }
            
            // 重置表单
            document.getElementById('addUserForm').reset();
            
            showToast('创建成功', `用户 ${userName} 已成功创建`, 'success');
        }
    }, 1000);
}

// 更新用户信息
function handleUpdateUser() {
    const userId = document.getElementById('editUserId').value;
    const userName = document.getElementById('editUserName').value;
    const userPhone = document.getElementById('editUserPhone').value;
    const userPassword = document.getElementById('editUserPassword').value;
    const userRole = document.getElementById('editUserRole').value;
    const userActive = document.getElementById('editUserActive').checked;
    
    if (!userName || !userPhone || !userRole) {
        showToast('验证失败', '请填写所有必填字段', 'danger');
        return;
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(userPhone)) {
        showToast('验证失败', '请输入正确的手机号格式', 'danger');
        return;
    }
    
    // 模拟更新过程
    showToast('更新中', '正在更新用户信息...', 'info');
    
    setTimeout(() => {
        // 获取表格元素
        const tableBody = document.querySelector('.table tbody');
        
        if (tableBody && userId) {
            // 查找对应行
            const rows = tableBody.querySelectorAll('tr');
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('td');
                if (cells.length && cells[0].textContent === userId) {
                    // 更新行数据
                    cells[1].textContent = userName;
                    cells[2].textContent = userPhone;
                    cells[3].innerHTML = `<span class="badge ${userRole === 'admin' ? 'bg-success' : 'bg-info'}">${userRole === 'admin' ? '管理员' : '编辑员'}</span>`;
                    cells[5].innerHTML = `<span class="badge ${userActive ? 'bg-success' : 'bg-warning'}">${userActive ? '已激活' : '未激活'}</span>`;
                    
                    // 更新按钮区域
                    const btnCell = cells[6];
                    let btnHtml = `
                        <button class="btn btn-sm btn-warning">
                            <i class="bi bi-pencil"></i> 编辑
                        </button>
                    `;
                    
                    if (!userActive) {
                        btnHtml += `
                            <button class="btn btn-sm btn-success">
                                <i class="bi bi-check-circle"></i> 激活
                            </button>
                        `;
                    }
                    
                    btnHtml += `
                        <button class="btn btn-sm btn-danger btn-delete-toggle">
                            <i class="bi bi-trash"></i> 删除
                        </button>
                        <button class="btn btn-sm btn-danger d-none btn-delete-confirm">
                            确认删除
                        </button>
                    `;
                    
                    btnCell.innerHTML = btnHtml;
                    
                    // 重新绑定按钮事件
                    setupUserEditButtons();
                    setupUserActivateButtons();
                    setupDeleteConfirmation();
                    
                    break;
                }
            }
            
            // 关闭模态框
            const modalEl = document.getElementById('editUserModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
                modal.hide();
            }
            
            showToast('更新成功', `用户 ${userName} 的信息已成功更新`, 'success');
        }
    }, 1000);
}

// 设置用户编辑按钮
function setupUserEditButtons() {
    const editButtons = document.querySelectorAll('.table .btn-warning');
    editButtons.forEach(btn => {
        // 确保是编辑按钮
        if (btn.innerHTML.includes('编辑')) {
            // 移除旧事件处理器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // 绑定新事件处理器
            newBtn.addEventListener('click', function() {
                const row = this.closest('tr');
                if (row) {
                    const cells = row.querySelectorAll('td');
                    const userId = cells[0].textContent;
                    const userName = cells[1].textContent;
                    const userPhone = cells[2].textContent;
                    const userRole = cells[3].querySelector('.badge').textContent.trim() === '管理员' ? 'admin' : 'editor';
                    const userActive = cells[5].querySelector('.badge').textContent.trim() === '已激活';
                    
                    // 填充编辑表单
                    document.getElementById('editUserId').value = userId;
                    document.getElementById('editUserName').value = userName;
                    document.getElementById('editUserPhone').value = userPhone;
                    document.getElementById('editUserPassword').value = ''; // 清空密码字段
                    document.getElementById('editUserRole').value = userRole;
                    document.getElementById('editUserActive').checked = userActive;
                    
                    // 显示编辑模态框
                    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
                    modal.show();
                }
            });
        }
    });
}

// 设置用户激活按钮
function setupUserActivateButtons() {
    const activateButtons = document.querySelectorAll('.table .btn-success');
    activateButtons.forEach(btn => {
        // 确保是激活按钮
        if (btn.innerHTML.includes('激活')) {
            // 移除旧事件处理器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // 绑定新事件处理器
            newBtn.addEventListener('click', function() {
                const row = this.closest('tr');
                if (row) {
                    const cells = row.querySelectorAll('td');
                    const userName = cells[1].textContent;
                    
                    // 显示提示
                    showToast('激活中', `正在激活用户 ${userName}...`, 'info');
                    
                    // 模拟激活过程
                    setTimeout(() => {
                        // 更新状态标签
                        cells[5].innerHTML = `<span class="badge bg-success">已激活</span>`;
                        
                        // 移除激活按钮
                        this.remove();
                        
                        showToast('激活成功', `用户 ${userName} 已成功激活`, 'success');
                    }, 1000);
                }
            });
        }
    });
}

// 用户搜索功能
function setupUserSearch() {
    const searchInput = document.getElementById('userSearchInput');
    const searchButton = document.getElementById('userSearchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (!searchTerm) return;
            
            const tableRows = document.querySelectorAll('.table tbody tr');
            let found = false;
            
            tableRows.forEach(row => {
                const userName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const userPhone = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (userName.includes(searchTerm) || userPhone.includes(searchTerm)) {
                    row.style.display = '';
                    found = true;
                } else {
                    row.style.display = 'none';
                }
            });
            
            if (!found) {
                showToast('搜索结果', '没有找到匹配的用户', 'info');
            }
        });
        
        // 回车触发搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
                e.preventDefault();
            }
        });
    }
}

// 用户角色筛选
function setupUserRoleFilter() {
    const filterDropdown = document.getElementById('userRoleFilter');
    const filterItems = document.querySelectorAll('#userRoleFilter + .dropdown-menu .dropdown-item');
    
    if (filterItems.length) {
        filterItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filterText = this.textContent.trim();
                const tableRows = document.querySelectorAll('.table tbody tr');
                
                tableRows.forEach(row => {
                    const roleCell = row.querySelector('td:nth-child(4)');
                    const roleBadge = roleCell.querySelector('.badge');
                    const roleText = roleBadge.textContent.trim();
                    
                    if (filterText === '全部角色' || roleText === (filterText === '管理员' ? '管理员' : '编辑员')) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                // 更新筛选按钮文本
                filterDropdown.innerHTML = `<i class="bi bi-funnel"></i> ${filterText}`;
            });
        });
    }
}

// 初始化用户角色和相关权限
function initUserRole() {
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
    
    // 设置基于用户角色的权限
    applyRolePermissions(userRole);
}

// 应用基于角色的权限
function applyRolePermissions(userRole) {
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
    }
} 