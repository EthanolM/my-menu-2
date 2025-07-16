<template>
    <scroll-view class="category-nav" scroll-y="true">
        <view v-for="(category, index) in localCategoryOrder" :key="category" class="category-item"
            :class="{ 'active': dragIndex === index, 'edit-mode': isEditMode }" :style="getPositionStyle(index)"
            @touchstart="onDragStart(index, $event, isEditMode)" @touchmove.stop.prevent="onDragMove($event)"
            @touchend="onDragEnd(localCategoryOrder, handleOrderChange)">
            <!-- 分类信息 -->
            <view class="category-info">
                <text class="category-name">{{ category }}</text>
            </view>
            <!-- 编辑模式操作按钮 -->
            <view class="category-actions" v-if="isEditMode">
                <view class="drag-handle">
                    <text class="drag-icon">⋮⋮</text>
                </view>
                <view class="delete-btn" @tap.stop="deleteCategory(category)">
                    <text class="delete-icon">🗑️</text>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script>
import dragSortMixin from '@/common/mixins/dragSortMixin.js';

export default {
    name: 'CategoryNav',
    mixins: [dragSortMixin],
    props: {
        categoryOrder: {
            type: Array,
            required: true
        },
        currentCategory: {
            type: String,
            default: null
        },
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    emits: ['select-category', 'delete-category', 'toggle-edit-mode', 'update-category-order'],
    data() {
        return {
            localCategoryOrder: [...this.categoryOrder]
        };
    },
    watch: {
        categoryOrder(newVal) {
            this.localCategoryOrder = [...newVal];
            this.$nextTick(() => {
                this.initPositions(this.localCategoryOrder);
            });
        }
    },
    mounted() {
        this.initPositions(this.localCategoryOrder);
    },
    methods: {
        selectCategory(category) {
            this.$emit('select-category', category);
        },
        deleteCategory(category) {
            this.$emit('delete-category', category);
        },
        toggleEditMode() {
            this.$emit('toggle-edit-mode');
        },
        handleOrderChange(newOrder) {
            this.localCategoryOrder = newOrder;
            this.$emit('update-category-order', newOrder);
        }
    }
};
</script>

<style scoped>
.category-nav {
    width: 180rpx;
    height: 100%;
    background-color: #f5f5f5;
    border-right: 1px solid #eee;
    position: relative;
}

.category-item {
    position: absolute;
    left: 0;
    width: 100%;
    transition: transform 0.3s;
    will-change: transform;
    padding: 30rpx 20rpx;
    text-align: center;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    box-sizing: border-box;
}

.category-item.active {
    transition: none;
    transform: scale(1.05);
    z-index: 10;
}

.category-item.edit-mode {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 20rpx;
    border: 2rpx solid #ff9500;
    border-radius: 12rpx;
    margin: 8rpx 16rpx;
    background-color: #fff7e6;
}

.category-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    flex: 1;
}

.category-name {
    font-size: 32rpx;
    line-height: 1.2;
    word-break: break-all;
    font-weight: 600;
}

.category-actions {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.drag-handle {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8rpx;
    cursor: grab;
}

.drag-icon {
    font-size: 20rpx;
    color: #bbb;
}

.delete-btn {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FEE2E2;
    border-radius: 8rpx;
}

.delete-icon {
    font-size: 20rpx;
}
</style>