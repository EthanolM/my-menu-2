<template>
    <view class="container" :style="{ height: getContainerHeight() }">
        <!-- 使用Header组件 -->
        <Header :page-type="'ingredients'" :safe-area-insets="safeAreaInsets" :menu-sets="menuSets"
            :current-menu-set="currentMenuSet" :is-edit-mode="isEditMode" @toggle-filter-panel="toggleFilterPanel"
            @menu-set-changed="onMenuSetChanged" @hide-all-panels="hideAllPanels" @toggle-edit-mode="toggleEditMode" />

        <!-- 编辑模式提示 -->
        <view class="edit-tip" v-if="isEditMode">
            <text class="tip-text">长按分类可拖拽调整顺序，点击删除按钮可删除分类及其食材</text>
        </view>

        <!-- 筛选面板 -->
        <view class="filter-panel" :class="{ 'filter-panel-show': showFilterPanel }">
            <view class="filter-section">
                <view class="filter-title">分类</view>
                <view class="tags-container">
                    <view v-for="(category, index) in allCategories" :key="index" class="tag"
                        :class="{ 'active': selectedCategories.includes(category.id) }"
                        @click="toggleCategory(category)">
                        {{ category.name }}
                    </view>
                </view>
            </view>

            <view class="filter-actions">
                <view class="btn text" @click="resetFilter">重置</view>
                <view class="btn primary" @click="applyFilter">应用筛选</view>
            </view>
        </view>

        <!-- 主内容区域 - 左右分栏布局 -->
        <view class="main-content">
            <!-- 左侧分类导航 -->
            <CategoryNav :category-order="allCategories.map(c => c.name)" :current-category="currentCategoryName"
                :is-edit-mode="isEditMode" @select-category="onSelectCategory" @delete-category="onDeleteCategory"
                @toggle-edit-mode="toggleEditMode" @update-category-order="onUpdateCategoryOrder" />

            <!-- 右侧食材列表 -->
            <scroll-view class="ingredient-list" scroll-y="true" :scroll-into-view="toView"
                scroll-with-animation="true">
                <!-- 多选删除模式头部 -->
                <view class="multi-select-header" v-if="isEditMode">
                    <view class="multi-select-info">
                        <text class="multi-select-title">多选删除食材</text>
                        <text class="selected-count">已选择 {{ selectedIngredients.length }} 种食材</text>
                    </view>
                    <view class="multi-select-actions">
                        <view class="action-btn" @tap="selectAllIngredients">
                            <text class="action-text">{{ isAllSelected ? '取消全选' : '全选' }}</text>
                        </view>
                        <view class="action-btn delete" @tap="deleteSelectedIngredients"
                            :class="{ 'disabled': selectedIngredients.length === 0 }">
                            <text class="action-text">删除选中</text>
                        </view>
                    </view>
                </view>

                <!-- 食材列表 -->
                <view v-if="filteredIngredients.length > 0">
                    <view v-for="category in categorizedIngredients" :key="category.id" class="category-section"
                        :id="encodeId(category.name)">
                        <view class="category-header">
                            <view class="category-info">
                                <text class="category-name">{{ category.name }}</text>
                            </view>
                            <text class="category-count">{{ category.items.length }}种</text>
                        </view>

                        <view class="ingredient-list-horizontal">
                            <view v-for="ingredient in category.items" :key="ingredient.id"
                                class="ingredient-card-horizontal"
                                @tap="isEditMode ? toggleIngredientSelection(ingredient.id) : null"
                                :class="{ 'selected': selectedIngredients.includes(ingredient.id) }">
                                <view class="ingredient-info-horizontal">
                                    <text class="ingredient-name-horizontal">{{ ingredient.name }}</text>
                                </view>
                                <view class="ingredient-actions">
                                    <!-- 编辑模式下的勾选框 -->
                                    <view class="ingredient-checkbox" v-if="isEditMode">
                                        <text class="checkbox-icon">{{ selectedIngredients.includes(ingredient.id) ? '✓'
                                            : '' }}</text>
                                    </view>
                                    <!-- 非编辑模式下的操作按钮 -->
                                    <template v-else>
                                        <switch :checked="ingredient.inStock"
                                            @change="toggleIngredientStock(ingredient.id)" color="#5A67D8"
                                            style="transform:scale(0.8)" />
                                        <view class="action-btn" @tap="editIngredient(ingredient)">
                                            <image class="action-icon" src="/static/icons/edit.png"></image>
                                        </view>
                                        <view class="action-btn"
                                            @tap="deleteIngredient(ingredient.id, ingredient.name)">
                                            <image class="action-icon" src="/static/icons/delete.png"></image>
                                        </view>
                                    </template>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 空状态 -->
                <view v-else class="empty-state">
                    <image class="empty-image" src="/static/icons/empty-ingredient.png"></image>
                    <text class="empty-text">暂无食材，快去添加吧！</text>
                </view>
            </scroll-view>
        </view>

        <!-- 添加/编辑食材浮窗 -->
        <view class="ingredient-panel" :class="{ 'panel-show': showPanel }">
            <view class="panel-header">
                <text class="panel-title">{{ isEdit ? '编辑食材' : '添加食材' }}</text>
                <view class="panel-close" @tap="hidePanel">
                    <image class="close-icon" src="/static/icons/close.png"></image>
                </view>
            </view>

            <view class="panel-content">
                <view class="form-group">
                    <view class="form-label required">食材名称</view>
                    <input class="form-input" type="text" v-model="ingredientForm.name" placeholder="请输入食材名称"
                        maxlength="20" />
                </view>

                <view class="form-group">
                    <view class="form-label required">分类</view>
                    <!-- 替换原来的picker组件为自定义下拉选择 -->
                    <view class="custom-picker" @tap="showCategorySelector">
                        <view class="picker-text" :class="{ 'picker-placeholder': !ingredientForm.categoryId }">
                            {{(categoryOptions.find(opt => opt.id === ingredientForm.categoryId) || {}).name || '请选择分类'
                            }}
                            <image class="icon-arrow" src="/static/icons/arrow-down.png"></image>
                        </view>
                    </view>

                    <!-- 自定义分类选择器 -->
                    <view class="category-selector" v-if="showCategorySelect">
                        <view class="category-option" v-for="(option, index) in categoryOptions" :key="option.id"
                            @tap="selectCategory(index)" :class="{ 'selected': categoryIndex === index }">
                            {{ option.name }}
                        </view>
                    </view>
                </view>

                <view class="form-group switch-group">
                    <view class="form-label">是否有货</view>
                    <switch :checked="ingredientForm.inStock" @change="onStockChange" color="#5A67D8" />
                </view>

                <view class="panel-buttons">
                    <view class="btn outline cancel-btn" @tap="hidePanel">取消</view>
                    <view class="btn primary confirm-btn" @tap="saveIngredient">确定</view>
                </view>
            </view>
        </view>

        <!-- 遮罩层 -->
        <view class="mask" v-if="showPanel" @tap="hideAllPanels"></view>

        <!-- 添加浮动按钮 -->
        <view class="floating-btn add" @tap="showAddIngredientPanel">
            <text class="add-icon">+</text>
        </view>

        <TestButton />
    </view>
</template>

<script>
import Header from '@/pages/components/Header/index.vue';
import CategoryNav from '@/pages/components/CategoryManager/CategoryNav.vue';
import { ingredientService, menuSetService, ingredientCategoryService } from '@/services/dataService.js';
import tabBarMixin from '@/common/mixins/tabBarMixin.js';
import TestButton from '@/pages/components/TestButton.vue';

export default {
    components: {
        Header,
        CategoryNav,
        TestButton
    },
    mixins: [tabBarMixin],
    data() {
        return {
            ingredients: [],
            filteredIngredients: [],
            showFilterPanel: false,
            allCategories: [],
            selectedCategories: [],
            safeAreaInsets: null,
            showPanel: false,
            isEdit: false,
            ingredientForm: {
                name: '',
                categoryId: '',
                inStock: true
            },
            showCategorySelect: false,
            categoryIndex: 0,
            categoryOptions: [],
            originalIngredients: [],
            menuSets: [],
            currentMenuSet: null,
            isEditMode: false,
            currentCategoryName: '',
            toView: '',
            selectedIngredients: [],
            userId: 1001,
        };
    },
    computed: {
        // 按分类对食材进行分组
        categorizedIngredients() {
            const result = [];
            const map = {};
            this.filteredIngredients.forEach(item => {
                const cat = this.allCategories.find(c => c.id === item.categoryId) || { id: '9', name: '其他' };
                if (!map[cat.id]) {
                    map[cat.id] = {
                        id: cat.id,
                        name: cat.name,
                        order: cat.order,
                        items: []
                    };
                    result.push(map[cat.id]);
                }
                map[cat.id].items.push(item);
            });
            // 按 order 排序，"其他"放最后
            result.sort((a, b) => {
                if (a.name === '其他') return 1;
                if (b.name === '其他') return -1;
                return a.order - b.order;
            });
            return result;
        },
        // 是否全选
        isAllSelected() {
            return this.ingredients.length > 0 && this.selectedIngredients.length === this.ingredients.length;
        }
    },
    onLoad() {
        this.loadData();
    },
    onShow() {
        this.loadData();
    },
    onReady() {
        // 获取安全区域边距
        try {
            const sysInfo = uni.getSystemInfoSync();
            this.safeAreaInsets = sysInfo.safeAreaInsets;
            console.log('safeAreaInsets:', this.safeAreaInsets);
        } catch (e) {
            console.error('获取系统信息失败', e);
            this.safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };
        }
    },
    methods: {
        // 菜单集改变时的回调
        onMenuSetChanged(menuSetId) {
            // 重新加载数据
            this.loadData();
        },

        // 切换筛选面板
        toggleFilterPanel() {
            this.showFilterPanel = !this.showFilterPanel;
        },

        // 隐藏所有面板
        hideAllPanels() {
            this.showPanel = false;
            this.showFilterPanel = false;
            this.showCategorySelect = false;
        },

        // 切换分类选择
        toggleCategory(category) {
            const id = typeof category === 'string' ? category : category.id;
            if (this.selectedCategories.includes(id)) {
                this.selectedCategories = this.selectedCategories.filter(c => c !== id);
            } else {
                this.selectedCategories.push(id);
            }
        },

        // 重置筛选条件
        resetFilter() {
            this.selectedCategories = [];
        },

        // 应用筛选条件
        applyFilter() {
            if (this.selectedCategories.length > 0) {
                this.filteredIngredients = this.originalIngredients.filter(item =>
                    this.selectedCategories.includes(item.categoryId || '9')
                );
            } else {
                this.filteredIngredients = [...this.originalIngredients];
            }
            this.showFilterPanel = false;
        },

        // 加载食材数据
        loadData() {
            this.ingredients = ingredientService.getCurrentMenuSetIngredients();
            this.filteredIngredients = [...this.ingredients];
            this.originalIngredients = [...this.ingredients];
            // 获取所有食材分类
            this.allCategories = ingredientCategoryService.getCategoriesByOrder();
            this.categoryOptions = this.allCategories;
            // 获取菜单集数据
            this.menuSets = menuSetService.getAllMenuSets();
            this.currentMenuSet = menuSetService.getCurrentMenuSet();
        },

        // 切换食材库存状态
        toggleIngredientStock(id) {
            const result = ingredientService.toggleIngredientStock(id);
            if (result) {
                // 更新本地数据
                const ingredient = this.ingredients.find(item => item.id === id);
                if (ingredient) {
                    ingredient.inStock = !ingredient.inStock;
                }
                // 更新筛选后的数据
                const filteredIngredient = this.filteredIngredients.find(item => item.id === id);
                if (filteredIngredient) {
                    filteredIngredient.inStock = !filteredIngredient.inStock;
                }
                // 更新原始数据
                const originalIngredient = this.originalIngredients.find(item => item.id === id);
                if (originalIngredient) {
                    originalIngredient.inStock = !originalIngredient.inStock;
                }

                uni.showToast({
                    title: '更新成功',
                    icon: 'success'
                });
            } else {
                uni.showToast({
                    title: '更新失败',
                    icon: 'error'
                });
            }
        },

        // 显示添加食材面板
        showAddIngredientPanel() {
            this.isEdit = false;
            this.editId = '';
            this.ingredientForm = {
                name: '',
                categoryId: this.categoryOptions[0]?.id || '',
                inStock: true
            };
            this.categoryIndex = 0;
            this.showPanel = true;
        },

        // 编辑食材
        editIngredient(ingredient) {
            this.isEdit = true;
            this.editId = ingredient.id;
            this.ingredientForm = {
                name: ingredient.name,
                categoryId: ingredient.categoryId,
                inStock: ingredient.inStock
            };
            this.categoryIndex = this.categoryOptions.findIndex(item => item.id === ingredient.categoryId);
            if (this.categoryIndex === -1) this.categoryIndex = 0;
            this.showPanel = true;
        },

        // 隐藏面板
        hidePanel() {
            this.showPanel = false;
            this.showCategorySelect = false;
        },

        // 处理分类修改
        onCategoryChange(e) {
            this.categoryIndex = e.detail.value;
            this.ingredientForm.categoryId = this.categoryOptions[this.categoryIndex].id;
        },

        // 处理库存状态修改
        onStockChange(e) {
            this.ingredientForm.inStock = e.detail.value;
        },

        // 验证表单
        validateForm() {
            if (!this.ingredientForm.name.trim()) {
                uni.showToast({
                    title: '请输入食材名称',
                    icon: 'none'
                });
                return false;
            }

            if (!this.ingredientForm.categoryId) {
                uni.showToast({
                    title: '请选择分类',
                    icon: 'none'
                });
                return false;
            }

            return true;
        },

        // 保存食材
        saveIngredient() {
            if (!this.validateForm()) return;

            let result = false;

            if (this.isEdit) {
                // 更新食材
                result = ingredientService.updateIngredient({
                    id: this.editId,
                    ...this.ingredientForm
                });
            } else {
                // 添加新食材
                const newIngredient = ingredientService.addIngredient(this.ingredientForm);
                result = !!newIngredient;
            }

            if (result) {
                uni.showToast({
                    title: this.isEdit ? '更新成功' : '添加成功',
                    icon: 'success'
                });
                this.hidePanel();
                this.loadData();
            } else {
                uni.showToast({
                    title: this.isEdit ? '更新失败' : '添加失败',
                    icon: 'none'
                });
            }
        },

        // 删除食材
        deleteIngredient(id, name) {
            uni.showModal({
                title: '删除确认',
                content: `确定要删除"${name}"吗？`,
                confirmColor: '#FF3B30',
                success: (res) => {
                    if (res.confirm) {
                        const result = ingredientService.deleteIngredient(id);

                        if (result) {
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success'
                            });
                            this.loadData();
                        } else {
                            uni.showToast({
                                title: '删除失败',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        },

        // 显示分类选择器
        showCategorySelector() {
            this.showCategorySelect = true;
        },

        // 选择分类
        selectCategory(index) {
            this.categoryIndex = index;
            this.ingredientForm.categoryId = this.categoryOptions[index].id;
            this.showCategorySelect = false;
        },

        // 导航到其他页面
        navigateToPages(url) {
            uni.navigateTo({
                url: url
            });
        },

        // CategoryNav 相关事件
        onSelectCategory(categoryName) {
            // 只滚动到对应分类section
            this.currentCategoryName = categoryName;
            this.toView = this.encodeId(categoryName);
        },
        onDeleteCategory(categoryName) {
            // 删除分类
            const category = this.allCategories.find(c => c.name === categoryName);
            if (!category) return;

            // 获取该分类下的食材数量
            const categoryIngredients = this.ingredients.filter(ingredient => ingredient.categoryId === category.id);
            const ingredientCount = categoryIngredients.length;

            uni.showModal({
                title: '确认删除分类',
                content: `确定要删除分类 "${categoryName}" 吗？该分类下的 ${ingredientCount} 种食材也将被删除，此操作不可恢复。`,
                success: (res) => {
                    if (res.confirm) {
                        // 先删除该分类下的所有食材
                        categoryIngredients.forEach(ingredient => {
                            ingredientService.deleteIngredient(ingredient.id);
                        });

                        // 然后删除分类
                        ingredientCategoryService.deleteCategory(category.id);

                        // 重新加载数据
                        this.loadData();
                        uni.showToast({ title: '删除成功', icon: 'success' });
                    }
                }
            });
        },
        toggleEditMode() {
            this.isEditMode = !this.isEditMode;
            if (!this.isEditMode) {
                this.selectedIngredients = [];
            }
        },
        onUpdateCategoryOrder(newOrder) {
            // 根据新顺序调整 allCategories
            const newCategories = [];
            newOrder.forEach(name => {
                const cat = this.allCategories.find(c => c.name === name);
                if (cat) newCategories.push(cat);
            });
            // 重新赋值并可同步到服务
            this.allCategories = newCategories;
            // 同步到食材分类服务
            const categoryIds = newOrder.map(name => {
                const cat = this.allCategories.find(c => c.name === name);
                return cat ? cat.id : null;
            }).filter(id => id !== null);
            ingredientCategoryService.updateCategoryOrder(categoryIds);
            // 重新加载数据以反映新的排序
            this.loadData();
        },
        encodeId(categoryName) {
            return 'category-' + encodeURIComponent(categoryName).replace(/%/g, '_');
        },
        selectAllIngredients() {
            if (this.isAllSelected) {
                this.selectedIngredients = [];
            } else {
                this.selectedIngredients = this.ingredients.map(ingredient => ingredient.id);
            }
        },
        deleteSelectedIngredients() {
            if (this.selectedIngredients.length === 0) return;

            uni.showModal({
                title: '确认删除',
                content: `确定要删除选中的 ${this.selectedIngredients.length} 种食材吗？此操作不可恢复。`,
                success: (res) => {
                    if (res.confirm) {
                        // 删除食材
                        this.selectedIngredients.forEach(ingredientId => {
                            ingredientService.deleteIngredient(ingredientId);
                        });

                        // 重新加载数据
                        this.loadData();
                        this.selectedIngredients = [];

                        uni.showToast({
                            title: '删除成功',
                            icon: 'success'
                        });
                    }
                }
            });
        },
        toggleIngredientSelection(id) {
            if (this.selectedIngredients.includes(id)) {
                this.selectedIngredients = this.selectedIngredients.filter(i => i !== id);
            } else {
                this.selectedIngredients.push(id);
            }
        },
    }
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/common.scss';

.container {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.safe-area-container {
    background-color: $primary-color;
    box-shadow: $shadow-md;
}

/* 顶部导航栏样式 */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 15rpx 0;
    background-color: $primary-color;
    /* 使用主题色 */
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: $shadow-md;
}

.category-btn,
.search-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: $shadow-sm;

    &:active {
        transform: scale(0.95);
        opacity: 0.8;
    }
}

/* 菜单集选择器样式 */
.menu-set-selector {
    height: 72rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    margin-right: 16rpx;
    box-shadow: $shadow-sm;

    .menu-set-name {
        font-size: 26rpx;
        color: white;
        font-weight: 500;
        max-width: 120rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

/* 菜单集选择面板 */
.menu-set-panel {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-height: 60vh;
    background-color: white;
    border-radius: 20rpx;
    box-shadow: $shadow-lg;
    z-index: 1001;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.menu-set-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $divider-color;
}

.menu-set-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
}

.create-menu-set {
    display: flex;
    align-items: center;
    color: $primary-color;
    font-size: 26rpx;

    .add-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 4rpx;
    }
}

.menu-set-list {
    flex: 1;
    padding: 20rpx 30rpx;
    max-height: calc(60vh - 180rpx);
}

.menu-set-item {
    padding: 20rpx 0;
    border-bottom: 1px solid $divider-color;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
        border-bottom: none;
    }

    &.active {
        .menu-set-item-name {
            color: $primary-color;
            font-weight: 500;
        }
    }
}

.menu-set-item-name {
    font-size: 28rpx;
    color: $text-color;
}

.menu-set-info {
    display: flex;
    align-items: center;
    color: $text-color-light;
    font-size: 24rpx;
}

.menu-set-count {
    margin-right: 10rpx;
}

.check-icon {
    width: 32rpx;
    height: 32rpx;
}

.menu-set-actions {
    padding: 20rpx;
    border-top: 1px solid $divider-color;
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
}

/* 筛选面板 */
.filter-panel {
    position: fixed;
    top: 100rpx;
    left: 0;
    width: 100%;
    height: 0;
    background-color: $card-color;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    z-index: 100;
    box-shadow: $shadow-md;
}

.filter-panel-show {
    height: auto;
    padding: 30rpx;
}

.filter-section {
    margin-bottom: $spacing-md;
}

.filter-title {
    font-size: 28rpx;
    font-weight: 500;
    margin-bottom: $spacing-md;
    color: $text-color;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-bottom: 30rpx;
}

.tag {
    padding: 10rpx 20rpx;
    background-color: #F3F4F6;
    color: $text-color;
    border-radius: 8rpx;
    font-size: 24rpx;

    &.active {
        background-color: $primary-color;
        color: white;
    }
}

.filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    margin-top: 20rpx;
}

/* 遮罩层 */
.mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

/* 主内容区域样式 */
.main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    background-color: #fff;
}

/* 左侧分类导航样式 */
.category-nav {
    width: 180rpx;
    height: 100%;
    background-color: #f5f5f5;
    border-right: 1px solid $border-color;
}

.category-item {
    padding: 24rpx 20rpx;
    border-bottom: 1px solid $border-color;
    @include transition-fast;

    &.active {
        background-color: $primary-light;
        border-left: 4rpx solid $primary-color;
    }

    &:active {
        background-color: darken($primary-light, 5%);
    }
}

.category-name {
    font-size: 28rpx;
    color: $text-color;
    font-weight: 500;
}

/* 右侧食材列表样式 */
.ingredient-list {
    flex: 1;
    height: 100%;
    background-color: #fff;
}

.category-section {
    padding: 20rpx;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    margin-bottom: 16rpx;
}

.category-info {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.category-name {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
    position: relative;
    padding-left: 20rpx;
}

.category-header .category-name::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6rpx;
    height: 32rpx;
    width: 8rpx;
    background-color: $primary-color;
    border-radius: 4rpx;
}

.category-count {
    font-size: 24rpx;
    color: $text-color-light;
}

/* 食材列表样式 */
.ingredient-list-horizontal {
    width: auto;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-top: 20rpx;
}

.ingredient-card-horizontal {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
    display: flex;
    gap: 20rpx;
    padding: 16rpx;
    position: relative;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(0, 0, 0, 0.03);

    &.selected {
        border-color: $primary-color;
        background-color: $primary-light;
    }

    &:active {
        transform: translateY(-2rpx);
        box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
    }
}

.ingredient-info-horizontal {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6rpx 0;
}

.ingredient-name-horizontal {
    font-size: 30rpx;
    font-weight: 600;
    color: #1F2937;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
}

.ingredient-actions {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.action-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    background-color: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    @include transition-fast;

    &:active {
        transform: scale(0.9);
        opacity: 0.8;
    }
}

.action-icon {
    width: 32rpx;
    height: 32rpx;
    opacity: 0.7;
}

/* 浮动按钮样式 */
.floating-btn {
    position: fixed;
    right: 40rpx;
    bottom: 160rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: $primary-color;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: $shadow-lg;
    z-index: 90;
    @include transition-fast;

    &:active {
        transform: scale(0.9);
    }

    .add-icon {
        color: white;
        font-size: 50rpx;
        line-height: 1;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
    opacity: 0.7;
}

.empty-text {
    font-size: 28rpx;
    color: $text-color-light;
}

.ingredient-panel {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $card-color;
    border-radius: 30rpx 30rpx 0 0;
    padding: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 1001;
    box-shadow: $shadow-lg;
    max-height: 85vh;
    overflow-y: auto;
}

.panel-show {
    transform: translateY(0);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
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

    .close-icon {
        width: 36rpx;
        height: 36rpx;
        opacity: 0.5;
    }
}

.panel-content {
    padding: 30rpx;
}

.form-group {
    margin-bottom: 24rpx;

    &:last-child {
        margin-bottom: 0;
    }
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
    @include transition-fast;
    height: 88rpx;

    &:focus {
        border-color: $primary-color;
        background-color: white;
    }
}

.custom-picker {
    width: 100%;
}

.picker-text {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 0 20rpx;
    height: 88rpx;
    font-size: 28rpx;
    color: $text-color;
    border: 2rpx solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon-arrow {
        width: 32rpx;
        height: 32rpx;
        opacity: 0.5;
    }
}

.picker-placeholder {
    color: $text-color-lighter;
}

/* 自定义分类选择器样式 */
.category-selector {
    position: absolute;
    left: 30rpx;
    /* 对应panel-content的padding */
    right: 30rpx;
    margin-top: 4rpx;
    background-color: white;
    border-radius: $input-radius;
    box-shadow: $shadow-md;
    z-index: 1002;
    /* 确保在浮框之上 */
    max-height: 400rpx;
    overflow-y: auto;
    border: 2rpx solid $border-color;
}

.category-option {
    padding: 24rpx 30rpx;
    font-size: 28rpx;
    color: $text-color;
    border-bottom: 2rpx solid $divider-color;
    @include transition-fast;

    &:last-child {
        border-bottom: none;
    }

    &:active,
    &.selected {
        background-color: $primary-light;
    }

    &.selected {
        color: $primary-color;
        font-weight: 500;
    }
}

.switch-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-buttons {
    display: flex;
    margin-top: 40rpx;
    gap: 20rpx;
    padding-bottom: 20rpx;
}

.panel-buttons .cancel-btn,
.panel-buttons .confirm-btn {
    flex: 1;
    height: 88rpx;
    border-radius: $btn-radius;
    font-size: 30rpx;
    font-weight: 500;
}

/* 多选删除模式样式 */
.multi-select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #F8FAFC;
    border-bottom: 1px solid $border-color;
    position: sticky;
    top: 0;
    z-index: 10;
}

.multi-select-info {
    display: flex;
    flex-direction: column;
    gap: 4rpx;

    .multi-select-title {
        font-size: 28rpx;
        font-weight: 600;
        color: $text-color;
    }

    .selected-count {
        font-size: 24rpx;
        color: $text-color-light;
    }
}

.multi-select-actions {
    display: flex;
    gap: 16rpx;

    .action-btn {
        padding: 12rpx 20rpx;
        border-radius: 8rpx;
        background-color: $primary-light;
        @include transition-fast;

        &.delete {
            background-color: #FEE2E2;
        }

        &.disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        &:active {
            transform: scale(0.95);
        }

        .action-text {
            font-size: 24rpx;
            color: $primary-color;
            font-weight: 500;
        }
    }
}

.ingredient-checkbox {
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid $border-color;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    flex-shrink: 0;
    @include transition-fast;

    .checkbox-icon {
        font-size: 24rpx;
        color: $primary-color;
        font-weight: bold;
    }
}

/* 编辑模式提示样式 */
.edit-tip {
    padding: 20rpx 30rpx;
    background-color: #FEF3C7;
    border-bottom: 1px solid #FDE68A;
}

.tip-text {
    font-size: 24rpx;
    color: #92400E;
    line-height: 1.4;
}
</style>
