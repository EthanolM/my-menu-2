<template>
    <view class="container">
        <view class="page-title">编辑菜单集</view>

        <view class="form-section">
            <view class="form-group">
                <view class="form-label required">菜单集名称</view>
                <input type="text" v-model="menuSet.name" placeholder="请输入菜单集名称" class="form-input" maxlength="20" />
            </view>

            <view class="form-tip">
                您可以为这个菜单集添加专属的菜品和食材。
            </view>
        </view>

        <!-- 菜品管理 -->
        <view class="form-section">
            <view class="section-header">
                <view class="section-title">菜品管理</view>
                <view class="btn text" @tap="showDishSelector">添加菜品</view>
            </view>

            <view class="dish-list" v-if="menuDishes.length > 0">
                <view class="dish-item" v-for="dish in menuDishes" :key="dish.id">
                    <image class="dish-thumb" :src="dish.image" mode="aspectFill"></image>
                    <view class="dish-info">
                        <text class="dish-name">{{ dish.name }}</text>
                        <text class="dish-desc">{{ dish.description }}</text>
                    </view>
                    <view class="remove-btn" @tap="removeDish(dish.id)">
                        <image class="remove-icon" src="/static/icons/delete.png"></image>
                    </view>
                </view>
            </view>

            <view class="empty-tip" v-else>
                <text>暂无菜品，点击"添加菜品"添加</text>
            </view>
        </view>

        <!-- 食材管理 -->
        <view class="form-section">
            <view class="section-header">
                <view class="section-title">食材管理</view>
                <view class="btn text" @tap="showIngredientSelector">添加食材</view>
            </view>

            <view class="ingredient-list" v-if="menuIngredients.length > 0">
                <view class="ingredient-item" v-for="ingredient in menuIngredients" :key="ingredient.id">
                    <view class="ingredient-info">
                        <text class="ingredient-name">{{ ingredient.name }}</text>
                        <text class="ingredient-category">{{ ingredient.category }}</text>
                    </view>
                    <view class="remove-btn" @tap="removeIngredient(ingredient.id)">
                        <image class="remove-icon" src="/static/icons/delete.png"></image>
                    </view>
                </view>
            </view>

            <view class="empty-tip" v-else>
                <text>暂无食材，点击"添加食材"添加</text>
            </view>
        </view>

        <!-- 底部操作栏 -->
        <view class="action-bar">
            <view class="btn outline" @tap="goBack">取消</view>
            <view class="btn primary" @tap="saveMenuSet">保存修改</view>
        </view>

        <!-- 菜品选择器弹窗 -->
        <view class="selector-panel" v-if="showDishPanel">
            <view class="panel-header">
                <text class="panel-title">选择菜品</text>
                <view class="panel-close" @tap="hideDishSelector">
                    <image class="close-icon" src="/static/icons/close.png"></image>
                </view>
            </view>

            <view class="selector-body">
                <view class="search-box">
                    <input type="text" v-model="dishSearchKey" placeholder="搜索菜品" class="search-input" />
                </view>

                <view class="selector-list">
                    <view class="selector-item" v-for="dish in filteredAllDishes" :key="dish.id"
                        @tap="toggleSelectDish(dish.id)">
                        <view class="selector-checkbox" :class="{ 'checked': isInMenuDishes(dish.id) }">
                            <image class="check-icon" src="/static/icons/check.png" v-if="isInMenuDishes(dish.id)">
                            </image>
                        </view>
                        <image class="selector-thumb" :src="dish.image" mode="aspectFill"></image>
                        <text class="selector-name">{{ dish.name }}</text>
                    </view>
                </view>
            </view>

            <view class="panel-footer">
                <view class="btn primary" @tap="confirmDishSelection">确定</view>
            </view>
        </view>

        <!-- 食材选择器弹窗 -->
        <view class="selector-panel" v-if="showIngredientPanel">
            <view class="panel-header">
                <text class="panel-title">选择食材</text>
                <view class="panel-close" @tap="hideIngredientSelector">
                    <image class="close-icon" src="/static/icons/close.png"></image>
                </view>
            </view>

            <view class="selector-body">
                <view class="search-box">
                    <input type="text" v-model="ingredientSearchKey" placeholder="搜索食材" class="search-input" />
                </view>

                <view class="selector-list">
                    <view class="selector-item" v-for="ingredient in filteredAllIngredients" :key="ingredient.id"
                        @tap="toggleSelectIngredient(ingredient.id)">
                        <view class="selector-checkbox" :class="{ 'checked': isInMenuIngredients(ingredient.id) }">
                            <image class="check-icon" src="/static/icons/check.png"
                                v-if="isInMenuIngredients(ingredient.id)"></image>
                        </view>
                        <text class="selector-name">{{ ingredient.name }}</text>
                        <text class="selector-tag">{{ ingredient.category }}</text>
                    </view>
                </view>
            </view>

            <view class="panel-footer">
                <view class="btn primary" @tap="confirmIngredientSelection">确定</view>
            </view>
        </view>

        <!-- 遮罩层 -->
        <view class="mask" v-if="showDishPanel || showIngredientPanel" @tap="hideAllSelectors"></view>
    </view>
</template>

<script>
import { menuSetService, dishService, ingredientService } from '@/services/dataService.js';

export default {
    data() {
        return {
            menuSetId: '',
            menuSet: {
                id: '',
                name: '',
                dishes: [],
                ingredients: [],
                isDefault: false
            },
            allDishes: [],
            allIngredients: [],
            menuDishes: [], // 当前菜单中的菜品详情
            menuIngredients: [], // 当前菜单中的食材详情
            showDishPanel: false,
            showIngredientPanel: false,
            selectedDishIds: [], // 临时存储选中的菜品ID
            selectedIngredientIds: [], // 临时存储选中的食材ID
            dishSearchKey: '',
            ingredientSearchKey: ''
        };
    },
    computed: {
        // 过滤全部菜品
        filteredAllDishes() {
            if (!this.dishSearchKey.trim()) {
                return this.allDishes;
            }
            return this.allDishes.filter(dish =>
                dish.name.toLowerCase().includes(this.dishSearchKey.toLowerCase()) ||
                (dish.description && dish.description.toLowerCase().includes(this.dishSearchKey.toLowerCase()))
            );
        },
        // 过滤全部食材
        filteredAllIngredients() {
            if (!this.ingredientSearchKey.trim()) {
                return this.allIngredients;
            }
            return this.allIngredients.filter(ingredient =>
                ingredient.name.toLowerCase().includes(this.ingredientSearchKey.toLowerCase()) ||
                (ingredient.category && ingredient.category.toLowerCase().includes(this.ingredientSearchKey.toLowerCase()))
            );
        }
    },
    onLoad(options) {
        if (options.id) {
            this.menuSetId = options.id;
            this.loadMenuSet();
            this.loadAllDishes();
            this.loadAllIngredients();
            this.loadMenuItems();
        } else {
            uni.showToast({
                title: '菜单集ID不存在',
                icon: 'none'
            });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        }
    },
    methods: {
        // 加载菜单集数据
        loadMenuSet() {
            const menuSet = menuSetService.getMenuSetById(this.menuSetId);
            if (menuSet) {
                // 深拷贝防止直接修改原对象
                this.menuSet = JSON.parse(JSON.stringify(menuSet));
                // 初始化选中的菜品和食材ID
                this.selectedDishIds = [...this.menuSet.dishes];
                this.selectedIngredientIds = [...this.menuSet.ingredients];
            } else {
                uni.showToast({
                    title: '菜单集不存在',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            }
        },

        // 加载所有菜品
        loadAllDishes() {
            this.allDishes = dishService.getAllDishes();
        },

        // 加载所有食材
        loadAllIngredients() {
            this.allIngredients = ingredientService.getAllIngredients();
        },

        // 加载菜单中的菜品和食材详情
        loadMenuItems() {
            // 加载菜单中的菜品详情
            if (this.menuSet.dishes && this.menuSet.dishes.length > 0) {
                this.menuDishes = this.allDishes.filter(dish => this.menuSet.dishes.includes(dish.id));
            } else {
                this.menuDishes = [];
            }

            // 加载菜单中的食材详情
            if (this.menuSet.ingredients && this.menuSet.ingredients.length > 0) {
                this.menuIngredients = this.allIngredients.filter(ingredient =>
                    this.menuSet.ingredients.includes(ingredient.id)
                );
            } else {
                this.menuIngredients = [];
            }
        },

        // 返回上一页
        goBack() {
            uni.navigateBack();
        },

        // 保存菜单集
        saveMenuSet() {
            if (!this.menuSet.name.trim()) {
                uni.showToast({
                    title: '请输入菜单集名称',
                    icon: 'none'
                });
                return;
            }

            // 更新菜单集
            const result = menuSetService.updateMenuSet(this.menuSet);

            if (result) {
                uni.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            } else {
                uni.showToast({
                    title: '保存失败',
                    icon: 'none'
                });
            }
        },

        // 显示菜品选择器
        showDishSelector() {
            this.showDishPanel = true;
        },

        // 隐藏菜品选择器
        hideDishSelector() {
            this.showDishPanel = false;
            this.dishSearchKey = '';
        },

        // 显示食材选择器
        showIngredientSelector() {
            this.showIngredientPanel = true;
        },

        // 隐藏食材选择器
        hideIngredientSelector() {
            this.showIngredientPanel = false;
            this.ingredientSearchKey = '';
        },

        // 隐藏所有选择器
        hideAllSelectors() {
            this.showDishPanel = false;
            this.showIngredientPanel = false;
            this.dishSearchKey = '';
            this.ingredientSearchKey = '';
        },

        // 切换选择菜品
        toggleSelectDish(dishId) {
            if (this.isInMenuDishes(dishId)) {
                this.selectedDishIds = this.selectedDishIds.filter(id => id !== dishId);
            } else {
                this.selectedDishIds.push(dishId);
            }
        },

        // 检查菜品是否已在菜单中
        isInMenuDishes(dishId) {
            return this.selectedDishIds.includes(dishId);
        },

        // 确认菜品选择
        confirmDishSelection() {
            this.menuSet.dishes = [...this.selectedDishIds];
            this.loadMenuItems(); // 重新加载菜单项
            this.hideDishSelector();
        },

        // 移除菜品
        removeDish(dishId) {
            this.menuSet.dishes = this.menuSet.dishes.filter(id => id !== dishId);
            this.selectedDishIds = this.selectedDishIds.filter(id => id !== dishId);
            this.loadMenuItems(); // 重新加载菜单项
        },

        // 切换选择食材
        toggleSelectIngredient(ingredientId) {
            if (this.isInMenuIngredients(ingredientId)) {
                this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredientId);
            } else {
                this.selectedIngredientIds.push(ingredientId);
            }
        },

        // 检查食材是否已在菜单中
        isInMenuIngredients(ingredientId) {
            return this.selectedIngredientIds.includes(ingredientId);
        },

        // 确认食材选择
        confirmIngredientSelection() {
            this.menuSet.ingredients = [...this.selectedIngredientIds];
            this.loadMenuItems(); // 重新加载菜单项
            this.hideIngredientSelector();
        },

        // 移除食材
        removeIngredient(ingredientId) {
            this.menuSet.ingredients = this.menuSet.ingredients.filter(id => id !== ingredientId);
            this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredientId);
            this.loadMenuItems(); // 重新加载菜单项
        }
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.page-title {
    font-size: 36rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-xl;
}

.form-section {
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $card-padding;
    box-shadow: $shadow-sm;
    margin-bottom: $spacing-xl;
}

.form-group {
    margin-bottom: $spacing-lg;
}

.form-label {
    font-size: 28rpx;
    color: $text-color;
    font-weight: 500;
    margin-bottom: 12rpx;

    &.required:after {
        content: '*';
        color: $error-color;
        margin-left: 4rpx;
    }
}

.form-input {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 20rpx;
    font-size: 28rpx;
    width: 100%;
    box-sizing: border-box;
    border: 2rpx solid $border-color;
    height: 88rpx;

    &:focus {
        border-color: $primary-color;
        background-color: white;
    }
}

.form-tip {
    font-size: 26rpx;
    color: $text-color-light;
    line-height: 1.5;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-color;
}

.dish-list,
.ingredient-list {
    margin-top: $spacing-md;
}

.dish-item,
.ingredient-item {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    background-color: #F9FAFB;
    border-radius: $input-radius;
    margin-bottom: $spacing-sm;
    border: 2rpx solid transparent;
    @include transition-fast;

    &:active {
        border-color: $primary-color;
    }
}

.dish-thumb {
    width: 90rpx;
    height: 90rpx;
    border-radius: $input-radius;
    margin-right: $spacing-md;
    flex-shrink: 0;
    background-color: $divider-color;
}

.dish-info,
.ingredient-info {
    flex: 1;
    overflow: hidden;
}

.dish-name,
.ingredient-name {
    font-size: 28rpx;
    font-weight: 500;
    color: $text-color;
    @include ellipsis;
}

.dish-desc {
    font-size: 24rpx;
    color: $text-color-light;
    @include ellipsis;
    margin-top: 4rpx;
}

.ingredient-category {
    font-size: 24rpx;
    color: $text-color-light;
    margin-top: 4rpx;
}

.remove-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    background-color: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: $spacing-md;
    @include transition-fast;

    &:active {
        transform: scale(0.9);
        opacity: 0.8;
    }
}

.remove-icon {
    width: 32rpx;
    height: 32rpx;
    opacity: 0.7;
}

.empty-tip {
    padding: $spacing-lg;
    text-align: center;
    color: $text-color-light;
    font-size: 28rpx;
    background-color: #F9FAFB;
    border-radius: $input-radius;
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

/* 选择器弹窗样式 */
.selector-panel {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    max-height: 80vh;
    background-color: $card-color;
    z-index: 100;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid $divider-color;
}

.panel-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
}

.panel-close {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:active {
        background-color: $divider-color;
    }
}

.close-icon {
    width: 36rpx;
    height: 36rpx;
    opacity: 0.5;
}

.selector-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 30rpx;
}

.search-box {
    padding: 20rpx 0;
    position: sticky;
    top: 0;
    background-color: $card-color;
    z-index: 1;
}

.search-input {
    background-color: #F9FAFB;
    border-radius: 100rpx;
    padding: 16rpx 24rpx;
    font-size: 28rpx;
    width: 100%;
    box-sizing: border-box;
    border: 2rpx solid $border-color;
}

.selector-list {
    padding-bottom: 120rpx;
}

.selector-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 2rpx solid $divider-color;

    &:last-child {
        border-bottom: none;
    }
}

.selector-checkbox {
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    border: 2rpx solid $border-color;
    margin-right: $spacing-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.checked {
        background-color: $primary-color;
        border-color: $primary-color;
    }
}

.check-icon {
    width: 28rpx;
    height: 28rpx;
}

.selector-thumb {
    width: 80rpx;
    height: 80rpx;
    border-radius: $input-radius;
    margin-right: $spacing-md;
    flex-shrink: $spacing-md;
    background-color: $divider-color;
}

.selector-name {
    flex: 1;
    font-size: 28rpx;
    color: $text-color;
}

.selector-tag {
    font-size: 24rpx;
    color: $text-color-light;
    background-color: $divider-color;
    padding: 4rpx 12rpx;
    border-radius: 100rpx;
    margin-left: $spacing-sm;
}

.panel-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    border-top: 2rpx solid $divider-color;
    background-color: $card-color;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
}
</style>
