const BASE_URL = 'http://localhost:8080/api'; // 请替换为你的后端实际地址

export default {
  // 获取某菜品的所有食材
  getIngredientsByDishId(dishId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients/dish/${dishId}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取菜品食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取某食材的所有菜品
  getDishesByIngredientId(ingredientId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients/ingredient/${ingredientId}`,
        method: 'GET',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message || '获取食材菜品失败');
          }
        },
        fail: reject
      });
    });
  },

  // 给菜品添加食材
  addIngredientToDish(dishId, ingredientId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients`,
        method: 'POST',
        data: { dishId, ingredientId },
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '添加食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 从菜品移除食材
  removeIngredientFromDish(dishId, ingredientId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients`,
        method: 'DELETE',
        data: { dishId, ingredientId },
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '移除食材失败');
          }
        },
        fail: reject
      });
    });
  },

  // 批量添加关联
  addBatch(list) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients/batch`,
        method: 'POST',
        data: list,
        header: { 'Content-Type': 'application/json' },
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '批量添加关联失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除某菜品的所有食材关联
  removeByDishId(dishId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients/dish/${dishId}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除菜品所有食材关联失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除某食材的所有菜品关联
  removeByIngredientId(ingredientId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients/ingredient/${ingredientId}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除食材所有菜品关联失败');
          }
        },
        fail: reject
      });
    });
  },

  // 删除指定菜品和食材的关联
  removeByDishIdAndIngredientId(dishId, ingredientId) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${BASE_URL}/dish-ingredients/dish/${dishId}/ingredient/${ingredientId}`,
        method: 'DELETE',
        success: res => {
          if (res.data && res.data.code === 200) {
            resolve();
          } else {
            reject(res.data.message || '删除指定菜品和食材关联失败');
          }
        },
        fail: reject
      });
    });
  }
}; 