<template>
  <view class="container">
    <view class="page-title">{{ isEdit ? '编辑菜品' : '新增菜品' }}</view>

    <!-- 图片上传 -->
    <view class="form-section">
      <view class="form-title">菜品图片</view>
      <view class="image-upload-box" @tap="chooseDishImage">
        <view v-if="!formData.image" class="upload-placeholder">
          <image class="upload-icon" src="/static/icons/camera.png"></image>
          <text class="upload-text">添加菜品图片</text>
        </view>
        <view v-else class="upload-preview">
          <image class="preview-image" :src="formData.image" mode="aspectFill"></image>
          <text class="change-image-text">点击更换图片</text>
        </view>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="form-section">
      <view class="form-title">基本信息</view>

      <view class="form-row">
        <view class="form-col">
          <view class="form-label">菜品名称</view>
          <input type="text" v-model="formData.name" placeholder="请输入菜品名称" class="form-input" />
        </view>
      </view>

      <view class="form-row">
        <view class="form-col">
          <view class="form-label">菜品描述</view>
          <textarea v-model="formData.description" placeholder="请输入菜品描述" class="form-textarea"></textarea>
        </view>
      </view>

      <view class="form-row">
        <view class="form-col">
          <view class="form-label">分类</view>
          <view class="category-input-wrapper">
            <input type="text" v-model="categoryInputValue" placeholder="请输入或选择分类" class="category-input"
              @input="onCategoryInput" />
            <view class="category-tags">
              <view class="category-tag" v-for="category in categoryOptions" :key="category.id"
                :class="{ 'selected': formData.categoryId === category.id }" @tap="selectCategoryTag(category)">
                {{ category.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 食材列表 -->
    <view class="form-section">
      <view class="section-header">
        <view class="form-title">食材</view>
      </view>

      <!-- 已选食材列表 -->
      <view class="selected-ingredients" v-if="formData.ingredients.length > 0">
        <view class="section-subtitle">已选食材</view>
        <view class="ingredients-tags">
          <view class="ingredient-tag" v-for="(ingredient, index) in formData.ingredients" :key="index">
            <text>{{ ingredient }}</text>
            <text class="tag-delete" @tap.stop="removeIngredient(index)">×</text>
          </view>
        </view>
      </view>

      <!-- 可用食材列表 -->
      <view class="available-ingredients">
        <view class="section-subtitle">
          我的食材
          <view class="filter-wrapper">
            <input type="text" v-model="ingredientSearchKey" placeholder="搜索食材" class="filter-input" />
          </view>
        </view>

        <view class="empty-tip" v-if="filteredAvailableIngredients.length === 0">
          <text>暂无可用食材，请先在食材管理中添加</text>
        </view>

        <view class="ingredients-by-category" v-else>
          <view class="category-group" v-for="category in groupedIngredients" :key="category.name">
            <view class="category-name">{{ category.name }}</view>
            <view class="category-ingredients">
              <view class="available-ingredient-item" v-for="ingredient in category.items" :key="ingredient.id"
                :class="{ 'already-selected': formData.ingredients.includes(ingredient.name) }"
                @tap="toggleIngredient(ingredient.name)">
                <text>{{ ingredient.name }}</text>
                <text class="stock-status" :class="{ 'in-stock': ingredient.inStock }">
                  {{ ingredient.inStock ? '有货' : '缺货' }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 烹饪步骤 -->
    <view class="form-section">
      <view class="section-header">
        <view class="form-title">烹饪步骤</view>
        <view class="btn text" @tap="addStep">添加步骤</view>
      </view>

      <view class="steps-list">
        <view class="step-item" v-for="(step, index) in formData.steps" :key="index">
          <view class="step-number">{{ index + 1 }}</view>
          <view class="step-content">
            <textarea v-model="formData.steps[index]" placeholder="请输入烹饪步骤"
              class="form-textarea step-textarea"></textarea>
            <view class="delete-btn" @tap="removeStep(index)">
              <image src="/static/icons/trash.png" class="icon sm"></image>
            </view>
          </view>
        </view>

        <view v-if="formData.steps.length === 0" class="empty-tip">
          <text>暂无步骤，点击"添加步骤"添加</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="btn outline" @tap="goBack">取消</view>
      <view class="btn primary" @tap="saveDish">{{ isCreating ? '正在保存' : (isEdit ? '保存修改' : '添加菜品') }}</view>
    </view>
  </view>
</template>

<script>
import { dishService, ingredientService, menuSetService, categoryService } from '@/services/dataService.js';

export default {
  data() {
    return {
      isEdit: false, // 是否为编辑模式
      isCreating: false,
      dishId: null, // 当前编辑的菜品ID
      formData: {
        id: '',
        name: '', // 菜品名称
        image: '', // 菜品图片路径
        description: '', // 菜品描述
        categoryId: '', // 菜品分类ID
        ingredients: [], // 食材数组
        steps: [] // 烹饪步骤数组
      },
      categoryOptions: [], // 分类选项
      availableIngredients: [], // 可用食材列表
      ingredientSearchKey: '', // 食材搜索关键词
      categoryInputValue: '' // 分类输入框的值
    };
  },
  computed: {
    // 根据搜索关键词过滤食材
    filteredAvailableIngredients() {
      if (!this.ingredientSearchKey.trim()) {
        return this.availableIngredients;
      }

      return this.availableIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(this.ingredientSearchKey.toLowerCase())
      );
    },
    // 将食材按分类分组
    groupedIngredients() {
      // 根据分类分组食材
      const result = [];
      const map = {};

      this.filteredAvailableIngredients.forEach(item => {
        const category = item.category || '其他';
        if (!map[category]) {
          map[category] = {
            name: category,
            items: []
          };
          result.push(map[category]);
        }
        map[category].items.push(item);
      });

      // 对分类进行排序，"其他"分类放在最后
      result.sort((a, b) => {
        if (a.name === '其他') return 1;
        if (b.name === '其他') return -1;
        return a.name.localeCompare(b.name);
      });

      return result;
    }
  },
  onLoad(options) {
    // 加载所有可用食材
    this.loadAvailableIngredients();
    // 加载分类选项
    this.loadCategoryOptions();

    // 如果有ID参数，则为编辑模式
    if (options.id) {
      this.isEdit = true;
      this.dishId = options.id;
      this.loadDishData(options.id);
    }
  },
  methods: {
    // 加载分类选项
    loadCategoryOptions() {
      // 只加载当前菜单集下的分类
      this.categoryOptions = menuSetService.getCurrentMenuSetCategoriesByOrder();
    },

    // 加载菜品数据
    loadDishData(id) {
      const dish = dishService.getDishById(id);
      if (dish) {
        this.formData = {
          id: dish.id,
          name: dish.name,
          description: dish.description,
          image: dish.image,
          categoryId: dish.categoryId || '',
          ingredients: [...(dish.ingredients || [])],
          steps: [...(dish.steps || [])]
        };
        // 同步更新分类输入框的值
        this.categoryInputValue = this.getCategoryName(dish.categoryId || '');
      } else {
        uni.showToast({
          title: '菜品不存在',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },

    // 选择菜品图片
    chooseDishImage() {
      uni.chooseImage({
        count: 1, // 只选一张图片
        sizeType: ['compressed'], // 压缩图片
        sourceType: ['album', 'camera'], // 可从相册或相机选择
        success: (res) => {
          this.formData.image = res.tempFilePaths[0]; // 设置图片路径
        }
      });
    },

    // 加载可用食材
    loadAvailableIngredients() {
      this.availableIngredients = ingredientService.getAllIngredients();
    },

    // 获取分类名称
    getCategoryName(categoryId) {
      const category = categoryService.getCategoryById(categoryId);
      return category ? category.name : '';
    },

    // 切换食材（添加/移除）
    toggleIngredient(ingredientName) {
      const index = this.formData.ingredients.indexOf(ingredientName);
      if (index === -1) {
        // 如果食材不在列表中，添加它
        this.formData.ingredients.push(ingredientName);
      } else {
        // 如果食材已在列表中，移除它
        this.removeIngredient(index);
      }
    },

    // 移除食材
    removeIngredient(index) {
      this.formData.ingredients.splice(index, 1);
    },

    // 添加烹饪步骤
    addStep() {
      if (!this.formData.steps) {
        this.formData.steps = [];
      }
      this.formData.steps.push(''); // 添加空步骤
    },

    // 移除烹饪步骤
    removeStep(index) {
      this.formData.steps.splice(index, 1);
    },

    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 表单验证
    validateForm() {
      // 验证菜品名称
      if (!this.formData.name.trim()) {
        uni.showToast({
          title: '请输入菜品名称',
          icon: 'none'
        });
        return false;
      }

      // 验证菜品图片
      if (!this.formData.image) {
        uni.showToast({
          title: '请添加菜品图片',
          icon: 'none'
        });
        return false;
      }

      // 验证分类
      if (!this.categoryInputValue.trim()) {
        uni.showToast({
          title: '请输入或选择菜品分类',
          icon: 'none'
        });
        return false;
      }

      return true;
    },

    // 保存菜品
    saveDish() {
      if (!this.validateForm() || this.isCreating) return;

      this.isCreating = true;
      let result = false;
      let newDishId = null;

      // 处理分类
      let finalCategoryId = this.formData.categoryId;
      const currentMenuSetId = menuSetService.getCurrentMenuSetId();
      if (!finalCategoryId && this.categoryInputValue.trim()) {
        // 如果用户输入了新的分类名称，创建新分类
        const newCategory = categoryService.addCategory({
          name: this.categoryInputValue.trim(),
          description: '',
          color: '#FF6B6B'
        });
        if (newCategory) {
          finalCategoryId = newCategory.id;
          // 新分类加入当前菜单集
          menuSetService.addCategoryToMenuSet(currentMenuSetId, finalCategoryId);
        }
      }

      // 准备保存的数据
      const saveData = {
        ...this.formData,
        categoryId: finalCategoryId
      };

      if (this.isEdit) {
        // 更新现有菜品
        result = dishService.updateDish(saveData);
      } else {
        // 添加新菜品
        const newDish = dishService.addDish(saveData);
        if (newDish) {
          result = true;
          newDishId = newDish.id;

          // 将新菜品添加到当前菜单集
          const currentMenuSetId = menuSetService.getCurrentMenuSetId();
          menuSetService.addDishToMenuSet(currentMenuSetId, newDishId);
        }
      }

      this.isCreating = false;

      if (result) {
        uni.showToast({
          title: this.isEdit ? '修改成功' : '添加成功',
          icon: 'success'
        });

        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: this.isEdit ? '修改失败' : '添加失败',
          icon: 'none'
        });
      }
    },

    // 处理分类输入
    onCategoryInput(event) {
      this.categoryInputValue = event.detail.value;
      // 如果用户输入了内容，清空选中的分类ID
      if (this.categoryInputValue.trim()) {
        this.formData.categoryId = '';
      }
    },

    // 选择分类标签
    selectCategoryTag(category) {
      this.formData.categoryId = category.id;
      this.categoryInputValue = category.name;
    }
  }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.container {
  padding-bottom: 120rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-xl;
}

.form-section {
  margin-bottom: $spacing-xl;
  background-color: $card-color;
  border-radius: $card-radius;
  padding: $card-padding;
  box-shadow: $shadow-sm;
}

.form-title {
  font-size: 30rpx;
  font-weight: 500;
  color: $text-color;
  margin-bottom: $spacing-md;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.image-upload-box {
  margin-bottom: $spacing-lg;
}

.upload-placeholder,
.upload-preview {
  height: 400rpx;
  background-color: $card-color;
  border-radius: $card-radius;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 2rpx dashed $border-color;
  @include transition-fast;

  &:active {
    background-color: darken($card-color, 2%);
  }
}

.upload-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: $spacing-md;
  opacity: 0.6;
}

.upload-text {
  font-size: 28rpx;
  color: $text-color-light;
}

.preview-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}

.change-image-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  padding: $spacing-md;
  font-size: 28rpx;
  text-align: center;
}

.form-input,
.form-textarea {
  background-color: #F9FAFB;
  border-radius: $input-radius;
  padding: $spacing-md;
  width: 100%;
  box-sizing: border-box;
  font-size: 28rpx;
  color: $text-color;
  border: 2rpx solid transparent;
  @include transition-fast;

  &:focus {
    border-color: $primary-color;
    background-color: white;
  }
}

.form-input {
  height: 88rpx;
}

.form-textarea {
  height: 180rpx;
  padding: $spacing-md;
}

.form-row {
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }

  .form-col {
    .form-label {
      font-size: 26rpx;
      color: $text-color-secondary;
      margin-bottom: $spacing-xs;
    }
  }
}

.selected-ingredients {
  margin-bottom: $spacing-lg;
}

.ingredients-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.ingredient-tag {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  border-radius: 100rpx;
  font-size: 26rpx;
  background-color: $primary-light;
  color: $primary-color;
  margin-right: 8rpx;
  margin-bottom: 8rpx;

  .tag-delete {
    margin-left: 8rpx;
    width: 32rpx;
    height: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    color: white;
    font-size: 20rpx;
    line-height: 1;
  }
}

.available-ingredients {
  margin-bottom: $spacing-lg;
}

.ingredients-by-category {
  max-height: 500rpx;
  overflow-y: auto;
}

.category-group {
  margin-bottom: $spacing-md;

  &:last-child {
    margin-bottom: 0;
  }
}

.category-name {
  font-size: 26rpx;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-xs;
  padding-left: $spacing-xs;
  border-left: 4rpx solid $primary-color;
}

.category-ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.available-ingredient-item {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  background-color: #F9FAFB;
  color: $text-color;
  border: 2rpx solid $border-color;
  margin-right: 8rpx;
  margin-bottom: 8rpx;
  display: flex;
  align-items: center;
  @include transition-fast;

  &:active {
    transform: scale(0.95);
  }

  &.already-selected {
    background-color: $primary-light;
    color: $primary-color;
    border-color: $primary-color;
  }

  .stock-status {
    font-size: 22rpx;
    padding: 2rpx 8rpx;
    border-radius: 4rpx;
    margin-left: 8rpx;
    background-color: #FCE8E8;
    color: $error-color;

    &.in-stock {
      background-color: #E6F7EF;
      color: $success-color;
    }
  }
}

.empty-tip {
  padding: $spacing-lg;
  text-align: center;
  color: $text-color-light;
  font-size: 28rpx;
  background-color: #F9FAFB;
  border-radius: $input-radius;
}

.ingredients-list,
.steps-list {
  margin-bottom: $spacing-lg;
}

.step-item {
  display: flex;
  margin-bottom: $spacing-lg;

  .step-number {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background-color: $primary-light;
    color: $primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-weight: 500;
    margin-right: $spacing-md;
    flex-shrink: 0;
    margin-top: 8rpx;
  }

  .step-content {
    flex: 1;
    position: relative;

    .step-textarea {
      padding-right: 64rpx;
    }

    .delete-btn {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.empty-tip {
  padding: $spacing-lg 0;
  text-align: center;
  color: $text-color-light;
  font-size: 28rpx;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: $spacing-md $container-padding;
  background-color: $card-color;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 10;

  .btn {
    flex: 1;
    margin: 0 $spacing-sm;
  }
}

.category-input-wrapper {
  position: relative;
}

.category-input {
  width: 100%;
  padding: $spacing-md;
  border: 2rpx solid $border-color;
  border-radius: $input-radius;
  background-color: $card-color;
  font-size: 28rpx;
  color: $text-color;
  @include transition-fast;

  &:focus {
    border-color: $primary-color;
    background-color: white;
  }
}

.category-tags {
  margin-top: $spacing-sm;
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.category-tag {
  padding: 12rpx 20rpx;
  border-radius: 100rpx;
  font-size: 26rpx;
  background-color: #F9FAFB;
  color: $text-color;
  border: 2rpx solid $border-color;
  @include transition-fast;

  &:active {
    transform: scale(0.95);
  }

  &.selected {
    background-color: $primary-light;
    color: $primary-color;
    border-color: $primary-color;
  }
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  background-color: #F9FAFB;
  border-radius: $input-radius;
  padding: $spacing-md;
  min-height: 88rpx;
  align-items: center;
  border: 2rpx solid transparent;

  &:focus-within {
    border-color: $primary-color;
    background-color: white;
  }

  .tag {
    display: flex;
    align-items: center;

    .tag-delete {
      margin-left: 8rpx;
      width: 28rpx;
      height: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      color: white;
      font-size: 20rpx;
      line-height: 1;
    }
  }

  .tag-input {
    flex: 1;
    min-width: 120rpx;
    height: 60rpx;
    border: none;
    font-size: 28rpx;
    background: transparent;
  }
}
</style>
