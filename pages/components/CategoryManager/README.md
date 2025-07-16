# CategoryNav 分类导航组件

## 功能简介

`CategoryNav` 是一个可复用的分类导航组件，支持：
- 分类列表展示
- 点击分类进行跳转
- 编辑模式下删除分类、拖拽调整分类顺序

## 技术实现

本组件使用了 `dragSortMixin` 来实现拖拽排序功能，这是一个可复用的拖拽排序 mixin，提供了完整的拖拽逻辑。

### 拖拽功能特性

- ✅ 垂直拖拽排序
- ✅ 平滑的动画效果
- ✅ 震动反馈
- ✅ 缩放效果
- ✅ 自动网格对齐
- ✅ 可配置的参数

## Props

| 属性名            | 类型    | 说明                 |
|-------------------|---------|----------------------|
| categoryOrder     | Array   | 分类名称数组         |
| currentCategory   | String  | 当前选中的分类名称   |
| isEditMode        | Boolean | 是否为编辑模式       |

## 事件

| 事件名                | 说明                         | 回调参数         |
|-----------------------|------------------------------|------------------|
| select-category       | 选中某个分类时触发           | categoryName     |
| delete-category       | 删除某个分类时触发           | categoryName     |
| toggle-edit-mode      | 长按切换编辑模式时触发       | 无               |
| update-category-order | 拖拽排序后分类顺序变化时触发 | 新的分类顺序数组 |

## 用法示例

```vue
<template>
  <CategoryNav
    :category-order="categoryOrder"
    :current-category="currentCategory"
    :is-edit-mode="isEditMode"
    @select-category="selectCategory"
    @delete-category="deleteCategory"
    @toggle-edit-mode="toggleEditMode"
    @update-category-order="updateCategoryOrder"
  />
</template>

<script>
export default {
  methods: {
    updateCategoryOrder(newOrder) {
      this.categoryOrder = newOrder;
      // 同步到数据服务
      this.saveCategoryOrder(newOrder);
    }
  }
}
</script>
```

## 依赖

- `dragSortMixin` - 拖拽排序功能 mixin

## 样式要求

组件需要以下样式支持：

```scss
.category-nav {
    position: relative;
    height: 100%;
}

.category-item {
    position: absolute;
    left: 0;
    width: 100%;
    transition: transform 0.3s;
    will-change: transform;
}
```

## 注意事项

- 分类名称建议唯一
- 拖拽功能仅在编辑模式下启用
- 组件会自动处理拖拽动画和位置计算
- 支持震动反馈（如果设备支持）

## 相关文件

- `dragSortMixin.js` - 拖拽排序 mixin
- `DragSortExample.vue` - 使用示例组件 