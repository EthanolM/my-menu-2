<template>
    <view class="drag-example">
        <view class="header">
            <text class="title">拖拽排序示例</text>
            <view class="toggle-btn" @tap="toggleEditMode">
                <text>{{ isEditMode ? '完成' : '编辑' }}</text>
            </view>
        </view>

        <view class="drag-container">
            <view v-for="(item, index) in items" :key="item.id" class="drag-item"
                :class="{ 'active': dragIndex === index, 'edit-mode': isEditMode }" :style="getPositionStyle(index)"
                @touchstart="onDragStart(index, $event, isEditMode)" @touchmove.stop.prevent="onDragMove($event)"
                @touchend="onDragEnd(items, handleOrderChange)">
                <view class="item-content">
                    <text class="item-name">{{ item.name }}</text>
                    <text class="item-desc">{{ item.description }}</text>
                </view>

                <!-- 拖拽手柄 -->
                <view v-if="isEditMode" class="drag-handle">
                    <text class="drag-icon">⋮⋮</text>
                </view>
            </view>
        </view>

        <view class="info">
            <text class="info-text">当前顺序: {{items.map(item => item.name).join(' → ')}}</text>
        </view>
    </view>
</template>

<script>
import dragSortMixin from '@/common/mixins/dragSortMixin.js';

export default {
    name: 'DragSortExample',
    mixins: [dragSortMixin],
    data() {
        return {
            isEditMode: false,
            items: [
                { id: '1', name: '项目一', description: '这是第一个项目' },
                { id: '2', name: '项目二', description: '这是第二个项目' },
                { id: '3', name: '项目三', description: '这是第三个项目' },
                { id: '4', name: '项目四', description: '这是第四个项目' },
                { id: '5', name: '项目五', description: '这是第五个项目' }
            ]
        };
    },
    mounted() {
        // 初始化拖拽配置
        this.initDragConfig({
            itemHeight: 80,
            gap: 12,
            enableVibration: true,
            enableScale: true,
            scaleValue: 1.05
        });

        // 初始化位置数组
        this.initPositions(this.items);
    },
    methods: {
        toggleEditMode() {
            this.isEditMode = !this.isEditMode;
        },

        handleOrderChange(newOrder) {
            this.items = newOrder;
            console.log('顺序已更新:', newOrder.map(item => item.name));
        }
    }
};
</script>

<style scoped>
.drag-example {
    padding: 20rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
}

.title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

.toggle-btn {
    padding: 16rpx 32rpx;
    background-color: #007AFF;
    border-radius: 8rpx;
}

.toggle-btn text {
    color: #fff;
    font-size: 28rpx;
}

.drag-container {
    position: relative;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    min-height: 600rpx;
}

.drag-item {
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    transition: transform 0.3s;
    will-change: transform;
    background-color: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 12rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.drag-item.active {
    transition: none;
    z-index: 10;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.drag-item.edit-mode {
    border-color: #007AFF;
    background-color: #f0f8ff;
}

.item-content {
    flex: 1;
}

.item-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
}

.item-desc {
    font-size: 26rpx;
    color: #666;
    display: block;
}

.drag-handle {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 122, 255, 0.1);
    border-radius: 8rpx;
    margin-left: 20rpx;
}

.drag-icon {
    font-size: 24rpx;
    color: #007AFF;
}

.info {
    margin-top: 30rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
}

.info-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.5;
}
</style>