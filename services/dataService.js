/**
 * 数据服务 - 使用本地存储模拟数据库操作
 * 实际开发可改为云数据库
 */

// 菜品种类数据集
const sampleCategories = [
  {
    id: "1",
    name: "家常菜",
    order: 1,
    description: "日常家庭烹饪的经典菜品",
    color: "#FF6B6B"
  },
  {
    id: "2", 
    name: "川菜",
    order: 2,
    description: "四川特色菜系，麻辣鲜香",
    color: "#FF8E53"
  },
  {
    id: "3",
    name: "肉类",
    order: 3,
    description: "各种肉类烹饪菜品",
    color: "#4ECDC4"
  },
  {
    id: "4",
    name: "海鲜",
    order: 4,
    description: "鱼类、虾蟹等海鲜菜品",
    color: "#45B7D1"
  },
  {
    id: "5",
    name: "素菜",
    order: 5,
    description: "纯素菜品，健康营养",
    color: "#96CEB4"
  }
];

// 食材分类数据集
const sampleIngredientCategories = [
  { id: "1", name: "蔬菜", order: 1, description: "新鲜蔬菜", color: "#A3D977" },
  { id: "2", name: "禽蛋", order: 2, description: "禽类及蛋类", color: "#FFD166" },
  { id: "3", name: "肉类", order: 3, description: "各类肉类", color: "#FF6B6B" },
  { id: "4", name: "调料", order: 4, description: "调味品", color: "#B39DDB" },
  { id: "9", name: "其他", order: 99, description: "其他", color: "#B0BEC5" },
];

// 初始示例数据
// 使用数据库时更改id生成方式，例如雪花ID或UUID
const sampleDishes = [
  {
    id: "1",
    name: "番茄炒蛋",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    description: "经典家常菜，酸甜可口",
    ingredients: ["番茄", "鸡蛋", "葱花", "食盐", "食用油"],
    steps: [
      "番茄洗净切块，鸡蛋打散",
      "锅中放油，倒入鸡蛋炒至金黄",
      "放入番茄块翻炒，加盐调味",
      "炒至番茄出汁，撒上葱花即可",
    ],
    difficulty: "简单",
    categoryId: "1", // 关联到家常菜分类
  },
  {
    id: "2",
    name: "红烧排骨",
    image: "/static/images/dishes/braised-ribs.jpg",
    description: "肉质酥烂，口感醇厚",
    ingredients: ["排骨", "生姜", "大蒜", "酱油", "料酒", "八角", "冰糖"],
    steps: [
      "排骨洗净切段，焯水去血沫",
      "锅中放油，放入姜蒜爆香",
      "放入排骨煸炒上色",
      "加入调料和适量水，炖至酥烂",
    ],
    difficulty: "中等",
    categoryId: "3", // 关联到肉类分类
  },
  {
    id: "3",
    name: "清蒸鲈鱼",
    image: "/static/images/dishes/steamed-fish.jpg",
    description: "鲜嫩可口，营养丰富",
    ingredients: ["鲈鱼", "姜片", "葱段", "蒸鱼豉油", "食用油", "香菜"],
    steps: [
      "鲈鱼洗净，在两面划几刀",
      "腹中塞入姜片和葱段",
      "上锅蒸8-10分钟",
      "淋上热油和蒸鱼豉油，撒上香菜即可",
    ],
    difficulty: "中等",
    categoryId: "4", // 关联到海鲜分类
  },
  {
    id: "4",
    name: "宫保鸡丁",
    image: "/static/images/dishes/kung-pao-chicken.jpg",
    description: "麻辣鲜香，口感丰富",
    ingredients: ["鸡胸肉", "花生", "干辣椒", "花椒", "葱姜蒜", "酱油", "醋", "糖"],
    steps: [
      "鸡胸肉切丁，用料酒、淀粉腌制",
      "花生炒熟备用",
      "爆香干辣椒和花椒",
      "炒熟鸡丁，加入调味料",
      "最后加入花生翻炒均匀",
    ],
    difficulty: "中等",
    categoryId: "2", // 关联到川菜分类
  },
  {
    id: "5",
    name: "麻婆豆腐",
    image: "/static/images/dishes/mapo-tofu.jpg",
    description: "麻辣鲜香，豆腐嫩滑",
    ingredients: ["嫩豆腐", "猪肉末", "豆瓣酱", "花椒", "辣椒面", "葱花"],
    steps: [
      "豆腐切块，猪肉末炒熟",
      "爆香豆瓣酱和花椒",
      "加入豆腐块，小火炖煮",
      "最后撒上辣椒面和葱花",
    ],
    difficulty: "中等",
    categoryId: "2", // 关联到川菜分类
  },
  {
    id: "6",
    name: "糖醋里脊",
    image: "/static/images/dishes/sweet-sour-pork.jpg",
    description: "酸甜可口，外酥里嫩",
    ingredients: ["猪里脊", "淀粉", "鸡蛋", "番茄酱", "醋", "糖"],
    steps: [
      "里脊肉切条，裹上淀粉和蛋液",
      "油炸至金黄酥脆",
      "调制糖醋汁",
      "将炸好的里脊裹上糖醋汁",
    ],
    difficulty: "中等",
    categoryId: "1", // 关联到家常菜分类
  },
  {
    id: "7",
    name: "水煮鱼",
    image: "/static/images/dishes/boiled-fish.jpg",
    description: "麻辣鲜香，鱼肉嫩滑",
    ingredients: ["草鱼", "豆芽", "干辣椒", "花椒", "姜蒜", "葱花"],
    steps: [
      "鱼肉切片，腌制入味",
      "豆芽焯水垫底",
      "爆香干辣椒和花椒",
      "加入鱼片煮熟",
      "最后淋上热油",
    ],
    difficulty: "较难",
    categoryId: "2", // 关联到川菜分类
  },
  {
    id: "8",
    name: "蒜蓉炒空心菜",
    image: "/static/images/dishes/garlic-vegetables.jpg",
    description: "清脆爽口，蒜香四溢",
    ingredients: ["空心菜", "蒜末", "盐", "食用油"],
    steps: [
      "空心菜洗净切段",
      "爆香蒜末",
      "加入空心菜快速翻炒",
      "加盐调味即可",
    ],
    difficulty: "简单",
    categoryId: "5", // 关联到素菜分类
  },
  {
    id: "9",
    name: "红烧肉",
    image: "/static/images/dishes/braised-pork.jpg",
    description: "肥而不腻，入口即化",
    ingredients: ["五花肉", "冰糖", "酱油", "料酒", "八角", "桂皮"],
    steps: [
      "五花肉切块，焯水去腥",
      "炒糖色",
      "加入肉块翻炒上色",
      "加入调料和适量水，炖至酥烂",
    ],
    difficulty: "中等",
    categoryId: "3", // 关联到肉类分类
  },
  {
    id: "10",
    name: "清炒小白菜",
    image: "/static/images/dishes/vegetables.jpg",
    description: "清淡爽口，营养丰富",
    ingredients: ["小白菜", "蒜末", "盐", "食用油"],
    steps: [
      "小白菜洗净切段",
      "爆香蒜末",
      "加入小白菜快速翻炒",
      "加盐调味即可",
    ],
    difficulty: "简单",
    categoryId: "5", // 关联到素菜分类
  }
];

// 初始示例食材数据
const sampleIngredients = [
  { id: "1", name: "番茄", category: "蔬菜", inStock: true, menuSetId: "default" },
  { id: "2", name: "鸡蛋", category: "禽蛋", inStock: true, menuSetId: "default" },
  { id: "3", name: "排骨", category: "肉类", inStock: true, menuSetId: "default" },
  { id: "4", name: "姜", category: "调料", inStock: true, menuSetId: "default" },
  { id: "5", name: "葱", category: "蔬菜", inStock: true, menuSetId: "default" },
  { id: "6", name: "酱油", category: "调料", inStock: true, menuSetId: "default" },
];

// 示例菜单集数据
const sampleMenuSets = [
  {
    id: "default",
    name: "默认菜单",
    dishes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], // 会使用全局菜品ID引用
    ingredients: ["1", "2", "3", "4", "5", "6"], // 会使用全局食材ID引用
    categories: ["1", "2", "3", "4", "5"], // 会使用全局分类ID引用
    isDefault: true,
    userId: "1", // 用户ID
    createdAt: new Date().toISOString(),
  },
];

// 初始化
const initializeData = () => {
  if (!uni.getStorageSync("categories")) {
    uni.setStorageSync("categories", sampleCategories);
  }
  if (!uni.getStorageSync("dishes")) {
    uni.setStorageSync("dishes", sampleDishes);
  }
  if (!uni.getStorageSync("ingredients")) {
    uni.setStorageSync("ingredients", sampleIngredients);
  }
  if (!uni.getStorageSync("menuSets")) {
    uni.setStorageSync("menuSets", sampleMenuSets);
  }
  if (!uni.getStorageSync("ingredientCategories")) {
    uni.setStorageSync("ingredientCategories", sampleIngredientCategories);
  }

  // 确保有默认菜单集
  const menuSets = uni.getStorageSync("menuSets") || [];
  if (menuSets.length === 0) {
    uni.setStorageSync("menuSets", sampleMenuSets);
  }

  // 存储当前选中的菜单集
  if (!uni.getStorageSync("currentMenuSetId")) {
    uni.setStorageSync("currentMenuSetId", "default");
  }

  // 执行食材数据迁移
  migrateIngredientCategory();
};

// 菜品种类操作
const categoryService = {
  // 获取所有分类
  getAllCategories() {
    return uni.getStorageSync("categories") || sampleCategories;
  },

  // 获取单个分类
  getCategoryById(id) {
    const categories = this.getAllCategories();
    return categories.find((category) => category.id === id);
  },

  // 根据名称获取分类
  getCategoryByName(name) {
    const categories = this.getAllCategories();
    return categories.find((category) => category.name === name);
  },

  // 添加分类
  addCategory(categoryData) {
    try {
      const categories = this.getAllCategories();
      const maxOrder = Math.max(...categories.map(cat => cat.order), 0);
      
      const newCategory = {
        id: Date.now().toString(),
        name: categoryData.name,
        order: maxOrder + 1,
        description: categoryData.description || "",
        color: categoryData.color || "#FF6B6B"
      };

      categories.push(newCategory);
      uni.setStorageSync("categories", categories);
      return newCategory;
    } catch (e) {
      console.error("Error adding category:", e);
      return null;
    }
  },

  // 更新分类
  updateCategory(categoryData) {
    try {
      const categories = this.getAllCategories();
      const index = categories.findIndex((category) => category.id === categoryData.id);
      
      if (index !== -1) {
        categories[index] = {
          ...categories[index],
          ...categoryData
        };
        uni.setStorageSync("categories", categories);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error updating category:", e);
      return false;
    }
  },

  // 删除分类
  deleteCategory(id) {
    try {
      const categories = this.getAllCategories();
      const filteredCategories = categories.filter((category) => category.id !== id);
      uni.setStorageSync("categories", filteredCategories);
      return true;
    } catch (e) {
      console.error("Error deleting category:", e);
      return false;
    }
  },

  // 获取按顺序排列的分类
  getCategoriesByOrder() {
    const categories = this.getAllCategories();
    return categories.sort((a, b) => a.order - b.order);
  },

  // 更新分类顺序
  updateCategoryOrder(newOrder) {
    try {
      const categories = this.getAllCategories();
      const updatedCategories = categories.map(category => {
        const newIndex = newOrder.indexOf(category.id);
        if (newIndex !== -1) {
          return { ...category, order: newIndex + 1 };
        }
        return category;
      });
      
      uni.setStorageSync("categories", updatedCategories);
      return true;
    } catch (e) {
      console.error("Error updating category order:", e);
      return false;
    }
  },

  // 移动分类位置
  moveCategory(categoryId, newOrder) {
    try {
      const categories = this.getAllCategories();
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      
      if (categoryIndex === -1) return false;
      
      // 重新排序所有分类
      const reorderedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, order: newOrder };
        } else if (cat.order >= newOrder) {
          return { ...cat, order: cat.order + 1 };
        }
        return cat;
      });
      
      uni.setStorageSync("categories", reorderedCategories);
      return true;
    } catch (e) {
      console.error("Error moving category:", e);
      return false;
    }
  }
};

// TODO 更改id生成方式，因为使用时间戳可能会重复
// 菜品操作
const dishService = {
  //获取所有菜品 //TODO 真的需要吗
  getAllDishes() {
    return uni.getStorageSync("dishes") || [];
  },

  // 获取单个菜品
  getDishById(id) {
    const dishes = this.getAllDishes();
    return dishes.find((dish) => dish.id === id);
  },

  // 添加菜品
  addDish(dishData) {
    try {
      const newDish = {
        id: Date.now().toString(), //TODO 改成使用其他id生成方式
        name: dishData.name,
        description: dishData.description,
        image: dishData.image,
        categoryId: dishData.categoryId,
        ingredients: [...(dishData.ingredients || [])],
        steps: [...(dishData.steps || [])],
        difficulty: dishData.difficulty || "简单"
      };

      const dishes = this.getAllDishes();
      dishes.push(newDish);
      uni.setStorageSync("dishes", dishes);
      return newDish;
    } catch (e) {
      console.error("Error adding dish:", e);
      return null;
    }
  },

  // 更新菜品
  updateDish(dishData) {
    try {
      const updatedDish = {
        id: dishData.id,
        name: dishData.name,
        description: dishData.description,
        image: dishData.image,
        categoryId: dishData.categoryId,
        ingredients: [...(dishData.ingredients || [])],
        steps: [...(dishData.steps || [])],
        difficulty: dishData.difficulty || "简单"
      };

      const dishes = this.getAllDishes();
      const index = dishes.findIndex((dish) => dish.id === updatedDish.id);
      if (index !== -1) {
        dishes[index] = updatedDish;
        uni.setStorageSync("dishes", dishes);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error updating dish:", e);
      return false;
    }
  },

  // 删除菜品
  deleteDish(id) {
    const dishes = this.getAllDishes();
    const filteredDishes = dishes.filter((dish) => dish.id !== id);
    uni.setStorageSync("dishes", filteredDishes);
    return true;
  },

  // 获取菜品可用性（基于当前菜单集的食材）
  getDishesWithAvailableIngredients() {
    const dishes = this.getAllDishes();
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    
    // 获取当前菜单集中在库的食材
    const currentMenuSetIngredients = ingredientService.getIngredientsByMenuSet(currentMenuSetId);
    const availableIngredients = currentMenuSetIngredients
      .filter(ing => ing.inStock)
      .map(ing => ing.name);

    return dishes
      .map((dish) => {
        const requiredIngredients = dish.ingredients || [];
        const availableCount = requiredIngredients.filter((ing) =>
          availableIngredients.includes(ing)
        ).length;

        return {
          ...dish,
          availableIngredientsCount: availableCount,
          totalIngredientsCount: requiredIngredients.length,
          availabilityPercentage: requiredIngredients.length > 0 ? 
            Math.round((availableCount / requiredIngredients.length) * 100) : 100,
        };
      })
      .sort((a, b) => b.availabilityPercentage - a.availabilityPercentage);
  },

  // 获取当前菜单集菜品的可用性
  getCurrentMenuSetDishesWithAvailability() {
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    const menuSetDishes = menuSetService.getDishesInMenuSet(currentMenuSetId);
    
    // 获取当前菜单集中在库的食材
    const currentMenuSetIngredients = ingredientService.getIngredientsByMenuSet(currentMenuSetId);
    const availableIngredients = currentMenuSetIngredients
      .filter(ing => ing.inStock)
      .map(ing => ing.name);

    return menuSetDishes
      .map((dish) => {
        const requiredIngredients = dish.ingredients || [];
        const availableCount = requiredIngredients.filter((ing) =>
          availableIngredients.includes(ing)
        ).length;

        return {
          ...dish,
          availableIngredientsCount: availableCount,
          totalIngredientsCount: requiredIngredients.length,
          availabilityPercentage: requiredIngredients.length > 0 ? 
            Math.round((availableCount / requiredIngredients.length) * 100) : 100,
        };
      })
      .sort((a, b) => b.availabilityPercentage - a.availabilityPercentage);
  },

  // 获取菜品按分类分组（按分类顺序排列）
  getDishesByCategory() {
    const dishes = this.getAllDishes();
    const categories = categoryService.getCategoriesByOrder();
    
    const categorizedDishes = categories.map(category => {
      const categoryDishes = dishes.filter(dish => dish.categoryId === category.id);
      return {
        ...category,
        dishes: categoryDishes
      };
    }).filter(category => category.dishes.length > 0); // 只返回有菜品的分类
    
    return categorizedDishes;
  },

  // 获取当前菜单集的所有菜品（按分类顺序排列）
  getCurrentMenuSetDishesByCategory() {
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    const menuSetDishes = menuSetService.getDishesInMenuSet(currentMenuSetId);
    const categories = menuSetService.getCurrentMenuSetCategoriesByOrder();
    
    const categorizedDishes = categories.map(category => {
      const categoryDishes = menuSetDishes.filter(dish => dish.categoryId === category.id);
      return {
        ...category,
        dishes: categoryDishes
      };
    }).filter(category => category.dishes.length > 0); // 只返回有菜品的分类
    
    return categorizedDishes;
  },

  // 获取所有菜品分类（兼容旧版本）
  getAllCategories() {
    const categories = menuSetService.getCurrentMenuSetCategories();
    return categories.map(cat => cat.name);
  },

  // 获取用户自定义的分类顺序（兼容旧版本）
  getCategoryOrder() {
    const categories = menuSetService.getCurrentMenuSetCategoriesByOrder();
    return categories.map(cat => cat.name);
  },

  // 保存用户自定义的分类顺序（兼容旧版本）
  saveCategoryOrder(order) {
    // 这个方法现在委托给categoryService，但只更新当前菜单集的分类
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    const categoryIds = order.map(categoryName => {
      const category = categoryService.getAllCategories().find(cat => cat.name === categoryName);
      return category ? category.id : null;
    }).filter(id => id !== null);
    
    // 更新当前菜单集的分类
    const menuSet = menuSetService.getMenuSetById(currentMenuSetId);
    menuSet.categories = categoryIds;
    menuSetService.updateMenuSet(menuSet);
    
    // 更新分类的顺序信息
    const categories = categoryService.getAllCategories();
    const updatedCategories = categories.map(category => {
      const newIndex = categoryIds.indexOf(category.id);
      if (newIndex !== -1) {
        return { ...category, order: newIndex + 1 };
      }
      return category;
    });
    
    uni.setStorageSync("categories", updatedCategories);
    return true;
  },
};

// 食材操作
const ingredientService = {
  // 获取所有食材
  getAllIngredients() {
    return uni.getStorageSync("ingredients") || [];
  },

  // 获取在库食材
  getInStockIngredients() {
    const ingredients = this.getAllIngredients();
    return ingredients.filter((ing) => ing.inStock);
  },

  // 添加食材到当前菜单集
  addIngredient(ingredient) {
    const ingredients = this.getAllIngredients();
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    
    const newIngredient = {
      ...ingredient,
      id: Date.now().toString(),
      menuSetId: currentMenuSetId, // 自动关联到当前菜单集
    };
    
    ingredients.push(newIngredient);
    uni.setStorageSync("ingredients", ingredients);
    
    // 同时添加到菜单集的食材列表中
    menuSetService.addIngredientToMenuSet(currentMenuSetId, newIngredient.id);
    
    return newIngredient;
  },

  // 更新食材
  updateIngredient(updatedIngredient) {
    const ingredients = this.getAllIngredients();
    const index = ingredients.findIndex(
      (ing) => ing.id === updatedIngredient.id
    );
    if (index !== -1) {
      ingredients[index] = updatedIngredient;
      uni.setStorageSync("ingredients", ingredients);
      return true;
    }
    return false;
  },

  // 删除食材（只删除当前菜单集的食材）
  deleteIngredient(id) {
    const ingredients = this.getAllIngredients();
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    // 找到被删除的食材对象
    const deletedIngredient = ingredients.find(ing => ing.id === id && ing.menuSetId === currentMenuSetId);
    // 只删除当前菜单集的食材
    const filteredIngredients = ingredients.filter((ing) => 
      !(ing.id === id && ing.menuSetId === currentMenuSetId)
    );
    uni.setStorageSync("ingredients", filteredIngredients);
    // 从菜单集中移除食材ID
    menuSetService.removeIngredientFromMenuSet(currentMenuSetId, id);
    // 如果找到了被删除的食材，移除所有菜品对该食材的依赖
    if (deletedIngredient) {
      const ingredientName = deletedIngredient.name;
      const dishes = dishService.getAllDishes();
      let changed = false;
      dishes.forEach(dish => {
        if (dish.ingredients && dish.ingredients.includes(ingredientName)) {
          dish.ingredients = dish.ingredients.filter(ing => ing !== ingredientName);
          changed = true;
        }
      });
      if (changed) {
        uni.setStorageSync("dishes", dishes);
      }
    }
    return true;
  },

  // 更新食材库存状态（只影响当前菜单集的食材）
  toggleIngredientStock(id) {
    const ingredients = this.getAllIngredients();
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    
    const index = ingredients.findIndex((ing) => 
      ing.id === id && ing.menuSetId === currentMenuSetId
    );
    
    if (index !== -1) {
      ingredients[index].inStock = !ingredients[index].inStock;
      uni.setStorageSync("ingredients", ingredients);
      return true;
    }
    return false;
  },

  // 获取当前菜单集的所有食材
  getCurrentMenuSetIngredients() {
    const currentMenuSetId = menuSetService.getCurrentMenuSetId();
    const ingredients = this.getAllIngredients();
    
    return ingredients.filter((ingredient) => 
      ingredient.menuSetId === currentMenuSetId
    );
  },

  // 获取指定菜单集的所有食材
  getIngredientsByMenuSet(menuSetId) {
    const ingredients = this.getAllIngredients();
    return ingredients.filter((ingredient) => 
      ingredient.menuSetId === menuSetId
    );
  },

  // 数据迁移：为现有食材添加menuSetId
  migrateIngredientsData() {
    const ingredients = this.getAllIngredients();
    let hasChanges = false;
    
    const migratedIngredients = ingredients.map(ingredient => {
      if (!ingredient.menuSetId) {
        hasChanges = true;
        return {
          ...ingredient,
          menuSetId: "default" // 默认关联到默认菜单集
        };
      }
      return ingredient;
    });
    
    if (hasChanges) {
      uni.setStorageSync("ingredients", migratedIngredients);
      console.log("食材数据迁移完成");
    }
    
    return migratedIngredients;
  }
};

// 菜单集操作
const menuSetService = {
  // 获取所有菜单集
  getAllMenuSets() {
    return uni.getStorageSync("menuSets") || sampleMenuSets;
  },

  // 获取单个菜单集
  getMenuSetById(id) {
    const menuSets = this.getAllMenuSets();
    return menuSets.find((set) => set.id === id) || menuSets[0];
  },

  // 获取当前选中的菜单集ID
  getCurrentMenuSetId() {
    return uni.getStorageSync("currentMenuSetId") || "default";
  },

  // 获取当前选中的菜单集
  getCurrentMenuSet() {
    const currentMenuSetId = this.getCurrentMenuSetId();
    return this.getMenuSetById(currentMenuSetId);
  },

  // 设置当前菜单集
  setCurrentMenuSet(id) {
    uni.setStorageSync("currentMenuSetId", id);
    return true;
  },

  // 创建新的菜单集
  createMenuSet(name) {
    const menuSets = this.getAllMenuSets();
    const newMenuSet = {
      id: Date.now().toString(),
      name: name,
      dishes: [],
      ingredients: [],
      categories: [],
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    console.log("createMenuSet", newMenuSet);
    menuSets.push(newMenuSet);
    uni.setStorageSync("menuSets", menuSets);
    return newMenuSet;
  },

  // 更新菜单集
  updateMenuSet(updatedMenuSet) {
    const menuSets = this.getAllMenuSets();
    const index = menuSets.findIndex((set) => set.id === updatedMenuSet.id);

    if (index !== -1) {
      menuSets[index] = updatedMenuSet;
      uni.setStorageSync("menuSets", menuSets);
      console.log("updateMenuSet", updatedMenuSet);
      return true;
    }
    return false;
  },

  // 删除菜单集
  deleteMenuSet(id) {
    const menuSets = this.getAllMenuSets();
    // 不允许删除默认菜单集
    if (menuSets.find((set) => set.id === id)?.isDefault) {
      return false;
    }

    const filteredMenuSets = menuSets.filter((set) => set.id !== id);
    uni.setStorageSync("menuSets", filteredMenuSets);

    // 如果删除的是当前选中的菜单集，则切换到默认菜单集
    if (this.getCurrentMenuSetId() === id) {
      const defaultSet =
        filteredMenuSets.find((set) => set.isDefault) || filteredMenuSets[0];
      this.setCurrentMenuSet(defaultSet.id);
    }

    return true;
  },

  // 添加菜品到菜单集
  addDishToMenuSet(menuSetId, dishId) {
    const menuSets = this.getAllMenuSets();
    const menuSetIndex = menuSets.findIndex((set) => set.id === menuSetId);

    if (menuSetIndex !== -1) {
      if (!menuSets[menuSetIndex].dishes.includes(dishId)) {
        menuSets[menuSetIndex].dishes.push(dishId);
        
        // 自动添加菜品对应的分类到菜单集
        const dish = dishService.getDishById(dishId);
        if (dish && dish.categoryId && !menuSets[menuSetIndex].categories.includes(dish.categoryId)) {
          menuSets[menuSetIndex].categories.push(dish.categoryId);
        }
        
        uni.setStorageSync("menuSets", menuSets);
        console.log("addDishToMenuSet", menuSets[menuSetIndex]);
      }
      return true;
    }
    return false;
  },

  // 从菜单集中移除菜品
  removeDishFromMenuSet(menuSetId, dishId) {
    const menuSets = this.getAllMenuSets();
    const menuSetIndex = menuSets.findIndex((set) => set.id === menuSetId);

    if (menuSetIndex !== -1) {
      menuSets[menuSetIndex].dishes = menuSets[menuSetIndex].dishes.filter(
        (id) => id !== dishId
      );
      uni.setStorageSync("menuSets", menuSets);
      return true;
    }
    return false;
  },

  // 获取菜单集中的所有菜品
  getDishesInMenuSet(menuSetId) {
    const menuSet = this.getMenuSetById(menuSetId);
    const allDishes = dishService.getAllDishes();

    return allDishes.filter((dish) => menuSet.dishes.includes(dish.id));
  },

  // 添加食材到菜单集
  addIngredientToMenuSet(menuSetId, ingredientId) {
    const menuSets = this.getAllMenuSets();
    const menuSetIndex = menuSets.findIndex((set) => set.id === menuSetId);

    if (menuSetIndex !== -1) {
      if (!menuSets[menuSetIndex].ingredients.includes(ingredientId)) {
        menuSets[menuSetIndex].ingredients.push(ingredientId);
        uni.setStorageSync("menuSets", menuSets);
      }
      return true;
    }
    return false;
  },

  // 从菜单集中移除食材
  removeIngredientFromMenuSet(menuSetId, ingredientId) {
    const menuSets = this.getAllMenuSets();
    const menuSetIndex = menuSets.findIndex((set) => set.id === menuSetId);

    if (menuSetIndex !== -1) {
      menuSets[menuSetIndex].ingredients = menuSets[
        menuSetIndex
      ].ingredients.filter((id) => id !== ingredientId);
      uni.setStorageSync("menuSets", menuSets);
      return true;
    }
    return false;
  },

  // 获取菜单集中的所有食材
  getIngredientsInMenuSet(menuSetId) {
    // 直接使用ingredientService的方法获取指定菜单集的食材
    return ingredientService.getIngredientsByMenuSet(menuSetId);
  },

  // 添加分类到菜单集
  addCategoryToMenuSet(menuSetId, categoryId) {
    const menuSets = this.getAllMenuSets();
    const menuSetIndex = menuSets.findIndex((set) => set.id === menuSetId);

    if (menuSetIndex !== -1) {
      if (!menuSets[menuSetIndex].categories.includes(categoryId)) {
        menuSets[menuSetIndex].categories.push(categoryId);
        uni.setStorageSync("menuSets", menuSets);
        console.log("addCategoryToMenuSet", menuSets[menuSetIndex]);
      }
      return true;
    }
    return false;
  },

  // 从菜单集中移除分类
  removeCategoryFromMenuSet(menuSetId, categoryId) {
    const menuSets = this.getAllMenuSets();
    const menuSetIndex = menuSets.findIndex((set) => set.id === menuSetId);

    if (menuSetIndex !== -1) {
      // 移除分类
      menuSets[menuSetIndex].categories = menuSets[menuSetIndex].categories.filter(
        (id) => id !== categoryId
      );
      
      // 同时移除该分类下的所有菜品
      const dishesInCategory = menuSets[menuSetIndex].dishes.filter(dishId => {
        const dish = dishService.getDishById(dishId);
        return dish && dish.categoryId === categoryId;
      });
      
      menuSets[menuSetIndex].dishes = menuSets[menuSetIndex].dishes.filter(dishId => {
        const dish = dishService.getDishById(dishId);
        return !dish || dish.categoryId !== categoryId;
      });
      
      uni.setStorageSync("menuSets", menuSets);
      console.log(`Removed category ${categoryId} and ${dishesInCategory.length} dishes from menu set ${menuSetId}`);
      return true;
    }
    return false;
  },

  // 获取菜单集中的所有分类
  getCategoriesInMenuSet(menuSetId) {
    const menuSet = this.getMenuSetById(menuSetId);
    const allCategories = categoryService.getAllCategories();

    return allCategories.filter((category) =>
      menuSet.categories.includes(category.id)
    );
  },

  // 获取当前菜单集的分类
  getCurrentMenuSetCategories() {
    const currentMenuSetId = this.getCurrentMenuSetId();
    return this.getCategoriesInMenuSet(currentMenuSetId);
  },

  // 获取菜单集中按顺序排列的分类
  getCategoriesInMenuSetByOrder(menuSetId) {
    const menuSetCategories = this.getCategoriesInMenuSet(menuSetId);
    return menuSetCategories.sort((a, b) => a.order - b.order);
  },

  // 获取当前菜单集按顺序排列的分类
  getCurrentMenuSetCategoriesByOrder() {
    const currentMenuSetId = this.getCurrentMenuSetId();
    return this.getCategoriesInMenuSetByOrder(currentMenuSetId);
  },

  // 获取菜单集中可用的分类（不在当前菜单集中的分类）
  getAvailableCategoriesForMenuSet(menuSetId) {
    const allCategories = categoryService.getAllCategories();
    const menuSetCategories = this.getCategoriesInMenuSet(menuSetId);
    const menuSetCategoryIds = menuSetCategories.map(cat => cat.id);
    
    return allCategories.filter(category => !menuSetCategoryIds.includes(category.id));
  },

  // 获取当前菜单集可用的分类
  getCurrentMenuSetAvailableCategories() {
    const currentMenuSetId = this.getCurrentMenuSetId();
    return this.getAvailableCategoriesForMenuSet(currentMenuSetId);
  },
};

// 分享菜单功能
const shareService = {
  // 获取分享历史
  getShareHistory() {
    return uni.getStorageSync("shareHistory") || [];
  },

  // 添加分享记录
  addShareRecord(record) {
    const history = this.getShareHistory();
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    history.unshift(newRecord);
    uni.setStorageSync("shareHistory", history);
    return newRecord;
  },

  // 生成分享ID
  generateShareId() {
    return Math.random().toString(36).substring(2, 10);
  },

  // 创建分享菜单
  createShareMenu(menuSetId, name) {
    const shareId = this.generateShareId();
    const shareMenu = {
      id: shareId,
      name: name || "我的菜单集",
      menuSetId,
      created: new Date().toISOString(),
    };

    // 保存分享菜单
    const sharedMenus = uni.getStorageSync("sharedMenus") || {};
    sharedMenus[shareId] = shareMenu;
    uni.setStorageSync("sharedMenus", sharedMenus);

    // 记录分享历史
    this.addShareRecord({
      shareId,
      name: shareMenu.name,
      menuSetId: menuSetId,
    });

    return shareId;
  },

  // 获取分享菜单
  getSharedMenu(shareId) {
    const sharedMenus = uni.getStorageSync("sharedMenus") || {};
    return sharedMenus[shareId];
  },

  // 获取分享的评论和点赞数据
  getShareData(shareId) {
    const shareData = uni.getStorageSync(`share_data_${shareId}`) || {
      comments: [],
      likes: 0,
    };
    return shareData;
  },

  // 检查用户是否已点赞
  isLikedByUser(shareId) {
    const likedShares = uni.getStorageSync("user_liked_shares") || [];
    return likedShares.includes(shareId);
  },

  // 点赞分享
  likeShare(shareId) {
    const shareData = this.getShareData(shareId);
    shareData.likes = (shareData.likes || 0) + 1;
    uni.setStorageSync(`share_data_${shareId}`, shareData);

    const likedShares = uni.getStorageSync("user_liked_shares") || [];
    likedShares.push(shareId);
    uni.setStorageSync("user_liked_shares", likedShares);
  },

  // 取消点赞
  unlikeShare(shareId) {
    const shareData = this.getShareData(shareId);
    shareData.likes = Math.max((shareData.likes || 0) - 1, 0);
    uni.setStorageSync(`share_data_${shareId}`, shareData);

    const likedShares = uni.getStorageSync("user_liked_shares") || [];
    const index = likedShares.indexOf(shareId);
    if (index > -1) {
      likedShares.splice(index, 1);
      uni.setStorageSync("user_liked_shares", likedShares);
    }
  },

  // 添加评论
  addComment(shareId, content) {
    const shareData = this.getShareData(shareId);
    const comment = {
      id: Date.now().toString(),
      content,
      username: "用户" + Math.floor(Math.random() * 1000),
      avatar: "/static/images/default-avatar.png",
      time: new Date().toISOString(),
    };

    shareData.comments = shareData.comments || [];
    shareData.comments.unshift(comment);
    uni.setStorageSync(`share_data_${shareId}`, shareData);

    return comment;
  },
};

// 食材分类操作
const ingredientCategoryService = {
  getAllCategories() {
    return uni.getStorageSync("ingredientCategories") || sampleIngredientCategories;
  },
  getCategoryById(id) {
    return this.getAllCategories().find(cat => cat.id === id);
  },
  getCategoryByName(name) {
    return this.getAllCategories().find(cat => cat.name === name);
  },
  addCategory(categoryData) {
    try {
      const categories = this.getAllCategories();
      const maxOrder = Math.max(...categories.map(cat => cat.order), 0);
      const newCategory = {
        id: Date.now().toString(),
        name: categoryData.name,
        order: maxOrder + 1,
        description: categoryData.description || "",
        color: categoryData.color || "#B0BEC5"
      };
      categories.push(newCategory);
      uni.setStorageSync("ingredientCategories", categories);
      return newCategory;
    } catch (e) {
      console.error("Error adding ingredient category:", e);
      return null;
    }
  },
  updateCategory(categoryData) {
    try {
      const categories = this.getAllCategories();
      const index = categories.findIndex(cat => cat.id === categoryData.id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...categoryData };
        uni.setStorageSync("ingredientCategories", categories);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error updating ingredient category:", e);
      return false;
    }
  },
  deleteCategory(id) {
    try {
      const categories = this.getAllCategories();
      const filtered = categories.filter(cat => cat.id !== id);
      uni.setStorageSync("ingredientCategories", filtered);
      return true;
    } catch (e) {
      console.error("Error deleting ingredient category:", e);
      return false;
    }
  },
  getCategoriesByOrder() {
    return this.getAllCategories().sort((a, b) => a.order - b.order);
  },
  updateCategoryOrder(newOrder) {
    try {
      const categories = this.getAllCategories();
      const updated = categories.map(cat => {
        const newIndex = newOrder.indexOf(cat.id);
        if (newIndex !== -1) {
          return { ...cat, order: newIndex + 1 };
        }
        return cat;
      });
      uni.setStorageSync("ingredientCategories", updated);
      return true;
    } catch (e) {
      console.error("Error updating ingredient category order:", e);
      return false;
    }
  },
};

// 迁移旧食材数据，将 category 字符串转为 categoryId
const migrateIngredientCategory = () => {
  const ingredients = uni.getStorageSync("ingredients") || [];
  let changed = false;
  const migrated = ingredients.map(ing => {
    if (ing.category && !ing.categoryId) {
      const cat = ingredientCategoryService.getCategoryByName(ing.category);
      changed = true;
      return {
        ...ing,
        categoryId: cat ? cat.id : "9", // "其他"
        category: undefined
      };
    }
    return ing;
  });
  if (changed) {
    uni.setStorageSync("ingredients", migrated);
    console.log("食材分类数据迁移完成");
  }
  return migrated;
};

// 初始化数据
initializeData();

export {
  initializeData,
  categoryService,
  dishService,
  ingredientService,
  shareService,
  menuSetService,
  ingredientCategoryService,
};
