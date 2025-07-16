<template>
  <view class="container">
    <template v-if="dish">
      <!-- 菜品顶部区域 -->
      <view class="dish-header">
        <image class="dish-image" :src="dish.image" mode="aspectFill"></image>

        <view class="dish-info-box">
          <view class="dish-title-row">
            <text class="dish-name">{{ dish.name }}</text>
          </view>

          <view class="dish-description">
            {{ dish.description }}
          </view>

          <view class="dish-category" v-if="dish.categoryId">
            <text class="category-label">分类：</text>
            <text class="category-tag">{{ getCategoryName(dish.categoryId) }}</text>
          </view>
        </view>
      </view>

      <!-- 原材料区域 - 添加可用性显示 -->
      <view class="ingredients-card" v-if="dish.ingredients && dish.ingredients.length > 0">
        <view class="section-title">食材</view>

        <!-- 添加食材可用性进度条 - 更新术语 -->
        <view class="ingredients-progress" v-if="ingredientStats.total > 0">
          <view class="progress-header">
            <text class="progress-title">食材库存</text>
            <text class="progress-percentage" :class="getProgressClass(ingredientStats.percentage)">
              {{ ingredientStats.percentage }}%
            </text>
          </view>
          <view class="progress-container">
            <view class="progress-bar">
              <view class="progress-value" :class="getProgressClass(ingredientStats.percentage)" :style="{
                width: ingredientStats.percentage + '%'
              }"></view>
            </view>
          </view>
          <view class="progress-text">
            <text>{{ ingredientStats.available }}/{{ ingredientStats.total }} 种食材在库</text>
          </view>
        </view>

        <view class="ingredients-list">
          <view class="ingredient-item" v-for="(ingredient, index) in dish.ingredients" :key="index">
            <text class="ingredient-name">{{ ingredient }}</text>
            <text class="ingredient-status" :class="{ 'in-stock': isIngredientInStock(ingredient) }">
              {{ isIngredientInStock(ingredient) ? '在库' : '缺货' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 烹饪步骤 -->
      <view class="steps-card" v-if="dish.steps && dish.steps.length > 0">
        <view class="section-title">烹饪步骤</view>
        <view class="steps-list">
          <view class="step-item" v-for="(step, index) in dish.steps" :key="index">
            <view class="step-number">{{ index + 1 }}</view>
            <text class="step-text">{{ step }}</text>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="action-bar">
        <button class="action-btn delete-btn" @tap="showDeleteConfirm">删除菜品</button>
        <button class="action-btn edit-btn" @tap="navigateToDishEdit">编辑菜品</button>
      </view>
    </template>

    <!-- 加载中 -->
    <view v-else class="loading-box">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
import { dishService, ingredientService, categoryService } from '@/services/dataService.js';

export default {
  data() {
    return {
      dish: null, // 当前菜品数据
      availableIngredients: [], // 当前可用的食材列表
      dishId: null, // 菜品ID，用于onShow中重新加载数据
      ingredientStats: { // 添加食材统计信息
        available: 0,
        total: 0,
        percentage: 0
      }
    };
  },
  onLoad(options) {
    if (options.id) {
      this.dishId = options.id; // 保存菜品ID以便后续使用
      this.loadDish(options.id); // 加载菜品详情
      this.loadAvailableIngredients(); // 加载可用食材
    } else {
      // 没有菜品ID则提示错误
      uni.showToast({
        title: '菜品信息不存在',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  // 添加onShow方法重新加载数据，确保从编辑页面返回时数据是最新的
  onShow() {
    // 如果已经有dishId，重新加载菜品数据
    if (this.dishId) {
      this.loadDish(this.dishId);
      this.loadAvailableIngredients();
    }
  },
  methods: {
    // 加载菜品详情
    loadDish(id) {
      this.dish = dishService.getDishById(id);
      if (!this.dish) {
        uni.showToast({
          title: '菜品不存在',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        // 计算食材统计信息
        this.calculateIngredientStats();
      }
    },

    // 加载可用食材列表
    loadAvailableIngredients() {
      this.availableIngredients = ingredientService.getInStockIngredients().map(ing => ing.name);
      // 重新计算食材统计
      if (this.dish) {
        this.calculateIngredientStats();
      }
    },

    // 计算食材统计信息
    calculateIngredientStats() {
      if (!this.dish || !this.dish.ingredients) {
        this.ingredientStats = { available: 0, total: 0, percentage: 0 };
        return;
      }

      const total = this.dish.ingredients.length;
      const available = this.dish.ingredients.filter(ing =>
        this.availableIngredients.includes(ing)
      ).length;

      this.ingredientStats = {
        available,
        total,
        percentage: total > 0 ? Math.round((available / total) * 100) : 0
      };
    },

    // 获取进度条样式类
    getProgressClass(percentage) {
      if (percentage >= 70) return 'high';
      if (percentage >= 40) return 'medium';
      return 'low';
    },

    // 检查食材是否在库存中
    isIngredientInStock(ingredient) {
      return this.availableIngredients.includes(ingredient);
    },

    // 获取分类名称
    getCategoryName(categoryId) {
      const category = categoryService.getCategoryById(categoryId);
      return category ? category.name : '';
    },

    // 导航到菜品编辑页面
    navigateToDishEdit() {
      uni.navigateTo({
        url: `/pages/dish/edit?id=${this.dish.id}`
      });
    },

    // 显示删除确认对话框
    showDeleteConfirm() {
      uni.showModal({
        title: '删除确认',
        content: `确定要删除"${this.dish.name}"吗？`,
        confirmColor: '#FF3B30',
        success: (res) => {
          if (res.confirm) {
            this.deleteDish();
          }
        }
      });
    },

    // 删除菜品
    deleteDish() {
      const result = dishService.deleteDish(this.dish.id);
      if (result) {
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    },

    // 分享菜品
    shareDish() {
      uni.navigateTo({
        url: `/pages/share/index?dishId=${this.dish.id}`
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.container {
  padding-bottom: 120rpx;
}

.dish-header {
  border-radius: $card-radius;
  background-color: $card-color;
  overflow: hidden;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-sm;
  position: relative;
}

.dish-image {
  width: 100%;
  height: 500rpx;
  background-color: $divider-color;
}

.dish-info-box {
  padding: $card-padding;
}

.dish-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.dish-name {
  font-size: 40rpx;
  font-weight: 600;
  color: $text-color;
  line-height: 1.4;
  flex: 1;
}

.dish-category {
  display: flex;
  align-items: center;
  margin-top: $spacing-sm;

  .category-label {
    font-size: 28rpx;
    color: $text-color-secondary;
    margin-right: $spacing-xs;
  }

  .category-tag {
    font-size: 28rpx;
    color: $primary-color;
    font-weight: 500;
  }
}

.dish-description {
  font-size: 28rpx;
  color: $text-color-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-md;
  margin-top: $spacing-xl;
  position: relative;
  padding-left: $spacing-md;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8rpx;
    width: 8rpx;
    height: 32rpx;
    background-color: $primary-color;
    border-radius: 4rpx;
  }
}

.ingredients-card {
  background-color: $card-color;
  border-radius: $card-radius;
  padding: $card-padding;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-sm;
}

.ingredients-progress {
  margin-bottom: $spacing-xl;
  padding: $spacing-md 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.progress-title {
  font-size: 26rpx;
  font-weight: 500;
  color: $text-color;
}

.progress-percentage {
  font-size: 28rpx;
  font-weight: 600;

  &.high {
    color: #10B981;
  }

  &.medium {
    color: #F59E0B;
  }

  &.low {
    color: #EF4444;
  }
}

.progress-container {
  position: relative;
  padding: 4rpx 0;
}

.progress-bar {
  height: 8rpx;
  background-color: rgba(#E2E8F0, 0.6);
  border-radius: 20rpx;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.progress-value {
  height: 100%;
  border-radius: 20rpx;
  transform-origin: left center;
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease;
  box-shadow: 0 0 4rpx rgba(0, 0, 0, 0.05);

  &.high {
    background: linear-gradient(to right, #10B981, #0EA5E9);
  }

  &.medium {
    background: linear-gradient(to right, #F59E0B, #F97316);
  }

  &.low {
    background: linear-gradient(to right, #EF4444, #F43F5E);
  }
}

.progress-text {
  display: flex;
  justify-content: flex-start;
  font-size: 24rpx;
  color: $text-color-secondary;
  margin-top: $spacing-xs;
  opacity: 0.85;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: $spacing-md 0;
  border-bottom: 2rpx solid $divider-color;
  @include transition-fast;

  &:active {
    background-color: rgba($divider-color, 0.5);
  }

  &:last-child {
    border-bottom: none;
  }

  .ingredient-name {
    font-size: 28rpx;
    color: $text-color;
  }

  .ingredient-amount {
    font-size: 28rpx;
    color: $text-color-light;
  }
}

.steps-card {
  background-color: $card-color;
  border-radius: $card-radius;
  padding: $card-padding;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-sm;
}

.step-item {
  display: flex;
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }

  .step-number {
    width: 60rpx;
    height: 60rpx;
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
  }

  .step-content {
    flex: 1;

    .step-image {
      width: 100%;
      height: 240rpx;
      border-radius: $input-radius;
      margin-bottom: $spacing-sm;
      background-color: $divider-color;
    }

    .step-text {
      font-size: 28rpx;
      color: $text-color;
      line-height: 1.6;
    }
  }
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

  .action-btn {
    flex: 1;
    margin: 0 $spacing-sm;
    height: 88rpx;
    border-radius: $btn-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 500;
    @include transition-fast;

    &.edit-btn {
      background-color: $primary-color;
      color: white;

      &:active {
        transform: scale(0.95);
        background-color: darken($primary-color, 5%);
      }
    }

    &.delete-btn {
      background-color: transparent;
      border: 2rpx solid $error-color;
      color: $error-color;

      &:active {
        transform: scale(0.95);
        background-color: rgba($error-color, 0.05);
      }
    }
  }
}
</style>
