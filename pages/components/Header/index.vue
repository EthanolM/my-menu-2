<template>
    <view class="safe-area-container" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
        <view class="header">
            <!-- 左侧：编辑模式切换按钮 -->
            <view class="edit-btn" @tap="$emit('toggle-edit-mode')" :class="{ 'active': isEditMode }">
                <up-icon :name="isEditMode ? 'check' : 'edit'" size="24" color="#FFFFFF"></up-icon>
            </view>

            <!-- 中间：菜单集名称和选择 -->
            <view class="menu-set-selector" @tap="showMenuSetSelector">
                <text class="menu-set-name">{{ currentMenuSet.name }}</text>
                <up-icon name="arrow-down" size="22" color="#FFFFFF"></up-icon>
            </view>

            <!-- 右侧：搜索按钮 -->
            <view class="search-btn" @tap="navigateToSearch">
                <up-icon name="search" size="24" color="#FFFFFF"></up-icon>
            </view>
        </view>

        <!-- 菜单集选择弹窗 -->
        <view class="menu-set-panel" v-if="showMenuSets">
            <view class="menu-set-header">
                <text class="menu-set-title">选择菜单集</text>
                <view class="create-menu-set" @tap="navigateToPages('/pages/menusets/create')">
                    <image src="/static/icons/add.png" class="add-icon"></image>
                    <text>新建</text>
                </view>
            </view>

            <scroll-view class="menu-set-list" scroll-y="true">
                <view v-for="menuSet in menuSets" :key="menuSet.id" class="menu-set-item"
                    :class="{ 'active': currentMenuSet.id === menuSet.id }" @tap="selectMenuSet(menuSet.id)">
                    <text class="menu-set-item-name">{{ menuSet.name }}</text>
                    <view class="menu-set-info">
                        <text class="menu-set-count">{{ getMenuSetCount(menuSet.id) }}</text>
                        <image v-if="currentMenuSet.id === menuSet.id" src="/static/icons/check.png" class="check-icon">
                        </image>
                    </view>
                </view>
            </scroll-view>

            <view class="menu-set-actions">
                <view class="btn text" @tap="navigateToPages('/pages/menusets/index')">管理菜单集</view>
                <view class="btn primary" @tap="hideMenuSetSelector">确定</view>
            </view>
        </view>

        <!-- 遮罩层 -->
        <view class="mask" v-if="showMenuSets" @tap="hideAllPanels"></view>
    </view>
</template>

<script>
import { menuSetService } from '@/services/dataService.js';

export default {
    name: 'Header',
    props: {
        // 页面类型：'index' 或 'ingredients'
        pageType: {
            type: String,
            required: true
        },
        // 安全区域边距
        safeAreaInsets: {
            type: Object,
            default: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
        },
        // 所有菜单集
        menuSets: {
            type: Array,
            default: () => []
        },
        // 当前选择的菜单集
        currentMenuSet: {
            type: Object,
            default: () => ({})
        },
        // 是否为编辑模式
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showMenuSets: false, // 控制菜单集选择器显示
        };
    },

    methods: {
        // 获取菜单集数量统计
        getMenuSetCount(menuSetId) {
            if (this.pageType === 'ingredients') {
                // 食材页面显示食材数量
                const ingredients = menuSetService.getIngredientsInMenuSet(menuSetId);
                return `${ingredients.length}种食材`;
            } else {
                // 首页显示菜品数量
                const dishes = menuSetService.getDishesInMenuSet(menuSetId);
                return `${dishes.length}道菜`;
            }
        },

        // 显示菜单集选择器
        showMenuSetSelector() {
            this.showMenuSets = true;
        },

        // 隐藏菜单集选择器
        hideMenuSetSelector() {
            this.showMenuSets = false;
        },

        // 隐藏所有面板
        hideAllPanels() {
            this.showMenuSets = false;
            this.$emit('hide-all-panels');
        },

        // 选择菜单集
        selectMenuSet(menuSetId) {
            this.$emit('menu-set-changed', menuSetId);
            this.hideMenuSetSelector();
        },

        // 导航到搜索页面
        navigateToSearch() {
            uni.navigateTo({
                url: '/pages/search/index'
            });
        },

        // 导航到指定页面
        navigateToPages(url) {
            uni.navigateTo({
                url: url
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.safe-area-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    height: 56px;
}

.edit-btn,
.search-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.95);
        background: rgba(255, 255, 255, 0.2);
    }
}

.edit-btn {
    &.active {
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }
}

.menu-set-selector {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    margin: 0 12px;
}

.menu-set-name {
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 600;
}

/* 菜单集选择弹窗样式 */
.menu-set-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    background: #FFFFFF;
    border-radius: 16px;
    z-index: 1000;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.menu-set-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #F0F0F0;
}

.menu-set-title {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
}

.create-menu-set {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #F5F5F5;
    color: #666666;
    font-size: 14px;
}

.add-icon {
    width: 16px;
    height: 16px;
}

.menu-set-list {
    max-height: 300px;
    padding: 0 20px;
}

.menu-set-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #F5F5F5;
}

.menu-set-item:last-child {
    border-bottom: none;
}

.menu-set-item.active {
    background: #F8F9FF;
    border-radius: 8px;
    margin: 0 -20px;
    padding: 16px 20px;
}

.menu-set-item-name {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
}

.menu-set-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.menu-set-count {
    font-size: 14px;
    color: #666666;
}

.check-icon {
    width: 20px;
    height: 20px;
}

.menu-set-actions {
    display: flex;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #F0F0F0;
}

.btn {
    flex: 1;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
}

.btn.text {
    background: #F5F5F5;
    color: #666666;
}

.btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #FFFFFF;
}

/* 遮罩层 */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}
</style>