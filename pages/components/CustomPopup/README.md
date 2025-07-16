# CustomPopup 弹出层组件

一个基于 uview-plus 的可复用弹出层组件，支持多种弹出方向和自定义内容。**默认自动设置为满屏尺寸**。

## ✨ 新特性

- **自动满屏**：根据弹出方向自动设置满屏宽度或高度
- **智能尺寸**：从上/下弹出时满屏宽度，从左/右弹出时满屏高度
- **可控制**：支持 `autoFullScreen` 属性控制是否启用自动满屏

## 基本用法

```vue
<template>
  <view>
    <!-- 触发按钮 -->
    <u-button @click="showPopup = true">打开弹出层</u-button>
    
    <!-- 弹出层组件 - 默认自动满屏 -->
    <CustomPopup 
      v-model:visible="showPopup"
      mode="bottom"
      :closeable="true"
      @close="handleClose"
    >
      <!-- 自定义内容 -->
      <view class="popup-content">
        <text>这是弹出层的内容</text>
      </view>
    </CustomPopup>
  </view>
</template>

<script>
import CustomPopup from '@/pages/components/CustomPopup/index.vue'

export default {
  components: {
    CustomPopup
  },
  data() {
    return {
      showPopup: false
    }
  },
  methods: {
    handleClose() {
      console.log('弹出层已关闭')
    }
  }
}
</script>
```

## 满屏功能说明

### 自动满屏（默认）
```vue
<!-- 从上或下弹出：自动满屏宽度 -->
<CustomPopup mode="bottom" v-model:visible="showBottom">
  <view>内容</view>
</CustomPopup>

<CustomPopup mode="top" v-model:visible="showTop">
  <view>内容</view>
</CustomPopup>

<!-- 从左或右弹出：自动满屏高度 -->
<CustomPopup mode="left" v-model:visible="showLeft">
  <view>内容</view>
</CustomPopup>

<CustomPopup mode="right" v-model:visible="showRight">
  <view>内容</view>
</CustomPopup>
```

### 禁用自动满屏
```vue
<!-- 禁用自动满屏，使用自定义尺寸 -->
<CustomPopup 
  v-model:visible="showPopup"
  mode="bottom"
  :auto-full-screen="false"
  :custom-style="{ width: '80vw', height: '60vh' }"
>
  <view>自定义尺寸的内容</view>
</CustomPopup>
```

## 使用插槽

```vue
<template>
  <CustomPopup v-model:visible="showPopup" mode="center">
    <!-- 头部插槽 -->
    <template #header>
      <view class="popup-header">
        <text class="title">标题</text>
      </view>
    </template>
    
    <!-- 默认插槽 -->
    <view class="popup-body">
      <text>主要内容</text>
    </view>
    
    <!-- 底部插槽 -->
    <template #footer>
      <view class="popup-footer">
        <u-button @click="showPopup = false">确定</u-button>
      </view>
    </template>
  </CustomPopup>
</template>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 是否显示弹出层 |
| mode | String | 'bottom' | 弹出层模式：left、right、top、bottom、center |
| position | String | 'bottom' | 弹出位置：top、bottom、left、right、center |
| overlay | Boolean | true | 是否显示遮罩层 |
| closeable | Boolean | false | 是否显示关闭图标 |
| closeIconPos | String | 'top-right' | 关闭图标位置 |
| closeIconSize | String/Number | 30 | 关闭图标大小 |
| closeIconColor | String | '#909399' | 关闭图标颜色 |
| round | String/Number/Boolean | 10 | 是否圆角 |
| customStyle | String/Object | '' | 自定义样式 |
| safeAreaInsetBottom | Boolean | true | 是否适配底部安全区 |
| safeAreaInsetTop | Boolean | false | 是否适配顶部安全区 |
| duration | String/Number | 300 | 动画时长 |
| zoom | Boolean | true | 是否缩放 |
| maskCloseAble | Boolean | true | 点击遮罩是否关闭 |
| negativeTop | String/Number | 0 | 负边距 |
| zIndex | String/Number | 10075 | 层级 |
| **autoFullScreen** | **Boolean** | **true** | **是否自动设置满屏尺寸** |

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 关闭弹出层时触发 | - |
| open | 打开弹出层时触发 | - |
| update:visible | 更新显示状态时触发 | (value: Boolean) |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 默认插槽，用于自定义主要内容 |
| header | 头部插槽 |
| footer | 底部插槽 |

## 常见使用场景

### 1. 底部弹出菜单（满屏宽度）
```vue
<CustomPopup v-model:visible="showMenu" mode="bottom" :round="20">
  <view class="menu-list">
    <view class="menu-item" v-for="item in menuItems" :key="item.id">
      {{ item.name }}
    </view>
  </view>
</CustomPopup>
```

### 2. 居中弹窗（保持原有尺寸）
```vue
<CustomPopup v-model:visible="showDialog" mode="center" :closeable="true">
  <view class="dialog-content">
    <text class="dialog-title">确认删除？</text>
    <view class="dialog-actions">
      <u-button @click="showDialog = false">取消</u-button>
      <u-button type="primary" @click="confirmDelete">确定</u-button>
    </view>
  </view>
</CustomPopup>
```

### 3. 侧边栏（满屏高度）
```vue
<CustomPopup v-model:visible="showSidebar" mode="left" :overlay="true">
  <view class="sidebar-content">
    <view class="sidebar-header">
      <text>侧边栏</text>
    </view>
    <view class="sidebar-body">
      <!-- 侧边栏内容 -->
    </view>
  </view>
</CustomPopup>
```

### 4. 自定义尺寸（禁用自动满屏）
```vue
<CustomPopup 
  v-model:visible="showCustom"
  mode="bottom"
  :auto-full-screen="false"
  :custom-style="{ 
    width: '90vw', 
    height: '50vh',
    borderRadius: '20rpx 20rpx 0 0'
  }"
>
  <view class="custom-content">
    <text>自定义尺寸的弹出层</text>
  </view>
</CustomPopup>
```

## 满屏尺寸规则

| 弹出方向 | 自动设置的尺寸 | 说明 |
|----------|----------------|------|
| `top` | `width: 100vw` | 满屏宽度 |
| `bottom` | `width: 100vw` | 满屏宽度 |
| `left` | `height: 100vh` | 满屏高度 |
| `right` | `height: 100vh` | 满屏高度 |
| `center` | 无 | 保持原有尺寸 |

## 样式优先级

1. **autoFullScreen 样式**（如果启用）
2. **customStyle 样式**（用户自定义）
3. **组件默认样式**

这样可以确保用户的自定义样式能够覆盖自动满屏的样式。 