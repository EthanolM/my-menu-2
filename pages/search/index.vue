<template>
    <view class="container">
        <!-- 搜索栏 -->
        <view class="search-header">
            <view class="search-input">
                <uv-icon class="icon search-icon" name="search" size="28"></uv-icon>
                <input type="text" v-model="searchKey" placeholder="搜索菜品名称、标签或描述..." @input="searchDishes" focus="true"
                    confirm-type="search" />
                <view v-if="searchKey" class="clear-btn" @click="clearSearch">
                    <text class="icon-close">×</text>
                </view>
            </view>
            <view class="cancel-btn" @tap="goBack">取消</view>
        </view>

        <!-- 搜索结果 -->
        <view class="search-results" v-if="searchResults.length > 0">
            <view class="result-title">搜索结果 ({{ searchResults.length }})</view>
            <view class="dish-list">
                <view class="dish-item" v-for="(dish, index) in searchResults" :key="dish.id"
                    @tap="navigateToDishDetail(dish.id)">
                    <image class="dish-image" :src="dish.image" mode="aspectFill"></image>
                    <view class="dish-info">
                        <text class="dish-name">{{ dish.name }}</text>
                        <!-- 菜品标签 -->
                        <view class="dish-tags">
                            <text class="tag" v-for="(tag, tagIndex) in dish.tags" :key="tagIndex">{{ tag }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 搜索提示 -->
        <view class="search-tips" v-else-if="!searchKey">
            <view class="tip-title">搜索提示</view>
            <view class="tip-item">
                <text>· 输入菜品名称、食材或标签进行搜索</text>
            </view>
            <view class="tip-item">
                <text>· 可以搜索菜品描述中的关键词</text>
            </view>
            <view class="tip-item">
                <text>· 例如：搜索"家常"可以找到家常菜</text>
            </view>
        </view>

        <!-- 无搜索结果 -->
        <view class="no-result" v-else>
            <image src="/static/images/empty.png" mode="aspectFit" class="empty-image"></image>
            <text class="no-result-text">没有找到相关菜品</text>
            <text class="no-result-tip">换个关键词试试吧</text>
        </view>
    </view>
</template>

<script>
import { dishService, menuSetService } from '@/services/dataService.js';

export default {
    data() {
        return {
            searchKey: '',
            searchResults: [],
            allDishes: [] // 所有菜品数据
        };
    },
    onLoad() {
        // 加载所有菜品数据
        this.loadAllDishes();
    },
    methods: {
        // 加载所有菜品
        loadAllDishes() {
            // 获取当前菜单集下的菜品
            const currentMenuSetId = menuSetService.getCurrentMenuSetId();
            this.allDishes = menuSetService.getDishesInMenuSet(currentMenuSetId);
        },

        // 搜索菜品
        searchDishes() {
            if (!this.searchKey.trim()) {
                this.searchResults = [];
                return;
            }

            const keyword = this.searchKey.toLowerCase().trim();
            this.searchResults = this.allDishes.filter(dish =>
                dish.name.toLowerCase().includes(keyword) ||
                dish.description.toLowerCase().includes(keyword) ||
                (dish.tags && dish.tags.some(tag => tag.toLowerCase().includes(keyword)))
            );
        },

        // 清除搜索
        clearSearch() {
            this.searchKey = '';
            this.searchResults = [];
        },

        // 导航到菜品详情
        navigateToDishDetail(id) {
            uni.navigateTo({
                url: `/pages/dish/detail?id=${id}`
            });
        },

        // 返回上一页
        goBack() {
            uni.navigateBack();
        }
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.container {
    padding-top: 0;
    padding-bottom: $spacing-xl;
}

/* 搜索栏样式 */
.search-header {
    display: flex;
    align-items: center;
    padding: 20rpx $container-padding;
    background-color: #FFFFFF;
    border-bottom: 2rpx solid $divider-color;
    position: sticky;
    top: 0;
    z-index: 100;
}

.search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: $background-color;
    border-radius: 100rpx;
    padding: 12rpx 24rpx;
    height: 72rpx;

    input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
        color: $text-color;
        margin-left: $spacing-sm;
    }

    .search-icon {
        opacity: 0.6;
    }

    .clear-btn {
        padding: 0 $spacing-xs;

        .icon-close {
            font-size: 40rpx;
            color: $text-color-lighter;
            line-height: 1;
        }
    }
}

.cancel-btn {
    padding: 0 $spacing-md;
    font-size: 28rpx;
    color: $text-color;
}

/* 搜索结果样式 */
.search-results {
    padding: $spacing-lg $container-padding;
}

.result-title {
    font-size: 28rpx;
    color: $text-color-secondary;
    margin-bottom: $spacing-lg;
}

.dish-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.dish-item {
    display: flex;
    background-color: $card-color;
    border-radius: $card-radius;
    overflow: hidden;
    box-shadow: $shadow-sm;

    .dish-image {
        width: 160rpx;
        height: 160rpx;
    }

    .dish-info {
        flex: 1;
        padding: $spacing-md;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .dish-name {
        font-size: 28rpx;
        font-weight: 600;
        color: $text-color;
        margin-bottom: $spacing-xs;
    }
}

.dish-tags {
    display: flex;
    flex-wrap: wrap;

    .tag {
        font-size: 22rpx;
        padding: 2rpx 12rpx;
        background-color: rgba(#F3F4F6, 0.8);
        color: $text-color-secondary;
        border-radius: 20rpx;
        margin-right: $spacing-xs;
        margin-bottom: $spacing-xs;
    }
}

/* 搜索提示样式 */
.search-tips {
    padding: $spacing-xl $container-padding;
    color: $text-color-light;
}

.tip-title {
    font-size: 28rpx;
    margin-bottom: $spacing-lg;
}

.tip-item {
    font-size: 26rpx;
    margin-bottom: $spacing-md;
    padding-left: $spacing-md;
}

/* 无结果样式 */
.no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 30vh;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: $spacing-lg;
    opacity: 0.5;
}

.no-result-text {
    font-size: 30rpx;
    color: $text-color;
    margin-bottom: $spacing-sm;
}

.no-result-tip {
    font-size: 26rpx;
    color: $text-color-light;
}
</style>