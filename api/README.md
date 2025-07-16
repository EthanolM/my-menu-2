# API 目录说明

本目录用于统一管理前端与后端数据库交互的所有接口文件。每个 js 文件对应后端的一个实体或多对多关系，便于维护和调用。

## 目录结构

- dish.js           菜品相关接口
- category.js       菜品分类相关接口
- ingredient.js     食材相关接口
- menuset.js        菜单集相关接口
- dishIngredient.js 菜品与食材多对多关系接口
- menusetDish.js    菜单集与菜品多对多关系接口
- menusetIngredient.js 菜单集与食材多对多关系接口
- menusetCategory.js   菜单集与分类多对多关系接口

## 使用方法

1. 在页面或组件中引入对应的 api 文件：

```js
import dishApi from '@/api/dish.js';
import categoryApi from '@/api/category.js';
import ingredientApi from '@/api/ingredient.js';
import menusetApi from '@/api/menuset.js';
import dishIngredientApi from '@/api/dishIngredient.js';
import menusetDishApi from '@/api/menusetDish.js';
import menusetIngredientApi from '@/api/menusetIngredient.js';
import menusetCategoryApi from '@/api/menusetCategory.js';
```

2. 调用接口方法（所有方法均返回 Promise）：

### 菜品相关
```js
// 获取所有菜品
const dishes = await dishApi.getAll();
// 新增菜品
dishApi.create({ name: '新菜品', ... })
```

### 菜品与食材多对多
```js
// 获取某菜品的所有食材
const ingredients = await dishIngredientApi.getIngredientsByDishId(dishId);
// 给菜品添加食材
dishIngredientApi.addIngredientToDish(dishId, ingredientId)
```

### 菜单集与菜品多对多
```js
// 获取菜单集下所有菜品
const dishes = await menusetDishApi.getDishesByMenuSetId(menuSetId);
// 给菜单集添加菜品
menusetDishApi.addDishToMenuSet(menuSetId, dishId)
```

### 菜单集与食材多对多
```js
// 获取菜单集下所有食材
const ingredients = await menusetIngredientApi.getIngredientsByMenuSetId(menuSetId);
// 给菜单集添加食材
menusetIngredientApi.addIngredientToMenuSet(menuSetId, ingredientId)
```

### 菜单集与分类多对多
```js
// 获取菜单集下所有分类
const categories = await menusetCategoryApi.getCategoriesByMenuSetId(menuSetId);
// 给菜单集添加分类
menusetCategoryApi.addCategoryToMenuSet(menuSetId, categoryId)
```

3. 错误处理

所有方法均为 Promise，建议用 try-catch 或 .catch 处理异常。

```js
try {
  const list = await dishApi.getAll();
} catch (e) {
  uni.showToast({ title: e, icon: 'none' });
}
```

## 注意事项
- 请将每个 api 文件中的 BASE_URL 替换为你实际后端地址。
- 如需扩展其他多对多关系，可仿照现有写法新增。 