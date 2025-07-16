# Mixins 说明文档

## dragSortMixin - 拖拽排序 Mixin

`dragSortMixin` 是一个可复用的拖拽排序功能 mixin，提供了完整的拖拽排序逻辑，可以在任何需要拖拽排序的组件中使用。

### 功能特性

- ✅ 垂直拖拽排序
- ✅ 平滑的动画效果
- ✅ 震动反馈
- ✅ 缩放效果
- ✅ 可配置的参数
- ✅ 事件回调
- ✅ 自动网格对齐

### 使用方法

#### 1. 引入 mixin

```javascript
import dragSortMixin from '@/common/mixins/dragSortMixin.js';

export default {
    mixins: [dragSortMixin],
    // ... 其他配置
};
```

#### 2. 初始化配置

```javascript
mounted() {
    // 可选：自定义配置
    this.initDragConfig({
        itemHeight: 80, // 项目高度
        gap: 15, // 项目间距
        enableVibration: true, // 启用震动
        enableScale: true, // 启用缩放
        scaleValue: 1.1 // 缩放值
    });
    
    // 初始化位置数组
    this.initPositions(this.items);
}
```

#### 3. 在模板中使用

```vue
<template>
    <view class="drag-container">
        <view 
            v-for="(item, index) in items" 
            :key="item.id"
            class="drag-item"
            :class="{ 'active': dragIndex === index, 'edit-mode': isEditMode }"
            :style="getPositionStyle(index)"
            @touchstart="onDragStart(index, $event, isEditMode)"
            @touchmove.stop.prevent="onDragMove($event)"
            @touchend="onDragEnd(items, handleOrderChange)"
        >
            <!-- 项目内容 -->
            <text>{{ item.name }}</text>
            
            <!-- 拖拽手柄 -->
            <view v-if="isEditMode" class="drag-handle">
                <text>⋮⋮</text>
            </view>
        </view>
    </view>
</template>
```

#### 4. 处理顺序变化

```javascript
methods: {
    handleOrderChange(newOrder) {
        // 处理顺序变化
        this.items = newOrder;
        this.$emit('order-changed', newOrder);
    }
}
```

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| itemHeight | Number | 70 | 每个项目的高度（px） |
| gap | Number | 10 | 项目间距（px） |
| enableVibration | Boolean | true | 是否启用震动反馈 |
| enableScale | Boolean | true | 是否启用缩放效果 |
| scaleValue | Number | 1.05 | 缩放值 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| drag-start | { index, event } | 拖拽开始 |
| drag-move | { event, deltaY } | 拖拽移动 |
| drag-end | { newOrder } | 拖拽结束 |

### 方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| initDragConfig | config | 初始化拖拽配置 |
| initPositions | items | 初始化位置数组 |
| getPositionStyle | index | 获取项目位置样式 |
| onDragStart | index, event, isEditMode | 拖拽开始事件 |
| onDragMove | event | 拖拽移动事件 |
| onDragEnd | items, onOrderChange | 拖拽结束事件 |
| resetDragState | - | 重置拖拽状态 |

### 样式要求

使用此 mixin 的组件需要确保：

1. 容器使用相对定位：`position: relative`
2. 项目使用绝对定位：`position: absolute`
3. 项目设置 `will-change: transform` 以优化性能
4. 项目设置适当的 `transition` 以实现平滑动画

### 示例样式

```scss
.drag-container {
    position: relative;
    height: 100%;
    overflow: hidden;
}

.drag-item {
    position: absolute;
    left: 0;
    width: 100%;
    transition: transform 0.3s;
    will-change: transform;
    
    &.active {
        transition: none;
        z-index: 10;
    }
}
```

### 注意事项

1. 确保在 `mounted` 或 `updated` 生命周期中调用 `initPositions`
2. 拖拽事件需要阻止默认行为：`@touchmove.stop.prevent`
3. 编辑模式控制拖拽是否启用
4. 顺序变化回调函数是必需的

### 迁移指南

如果要从现有的拖拽逻辑迁移到此 mixin：

1. 移除原有的拖拽相关 data 属性
2. 移除原有的拖拽相关方法
3. 引入此 mixin
4. 按照上述步骤配置和使用
5. 调整样式以符合要求 