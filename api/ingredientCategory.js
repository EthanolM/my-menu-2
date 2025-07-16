const BASE_URL = 'http://localhost:8080/api'; // 请替换为你的后端实际地址

export default {
  // 获取所有食材分类
  getAll() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取食材分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取单个食材分类
  getById(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories/${id}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取食材分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 新增食材分类
  create(category) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories`,
        method: 'POST',
        data: category,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '新增食材分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 更新食材分类
  update(id, category) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories/${id}`,
        method: 'PUT',
        data: category,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '更新食材分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除食材分类
  remove(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories/${id}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除食材分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 按名称搜索食材分类
  searchByName(name) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories/search`,
        method: 'GET',
        data: { name },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '搜索食材分类失败');
          }
        },
        fail: reject
      });
    });
  },

  // 通过菜单集ID获取食材分类
  getByMenuSetId(menuSetId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredient-categories/menu/${menuSetId}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜单集食材分类失败');
          }
        },
        fail: reject
      });
    });
  }
}; 