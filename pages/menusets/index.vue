<template>
    <view class="container">
        <view class="page-title">菜单集管理</view>

        <!-- 创建菜单集按钮 -->
        <view class="add-btn-box">
            <view class="btn-add" @tap="navigateTo('/pages/menusets/create')">
                <image class="btn-icon" src="/static/icons/add.png"></image>
                <text>创建新菜单集</text>
            </view>
        </view>

        <!-- 菜单集列表 -->
        <view class="menusets-list">
            <view v-for="menuSet in menuSets" :key="menuSet.id" class="menusets-card"
                :class="{ 'active': currentMenuSetId === menuSet.id }">
                <view class="menusets-info" @tap="selectMenuSet(menuSet.id)">
                    <view class="menusets-header">
                        <view class="menusets-name">{{ menuSet.name }}</view>
                        <view class="menusets-badge" v-if="menuSet.isDefault">默认</view>
                    </view>

                    <view class="menusets-meta">
                        <view class="meta-item">
                            <text class="meta-icon">🍲</text>
                            <text class="meta-value">{{ getMenuSetDishCount(menuSet.id) }}道菜</text>
                        </view>
                        <view class="meta-item">
                            <text class="meta-icon">🥕</text>
                            <text class="meta-value">{{ getMenuSetIngredientCount(menuSet.id) }}种食材</text>
                        </view>
                    </view>
                </view>

                <view class="menusets-actions">
                    <view class="action-btn" @tap="editMenuSet(menuSet)" v-if="!menuSet.isDefault">
                        <image class="action-icon" src="/static/icons/edit.png"></image>
                    </view>
                    <view class="action-btn" @tap="shareMenuSet(menuSet.id)">
                        <image class="action-icon" src="/static/icons/share.png"></image>
                    </view>
                    <view class="action-btn" @tap="deleteMenuSet(menuSet.id)" v-if="!menuSet.isDefault">
                        <image class="action-icon" src="/static/icons/delete.png"></image>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view v-if="menuSets.length === 0" class="empty-state">
                <image class="empty-image" src="/static/images/empty.png"></image>
                <text class="empty-text">暂无菜单集，快去创建吧！</text>
            </view>
        </view>
    </view>
</template>

<script>
import { menuSetService } from '@/services/dataService.js';

export default {
    data() {
        return {
            menuSets: [],
            currentMenuSetId: ''
        };
    },
    onLoad() {
        this.loadData();
    },
    onShow() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.menuSets = menuSetService.getAllMenuSets();
            this.currentMenuSetId = menuSetService.getCurrentMenuSetId();
        },

        navigateTo(url) {
            uni.navigateTo({ url });
        },

        selectMenuSet(id) {
            menuSetService.setCurrentMenuSet(id);
            this.currentMenuSetId = id;
            uni.showToast({
                title: '已切换菜单集',
                icon: 'success'
            });
        },

        editMenuSet(menuSet) {
            uni.navigateTo({
                url: `/pages/menusets/edit?id=${menuSet.id}`
            });
        },

        shareMenuSet(id) {
            uni.navigateTo({
                url: `/pages/share/index?menuSetId=${id}`
            });
        },

        deleteMenuSet(id) {
            uni.showModal({
                title: '删除确认',
                content: '确定要删除此菜单集吗？此操作不可恢复。',
                confirmColor: '#FF3B30',
                success: (res) => {
                    if (res.confirm) {
                        const result = menuSetService.deleteMenuSet(id);
                        if (result) {
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success'
                            });
                            this.loadData();
                        } else {
                            uni.showToast({
                                title: '默认菜单集不能删除',
                                icon: 'none'
                            });
                        }
                    }
                }
            });
        },

        getMenuSetDishCount(menuSetId) {
            return menuSetService.getDishesInMenuSet(menuSetId).length;
        },

        getMenuSetIngredientCount(menuSetId) {
            return menuSetService.getIngredientsInMenuSet(menuSetId).length;
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

.add-btn-box {
    margin-bottom: 30rpx;
}

.btn-add {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $primary-color;
    border-radius: $btn-radius;
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #FFFFFF;
    box-shadow: $shadow-sm;
    @include transition-fast;

    &:active {
        transform: scale(0.95);
        opacity: 0.9;
    }
}

.btn-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 10rpx;
}

.menusets-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
}

.menusets-card {
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $spacing-lg;
    box-shadow: $shadow-sm;
    display: flex;
    justify-content: space-between;
    @include transition-fast;

    &.active {
        border-left: 8rpx solid $primary-color;
    }

    &:active {
        transform: translateY(-4rpx);
        box-shadow: $shadow-md;
    }
}

.menusets-info {
    flex: 1;
}

.menusets-header {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-sm;
}

.menusets-name {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
    margin-right: $spacing-sm;
}

.menusets-badge {
    padding: 4rpx 12rpx;
    background-color: $primary-light;
    color: $primary-color;
    border-radius: 100rpx;
    font-size: 20rpx;
}

.menusets-meta {
    display: flex;
    gap: $spacing-md;
}

.meta-item {
    display: flex;
    align-items: center;
}

.meta-icon {
    margin-right: 4rpx;
    font-size: 24rpx;
}

.meta-value {
    font-size: 24rpx;
    color: $text-color-light;
}

.menusets-actions {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
}

.action-btn {
    width: 64rpx;
    height: 64rpx;
    border-radius: 32rpx;
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

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;

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
}
</style>
