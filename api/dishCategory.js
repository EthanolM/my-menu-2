const BASE_URL = 'http://localhost:8080/api'; // 请替换为你的后端实际地址

export default {
  // 获取所有分类
  getAll() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取单个分类
  getById(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories/${id}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 新增分类
  create(category) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories`,
        method: 'POST',
        data: category,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '新增分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 更新分类
  update(id, category) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories/${id}`,
        method: 'PUT',
        data: category,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '更新分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除分类
  remove(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories/${id}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 按名称搜索分类
  searchByName(name) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories/search`,
        method: 'GET',
        data: { name },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '搜索分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 统计用户分类数量
  countByUserId(userId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories/user/${userId}/count`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '统计用户分类数量失败');
          }
        },
        fail: reject
      });
    });
  },

  // 通过菜单集ID获取分类
  getByMenuSetId(menuSetId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-categories/menu/${menuSetId}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜单集分类失败');
          }
        },
        fail: reject
      });
    });
  }
}; 