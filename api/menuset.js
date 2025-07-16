const BASE_URL = 'http://localhost:8080/api'; // 请替换为你的后端实际地址

export default {
  // 获取所有菜单集
  getAll() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/menu-sets`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜单集失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取单个菜单集
  getById(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/menu-sets/${id}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜单集失败');
          }
        },
        fail: reject
      });
    });
  },

  // 新增菜单集
  create(menuSet) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/menu-sets`,
        method: 'POST',
        data: menuSet,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '新增菜单集失败');
          }
        },
        fail: reject
      });
    });
  },

  // 更新菜单集
  update(id, menuSet) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/menu-sets/${id}`,
        method: 'PUT',
        data: menuSet,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '更新菜单集失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除菜单集
  remove(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/menu-sets/${id}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除菜单集失败');
          }
        },
        fail: reject
      });
    });
  }
}; 