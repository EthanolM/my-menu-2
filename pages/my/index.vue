<template>
    <view class="container">
        <!-- 用户信息卡片 -->
        <view class="user-card">
            <view class="user-info">
                <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'"></image>
                <view class="user-details">
                    <text class="username">{{ userInfo.nickname || '未登录' }}</text>
                    <text class="user-id">ID: {{ userInfo.id || 'Guest' }}</text>
                </view>
            </view>
            <view class="edit-profile" @tap="editProfile">
                <text>编辑</text>
            </view>
        </view>

        <!-- 功能列表 -->
        <view class="panel">
            <view class="panel-title">我的菜单</view>
            <view class="menu-list">
                <view class="menu-item" @tap="navigateTo('/pages/dish/list')">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/dishes.png"></image>
                    </view>
                    <text class="menu-text">我的菜品</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
                <view class="menu-item" @tap="navigateTo('/pages/ingredients/index')">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/ingredients.png"></image>
                    </view>
                    <text class="menu-text">食材管理</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
                <view class="menu-item" @tap="navigateTo('/pages/favorites/index')">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/favorites.png"></image>
                    </view>
                    <text class="menu-text">我的收藏</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
                <view class="menu-item" @tap="navigateTo('/pages/selection/history')">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/history.png"></image>
                    </view>
                    <text class="menu-text">历史记录</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
            </view>
        </view>

        <view class="panel">
            <view class="panel-title">设置</view>
            <view class="menu-list">
                <view class="menu-item">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/darkmode.png"></image>
                    </view>
                    <text class="menu-text">夜间模式</text>
                    <switch :checked="isDarkMode" @change="toggleDarkMode" color="#5A67D8"
                        style="transform:scale(0.8)" />
                </view>
                <view class="menu-item">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/notification.png"></image>
                    </view>
                    <text class="menu-text">推送通知</text>
                    <switch :checked="allowNotification" @change="toggleNotification" color="#5A67D8"
                        style="transform:scale(0.8)" />
                </view>
                <view class="menu-item" @tap="exportData">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/export.png"></image>
                    </view>
                    <text class="menu-text">导出数据</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
                <view class="menu-item" @tap="clearCache">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/clear.png"></image>
                    </view>
                    <text class="menu-text">清除缓存</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
            </view>
        </view>

        <view class="panel">
            <view class="panel-title">关于</view>
            <view class="menu-list">
                <view class="menu-item" @tap="navigateTo('/pages/about/feedback')">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/feedback.png"></image>
                    </view>
                    <text class="menu-text">意见反馈</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
                <view class="menu-item" @tap="showAppInfo">
                    <view class="menu-icon-box">
                        <image class="menu-icon" src="/static/icons/about.png"></image>
                    </view>
                    <text class="menu-text">关于我的菜单</text>
                    <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                </view>
            </view>
        </view>

        <view class="logout-btn" @tap="logout">
            <text>退出登录</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userInfo: {
                nickname: '厨房爱好者',
                avatar: '/static/images/avatar.png',
                id: 'cook123456'
            },
            isDarkMode: false,
            allowNotification: true
        };
    },
    onLoad() {
        this.loadSettings();
    },
    methods: {
        loadSettings() {
            // 从本地存储加载设置
            try {
                const settings = uni.getStorageSync('userSettings');
                if (settings) {
                    const parsedSettings = JSON.parse(settings);
                    this.isDarkMode = parsedSettings.isDarkMode || false;
                    this.allowNotification = parsedSettings.allowNotification !== false;
                }
            } catch (e) {
                console.error('加载设置失败', e);
            }
        },

        saveSettings() {
            // 保存设置到本地存储
            try {
                uni.setStorageSync('userSettings', JSON.stringify({
                    isDarkMode: this.isDarkMode,
                    allowNotification: this.allowNotification
                }));
            } catch (e) {
                console.error('保存设置失败', e);
            }
        },

        editProfile() {
            uni.navigateTo({
                url: '/pages/my/profile'
            });
        },

        navigateTo(url) {
            uni.navigateTo({
                url
            });
        },

        exportData() {
            uni.showLoading({
                title: '导出中...'
            });

            setTimeout(() => {
                uni.hideLoading();
                uni.showModal({
                    title: '导出成功',
                    content: '菜单数据已成功导出到您的设备',
                    showCancel: false
                });
            }, 1500);
        },

        toggleDarkMode(e) {
            this.isDarkMode = e.detail.value;
            this.saveSettings();

            // 实际应用中可能需要更改应用主题
            uni.showToast({
                title: this.isDarkMode ? '已开启夜间模式' : '已关闭夜间模式',
                icon: 'none'
            });
        },

        toggleNotification(e) {
            this.allowNotification = e.detail.value;
            this.saveSettings();

            uni.showToast({
                title: this.allowNotification ? '已开启推送通知' : '已关闭推送通知',
                icon: 'none'
            });
        },

        clearCache() {
            uni.showModal({
                title: '清除缓存',
                content: '确定要清除应用缓存吗？这不会删除您的菜单数据',
                success: (res) => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '清除中...'
                        });

                        setTimeout(() => {
                            uni.hideLoading();
                            uni.showToast({
                                title: '缓存已清除',
                                icon: 'success'
                            });
                        }, 1000);
                    }
                }
            });
        },

        showAppInfo() {
            uni.showModal({
                title: '关于我的菜单',
                content: '我的菜单 v1.0.0\n一款帮助您管理菜谱、规划食材的小工具',
                showCancel: false
            });
        },

        logout() {
            uni.showModal({
                title: '退出登录',
                content: '确定要退出当前账号吗？',
                success: (res) => {
                    if (res.confirm) {
                        uni.showToast({
                            title: '已退出登录',
                            icon: 'success'
                        });
                        // 实际应用中应该清除用户信息和认证状态
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/common.scss';

.user-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-sm;
}

.user-info {
    display: flex;
    align-items: center;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: $spacing-lg;
    background-color: $divider-color;
    box-shadow: $shadow-sm;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.username {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-xs;
}

.user-id {
    font-size: 24rpx;
    color: $text-color-light;
}

.edit-profile {
    padding: $spacing-sm $spacing-md;
    border-radius: 100rpx;
    background-color: $primary-light;
    font-size: 26rpx;
    color: $primary-color;
}

.divider {
    width: 2rpx;
    height: 60rpx;
    background-color: $divider-color;
    margin: auto 0;
}

.panel {
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $spacing-lg $spacing-lg $spacing-sm;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-sm;
}

.panel-title {
    font-size: 28rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-md;
    padding-left: $spacing-sm;
}

.menu-list {
    border-radius: $input-radius;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-lg $spacing-sm;
    border-bottom: 2rpx solid $divider-color;
    @include transition-fast;

    &:active {
        background-color: darken($card-color, 2%);
    }

    &:last-child {
        border-bottom: none;
    }
}

.menu-icon-box {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background-color: $primary-light;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-md;
}

.menu-icon {
    width: 30rpx;
    height: 30rpx;
    opacity: 0.8;
}

.menu-text {
    flex: 1;
    font-size: 28rpx;
    color: $text-color;
}

.icon-arrow {
    width: 32rpx;
    height: 32rpx;
    opacity: 0.3;
}

.logout-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    height: 88rpx;
    border-radius: $btn-radius;
    margin-top: $spacing-xl;
    margin-bottom: $spacing-xl;
    font-size: 28rpx;
    color: $error-color;
    box-shadow: $shadow-sm;
    border: 2rpx solid rgba($error-color, 0.2);

    &:active {
        background-color: rgba($error-color, 0.05);
    }
}
</style>
