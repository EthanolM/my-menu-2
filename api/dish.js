const BASE_URL = 'http://localhost:8080/api'; // 请替换为你的后端实际地址

export default {
  // 获取所有菜品
  getAll() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取单个菜品
  getById(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/${id}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取菜单集菜品
  getByMenuSetId(menuSetId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/menu/${menuSetId}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜单集菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 新增菜品
  create(dish) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes`,
        method: 'POST',
        data: dish,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '新增菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 更新菜品
  update(id, dish) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/${id}`,
        method: 'PUT',
        data: dish,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '更新菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除菜品
  remove(id) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/${id}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 按名称搜索菜品
  searchByName(name) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/search`,
        method: 'GET',
        data: { name },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '搜索菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 按分类分组返回菜品
  getGroupedByCategory() {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/grouped-by-category`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '分组获取菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 按可用食材筛选菜品
  getWithAvailableIngredients(ingredientIds) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/with-available-ingredients`,
        method: 'POST',
        data: ingredientIds,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '按可用食材筛选菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 统计用户菜品数量
  countByUserId(userId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/user/${userId}/count`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '统计用户菜品数量失败');
          }
        },
        fail: reject
      });
    });
  },

  // 统计分类菜品数量
  countByCategoryId(categoryId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dishes/category/${categoryId}/count`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '统计分类菜品数量失败');
          }
        },
        fail: reject
      });
    });
  },
}; 