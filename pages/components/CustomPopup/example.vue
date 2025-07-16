<template>
    <view class="example-container">
        <!-- 示例按钮 -->
        <view class="button-group">
            <u-button @click="showBottomPopup = true" type="primary">底部弹出（满屏宽度）</u-button>
            <u-button @click="showTopPopup = true" type="success">顶部弹出（满屏宽度）</u-button>
            <u-button @click="showLeftPopup = true" type="warning">左侧弹出（满屏高度）</u-button>
            <u-button @click="showRightPopup = true" type="error">右侧弹出（满屏高度）</u-button>
            <u-button @click="showCenterPopup = true" type="info">居中弹窗（自定义尺寸）</u-button>
            <u-button @click="showCustomPopup = true" type="warning">自定义尺寸</u-button>
        </view>

        <!-- 底部弹出层（满屏宽度） -->
        <CustomPopup v-model:visible="showBottomPopup" mode="bottom" :round="20" :closeable="true" @close="handleClose">
            <view class="popup-content bottom-popup">
                <view class="popup-header">
                    <text class="popup-title">底部弹出菜单（满屏宽度）</text>
                </view>
                <view class="popup-body">
                    <view class="menu-item" v-for="item in menuItems" :key="item.id" @click="selectMenuItem(item)">
                        <text class="menu-text">{{ item.name }}</text>
                        <text class="menu-desc">{{ item.desc }}</text>
                    </view>
                </view>
            </view>
        </CustomPopup>

        <!-- 顶部弹出层（满屏宽度） -->
        <CustomPopup v-model:visible="showTopPopup" mode="top" :round="20" :closeable="true" @close="handleClose">
            <view class="popup-content top-popup">
                <view class="popup-header">
                    <text class="popup-title">顶部通知栏（满屏宽度）</text>
                </view>
                <view class="popup-body">
                    <text class="notification-text">这是一条重要的通知信息，显示在屏幕顶部</text>
                </view>
            </view>
        </CustomPopup>

        <!-- 左侧弹出层（满屏高度） -->
        <CustomPopup v-model:visible="showLeftPopup" mode="left" :closeable="true" @close="handleClose">
            <view class="popup-content left-popup">
                <view class="sidebar-header">
                    <text class="sidebar-title">侧边栏（满屏高度）</text>
                </view>
                <view class="sidebar-body">
                    <view class="sidebar-item" v-for="item in sidebarItems" :key="item.id">
                        <text class="sidebar-text">{{ item.name }}</text>
                    </view>
                </view>
            </view>
        </CustomPopup>

        <!-- 右侧弹出层（满屏高度） -->
        <CustomPopup v-model:visible="showRightPopup" mode="right" :closeable="true" @close="handleClose">
            <view class="popup-content right-popup">
                <view class="sidebar-header">
                    <text class="sidebar-title">设置面板（满屏高度）</text>
                </view>
                <view class="sidebar-body">
                    <view class="setting-item" v-for="setting in settings" :key="setting.id">
                        <text class="setting-label">{{ setting.label }}</text>
                        <u-switch v-model="setting.value" @change="handleSettingChange(setting)"></u-switch>
                    </view>
                </view>
            </view>
        </CustomPopup>

        <!-- 居中弹窗（保持原有尺寸） -->
        <CustomPopup v-model:visible="showCenterPopup" mode="center" :closeable="true" :mask-close-able="false"
            @close="handleClose">
            <view class="popup-content center-popup">
                <view class="dialog-header">
                    <text class="dialog-title">确认操作</text>
                </view>
                <view class="dialog-body">
                    <text class="dialog-message">确定要执行此操作吗？</text>
                </view>
                <view class="dialog-footer">
                    <u-button @click="showCenterPopup = false" size="small">取消</u-button>
                    <u-button @click="confirmAction" type="primary" size="small">确定</u-button>
                </view>
            </view>
        </CustomPopup>

        <!-- 自定义尺寸弹出层 -->
        <CustomPopup v-model:visible="showCustomPopup" mode="bottom" :auto-full-screen="false" :custom-style="{
            width: '90vw',
            height: '60vh',
            borderRadius: '20rpx 20rpx 0 0',
            margin: '0 auto'
        }" :closeable="true" @close="handleClose">
            <view class="popup-content custom-popup">
                <view class="popup-header">
                    <text class="popup-title">自定义尺寸弹出层</text>
                </view>
                <view class="popup-body">
                    <text class="custom-text">这个弹出层使用了自定义尺寸，宽度90vw，高度60vh</text>
                    <view class="custom-features">
                        <text class="feature-item">• 禁用自动满屏</text>
                        <text class="feature-item">• 自定义宽度和高度</text>
                        <text class="feature-item">• 自定义圆角样式</text>
                    </view>
                </view>
            </view>
        </CustomPopup>
    </view>
</template>

<script>
import CustomPopup from './index.vue'

export default {
    name: 'CustomPopupExample',
    components: {
        CustomPopup
    },
    data() {
        return {
            showBottomPopup: false,
            showTopPopup: false,
            showLeftPopup: false,
            showRightPopup: false,
            showCenterPopup: false,
            showCustomPopup: false,
            menuItems: [
                { id: 1, name: '添加菜品', desc: '创建新的菜品' },
                { id: 2, name: '导入菜单', desc: '从文件导入菜单' },
                { id: 3, name: '分享菜单', desc: '分享给朋友' },
                { id: 4, name: '设置', desc: '应用设置' }
            ],
            sidebarItems: [
                { id: 1, name: '首页' },
                { id: 2, name: '菜品管理' },
                { id: 3, name: '食材管理' },
                { id: 4, name: '菜单集' },
                { id: 5, name: '关于' }
            ],
            settings: [
                { id: 1, label: '自动保存', value: true },
                { id: 2, label: '推送通知', value: false },
                { id: 3, label: '深色模式', value: false },
                { id: 4, label: '声音提醒', value: true }
            ]
        }
    },
    methods: {
        handleClose() {
            console.log('弹出层已关闭')
        },
        selectMenuItem(item) {
            uni.showToast({
                title: `选择了: ${item.name}`,
                icon: 'success'
            })
            this.showBottomPopup = false
        },
        confirmAction() {
            uni.showToast({
                title: '操作已确认',
                icon: 'success'
            })
            this.showCenterPopup = false
        },
        handleSettingChange(setting) {
            console.log(`${setting.label} 设置已更改:`, setting.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.example-container {
    padding: 40rpx;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-bottom: 40rpx;
}

.popup-content {
    background-color: #fff;
}

.bottom-popup {
    min-height: 400rpx;
    padding: 40rpx;

    .popup-header {
        text-align: center;
        margin-bottom: 30rpx;

        .popup-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;
        }
    }

    .popup-body {
        .menu-item {
            padding: 30rpx 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
                border-bottom: none;
            }

            .menu-text {
                font-size: 28rpx;
                color: #333;
                display: block;
                margin-bottom: 8rpx;
            }

            .menu-desc {
                font-size: 24rpx;
                color: #999;
            }
        }
    }
}

.top-popup {
    min-height: 200rpx;
    padding: 40rpx;

    .popup-header {
        text-align: center;
        margin-bottom: 20rpx;

        .popup-title {
            font-size: 28rpx;
            font-weight: 600;
            color: #333;
        }
    }

    .popup-body {
        .notification-text {
            font-size: 26rpx;
            color: #666;
            line-height: 1.5;
        }
    }
}

.left-popup,
.right-popup {
    width: 500rpx;
    height: 100vh;

    .sidebar-header {
        padding: 40rpx 30rpx;
        border-bottom: 1px solid #f0f0f0;
        background-color: #f8f9fa;

        .sidebar-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;
        }
    }

    .sidebar-body {
        padding: 20rpx 0;

        .sidebar-item,
        .setting-item {
            padding: 30rpx;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &:last-child {
                border-bottom: none;
            }

            .sidebar-text,
            .setting-label {
                font-size: 28rpx;
                color: #333;
            }
        }
    }
}

.center-popup {
    width: 600rpx;
    padding: 40rpx;
    border-radius: 20rpx;

    .dialog-header {
        text-align: center;
        margin-bottom: 30rpx;

        .dialog-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;
        }
    }

    .dialog-body {
        text-align: center;
        margin-bottom: 40rpx;

        .dialog-message {
            font-size: 28rpx;
            color: #666;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: space-around;
        gap: 20rpx;
    }
}

.custom-popup {
    padding: 40rpx;

    .popup-header {
        text-align: center;
        margin-bottom: 30rpx;

        .popup-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;
        }
    }

    .popup-body {
        .custom-text {
            font-size: 28rpx;
            color: #666;
            line-height: 1.5;
            margin-bottom: 30rpx;
            display: block;
        }

        .custom-features {
            .feature-item {
                font-size: 26rpx;
                color: #999;
                line-height: 1.8;
                display: block;
            }
        }
    }
}
</style>