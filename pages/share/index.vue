<template>
    <view class="container">
        <!-- 头部信息 -->
        <view class="header-card">
            <view class="header-icon">
                <image src="/static/icons/share-large.png" class="header-image"></image>
            </view>
            <view class="header-content">
                <view class="header-title">分享菜单</view>
                <view class="header-desc">将您精心准备的菜单分享给家人和朋友</view>
            </view>
        </view>

        <!-- 分享设置 -->
        <view class="card share-settings">
            <view class="section-title">基本信息</view>

            <!-- 添加菜单集选择 -->
            <view class="form-group">
                <view class="form-label">选择菜单集</view>
                <picker class="form-picker" @change="onMenuSetChange" :value="menuSetIndex" :range="menuSetNames">
                    <view class="picker-text">
                        {{ selectedMenuSet.name }}
                        <image class="icon-arrow" src="/static/icons/arrow-down.png"></image>
                    </view>
                </picker>
            </view>

            <view class="form-group">
                <view class="form-label">分享名称</view>
                <input type="text" v-model="menuName" placeholder="为您的分享菜单命名" class="form-input" />
            </view>

            <view class="submit-btn-container">
                <view class="btn primary share-btn" @tap="generateShare">
                    <!-- <image src="/static/icons/share-white.png" class="share-icon"></image> -->
                    <text>生成分享</text>
                </view>
            </view>
        </view>

        <!-- 分享历史 -->
        <view class="card share-history" v-if="shareHistory.length > 0">
            <view class="section-title">分享历史</view>

            <view class="history-list">
                <view class="history-item" v-for="item in shareHistory" :key="item.id"
                    @tap="viewShareDetail(item.shareId)">
                    <view class="history-info">
                        <text class="history-name">{{ item.name }}</text>
                        <text class="history-date">{{ formatDate(item.date) }}</text>
                    </view>
                    <view class="history-meta">
                        <text class="history-count">已分享菜单</text>
                        <image class="icon-arrow" src="/static/icons/arrow-right.png"></image>
                    </view>
                </view>
            </view>
        </view>

        <!-- 分享结果弹窗 -->
        <view class="share-panel-container" v-if="showSharePanel">
            <view class="share-panel" :class="{ 'panel-show': showSharePanel }">
                <view class="panel-header">
                    <text class="panel-title">分享菜单</text>
                    <view class="panel-close" @tap="hideSharePanel">
                        <image src="/static/icons/close.png" class="close-icon"></image>
                    </view>
                </view>

                <view class="panel-content">
                    <view class="qrcode-container">
                        <view class="qrcode-box">
                            <image class="qrcode-image" src="/static/images/qrcode-placeholder.png"></image>
                        </view>
                        <view class="qrcode-tip">扫描二维码查看菜单</view>
                    </view>

                    <view class="share-menu-info">
                        <view class="share-menu-title">{{ currentShareMenu.name }}</view>
                        <view class="share-menu-subtitle">{{ selectedMenuSet.name }}</view>
                    </view>

                    <view class="share-link-container">
                        <view class="share-link-box">
                            <text class="share-link" selectable="true">{{ shareLink }}</text>
                            <view class="copy-btn" @tap="copyShareLink">复制</view>
                        </view>
                    </view>

                    <view class="share-actions">
                        <view class="save-image-btn" @tap="saveShareImage">
                            <image class="save-icon" src="/static/icons/save.png"></image>
                            <text>保存图片</text>
                        </view>
                        <button class="share-wechat-btn" open-type="share">
                            <image class="wechat-icon" src="/static/icons/wechat.png"></image>
                            <text>分享到微信</text>
                        </button>
                    </view>
                </view>
            </view>

            <view class="mask" @tap="hideSharePanel"></view>
        </view>
    </view>
</template>

<script>
import { shareService, menuSetService } from '@/services/dataService.js';

export default {
    data() {
        return {
            menuSets: [], // 所有菜单集
            menuSetNames: [], // 菜单集名称列表
            menuSetIndex: 0, // 当前选中的菜单集索引
            selectedMenuSet: {}, // 当前选中的菜单集
            menuName: '',
            shareHistory: [],
            showSharePanel: false,
            currentShareMenu: {
                name: '',
                menuSet: {}
            },
            shareLink: '',
            shareId: ''
        };
    },
    onLoad(options) {
        // 加载所有菜单集
        this.loadMenuSets();

        // 如果传入了menuSetId，则选中该菜单集
        if (options.menuSetId) {
            const index = this.menuSets.findIndex(set => set.id === options.menuSetId);
            if (index !== -1) {
                this.menuSetIndex = index;
                this.selectMenuSet(index);
            }
        }

        this.loadShareHistory();
    },
    onShow() {
        this.loadMenuSets();
        this.loadShareHistory();
    },
    methods: {
        // 加载菜单集
        loadMenuSets() {
            this.menuSets = menuSetService.getAllMenuSets();
            this.menuSetNames = this.menuSets.map(set => set.name);

            // 默认选中第一个菜单集
            if (this.menuSets.length > 0 && !this.selectedMenuSet.id) {
                this.selectMenuSet(0);
            }
        },

        // 选择菜单集
        selectMenuSet(index) {
            if (index >= 0 && index < this.menuSets.length) {
                this.selectedMenuSet = this.menuSets[index];
                this.menuName = `${this.selectedMenuSet.name}精选`;
            }
        },

        // 监听菜单集选择变化
        onMenuSetChange(e) {
            const index = e.detail.value;
            this.menuSetIndex = index;
            this.selectMenuSet(index);
        },

        // 加载分享历史
        loadShareHistory() {
            this.shareHistory = shareService.getShareHistory();
        },

        // 生成分享
        generateShare() {
            if (!this.selectedMenuSet?.id) {
                uni.showToast({
                    title: '请选择菜单集',
                    icon: 'none'
                });
                return;
            }

            // 创建分享菜单
            this.shareId = shareService.createShareMenu(
                this.selectedMenuSet.id,
                this.menuName || this.selectedMenuSet.name
            );

            // 更新分享历史
            this.shareHistory = shareService.getShareHistory();

            // 生成分享链接
            this.shareLink = `https://menu.example.com/share/${this.shareId}`;

            // 获取当前分享的菜单
            const sharedMenu = shareService.getSharedMenu(this.shareId);
            if (sharedMenu) {
                this.currentShareMenu = {
                    name: sharedMenu.name,
                    menuSet: this.selectedMenuSet
                };
            }

            // 显示分享面板
            this.showSharePanel = true;
        },

        hideSharePanel() {
            this.showSharePanel = false;
        },

        copyShareLink() {
            uni.setClipboardData({
                data: this.shareLink,
                success: () => {
                    uni.showToast({
                        title: '链接已复制',
                        icon: 'success'
                    });
                }
            });
        },

        saveShareImage() {
            uni.showToast({
                title: '图片已保存',
                icon: 'success'
            });
        },

        viewShareDetail(shareId) {
            uni.navigateTo({
                url: `/pages/selection/index?shareId=${shareId}`
            });
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }
    },
    onShareAppMessage() {
        return {
            title: `${this.currentShareMenu.name} - 我的菜单集`,
            path: `/pages/selection/index?shareId=${this.shareId}`
        };
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.container {
    padding-bottom: 80rpx;
}

/* 头部卡片 */
.header-card {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, $primary-color, lighten($primary-color, 10%));
    border-radius: $card-radius;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-md;
    color: white;
}

.header-icon {
    width: 100rpx;
    height: 100rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-lg;
}

.header-image {
    width: 60rpx;
    height: 60rpx;
}

.header-content {
    flex: 1;
}

.header-title {
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
}

.header-desc {
    font-size: 26rpx;
    opacity: 0.85;
}

/* 分享设置 */
.share-settings {
    margin-bottom: $spacing-lg;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-md;
}

.form-group {
    margin-bottom: $spacing-lg;

    &:last-child {
        margin-bottom: 0;
    }
}

.form-label {
    font-size: 26rpx;
    color: $text-color-secondary;
    margin-bottom: $spacing-xs;
}

.form-input {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: $spacing-md;
    height: 88rpx;
    width: 100%;
    box-sizing: border-box;
    font-size: 28rpx;
    color: $text-color;
    border: 2rpx solid $border-color;
    @include transition-fast;

    &:focus {
        border-color: $primary-color;
        background-color: white;
    }
}

/* 菜单集选择器样式 */
.form-picker {
    width: 100%;
}

.picker-text {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 0 $spacing-md;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: $text-color;
    border: 2rpx solid $border-color;

    .icon-arrow {
        width: 32rpx;
        height: 32rpx;
        opacity: 0.5;
    }
}

/* 分享历史 */
.share-history {
    margin-bottom: $spacing-lg;
}

.history-list {
    border-radius: $input-radius;
    overflow: hidden;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md;
    border-bottom: 2rpx solid $divider-color;
    @include transition-fast;

    &:active {
        background-color: rgba($divider-color, 0.5);
    }

    &:last-child {
        border-bottom: none;
    }
}

.history-info {
    display: flex;
    flex-direction: column;
}

.history-name {
    font-size: 28rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: 4rpx;
}

.history-date {
    font-size: 24rpx;
    color: $text-color-light;
}

.history-meta {
    display: flex;
    align-items: center;
}

.history-count {
    font-size: 24rpx;
    color: $text-color-light;
    margin-right: $spacing-sm;
}

.icon-arrow {
    width: 32rpx;
    height: 32rpx;
    opacity: 0.3;
}

/* 分享弹窗 */
.share-panel-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.share-panel {
    width: 90%;
    max-width: 600rpx;
    background-color: $card-color;
    border-radius: $card-radius;
    box-shadow: $shadow-lg;
    z-index: 1000;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.9);
    @include transition-normal;

    &.panel-show {
        opacity: 1;
        transform: scale(1);
    }
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border-bottom: 2rpx solid $divider-color;
}

.panel-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
}

.panel-close {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: -16rpx;
    /* 添加负边距使点击区域更大 */
    background-color: rgba(0, 0, 0, 0.05);
    /* 添加背景色 */

    &:active {
        background-color: rgba(0, 0, 0, 0.1);
        /* 调整点击时的背景色 */
    }

    .close-icon {
        width: 32rpx;
        height: 32rpx;
        opacity: 0.6;
        /* 提高图标的不透明度 */
    }
}

.panel-content {
    padding: $spacing-lg;
}

.qrcode-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $spacing-lg;
}

.qrcode-box {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: $spacing-sm;
    border: 2rpx solid $divider-color;
    border-radius: $input-radius;
    overflow: hidden;
}

.qrcode-image {
    width: 100%;
    height: 100%;
}

.qrcode-tip {
    font-size: 24rpx;
    color: $text-color-light;
}

.share-menu-info {
    text-align: center;
    margin-bottom: $spacing-lg;
}

.share-menu-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 4rpx;
}

.share-menu-subtitle {
    font-size: 26rpx;
    color: $text-color-light;
}

.share-link-container {
    margin-bottom: $spacing-lg;
}

.share-link-box {
    display: flex;
    align-items: center;
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 0 $spacing-md;
    overflow: hidden;
    border: 2rpx solid $border-color;
}

.share-link {
    flex: 1;
    font-size: 24rpx;
    color: $text-color-light;
    padding: $spacing-md 0;
    @include ellipsis;
}

.copy-btn {
    padding: $spacing-sm $spacing-md;
    background-color: $primary-color;
    color: white;
    font-size: 24rpx;
    border-radius: 8rpx;
    margin-left: $spacing-sm;

    &:active {
        opacity: 0.9;
    }
}

.share-actions {
    display: flex;
    gap: $spacing-md;
}

.share-wechat-btn,
.save-image-btn {
    flex: 1;
    height: 88rpx;
    border-radius: $btn-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    position: relative;
    padding: 0;

    &:after {
        border: none;
    }
}

.share-wechat-btn {
    background-color: #07C160;
    color: white;
}

.save-image-btn {
    background-color: $primary-light;
    color: $primary-color;
}

.wechat-icon,
.save-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: $spacing-sm;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

/* 空状态 */
.empty-state {
    padding: $spacing-xl 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: $spacing-md;
    opacity: 0.7;
}

.empty-text {
    font-size: 28rpx;
    color: $text-color-light;
}

/* 移除菜品选择相关样式 */
.share-dish-list,
.share-dish-item,
.share-dish-checkbox,
.share-dish-thumb,
.share-dish-info,
.share-dish-name,
.share-dish-meta,
.share-dish-time,
.share-dish-difficulty {
    /* 移除这些样式 */
}
</style>
