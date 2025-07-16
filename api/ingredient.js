const BASE_URL = 'http://localhost:8080/api'; // 请替换为你的后端实际地址

export default {
  // 获取所有食材
  getAll() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取单个食材
  getById(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/${id}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 新增食材
  create(ingredient) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients`,
        method: 'POST',
        data: ingredient,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '新增食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 更新食材
  update(id, ingredient) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/${id}`,
        method: 'PUT',
        data: ingredient,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '更新食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除食材
  remove(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/${id}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 按名称搜索食材
  searchByName(name) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/search`,
        method: 'GET',
        data: { name },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '搜索食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 统计用户食材数量
  countByUserId(userId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/user/${userId}/count`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '统计用户食材数量失败');
          }
        },
        fail: reject
      });
    });
  },

  // 统计分类食材数量
  countByCategoryId(categoryId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/category/${categoryId}/count`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '统计分类食材数量失败');
          }
        },
        fail: reject
      });
    });
  },

  // 通过菜单集ID获取食材
  getByMenuSetId(menuSetId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/ingredients/menu/${menuSetId}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜单集食材失败');
          }
        },
        fail: reject
      });
    });
  }
}; 