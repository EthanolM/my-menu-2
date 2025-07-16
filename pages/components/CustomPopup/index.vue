<template>
    <u-popup :show="visible" :mode="mode" :position="position" :overlay="overlay" :closeable="closeable"
        :close-icon-pos="closeIconPos" :close-icon-size="closeIconSize" :close-icon-color="closeIconColor"
        :round="round" :custom-style="computedCustomStyle" :safe-area-inset-bottom="safeAreaInsetBottom"
        :safe-area-inset-top="safeAreaInsetTop" :duration="duration" :zoom="zoom" :mask-close-able="maskCloseAble"
        :negative-top="negativeTop" :z-index="zIndex" @close="handleClose" @open="handleOpen">
        <!-- 默认插槽，用于自定义内容 -->
        <slot></slot>

        <!-- 头部插槽 -->
        <template #header>
            <slot name="header"></slot>
        </template>

        <!-- 底部插槽 -->
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </u-popup>
</template>

<script>
export default {
    name: 'CustomPopup',
    props: {
        // 是否显示弹出层
        visible: {
            type: Boolean,
            default: false
        },
        // 弹出层模式，可选值：left、right、top、bottom、center
        mode: {
            type: String,
            default: 'bottom',
            validator: value => ['left', 'right', 'top', 'bottom', 'center'].includes(value)
        },
        // 弹出位置，可选值：top、bottom、left、right、center
        position: {
            type: String,
            default: 'bottom',
            validator: value => ['top', 'bottom', 'left', 'right', 'center'].includes(value)
        },
        // 是否显示遮罩层
        overlay: {
            type: Boolean,
            default: true
        },
        // 是否显示关闭图标
        closeable: {
            type: Boolean,
            default: true
        },
        // 关闭图标位置，可选值：top-left、top-right、bottom-left、bottom-right
        closeIconPos: {
            type: String,
            default: 'top-right',
            validator: value => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
        },
        // 关闭图标大小
        closeIconSize: {
            type: [String, Number],
            default: 30
        },
        // 关闭图标颜色
        closeIconColor: {
            type: String,
            default: '#909399'
        },
        // 是否圆角
        round: {
            type: [String, Number, Boolean],
            default: 20
        },
        // 自定义样式
        customStyle: {
            type: [String, Object],
            default: ''
        },
        // 是否适配底部安全区
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        },
        // 是否适配顶部安全区
        safeAreaInsetTop: {
            type: Boolean,
            default: false
        },
        // 动画时长
        duration: {
            type: [String, Number],
            default: 300
        },
        // 是否缩放
        zoom: {
            type: Boolean,
            default: true
        },
        // 点击遮罩是否关闭
        maskCloseAble: {
            type: Boolean,
            default: true
        },
        // 负边距
        negativeTop: {
            type: [String, Number],
            default: 0
        },
        // 层级
        zIndex: {
            type: [String, Number],
            default: 10075
        },
        // 是否自动设置满屏尺寸
        autoFullScreen: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        // 计算最终的样式
        computedCustomStyle() {
            let style = this.customStyle;

            // 如果启用自动满屏，根据模式设置尺寸
            if (this.autoFullScreen) {
                const fullScreenStyle = this.getFullScreenStyle();
                if (typeof style === 'string') {
                    style = `${style}; ${fullScreenStyle}`;
                } else if (typeof style === 'object') {
                    style = { ...style, ...fullScreenStyle };
                } else {
                    style = fullScreenStyle;
                }
            }

            return style;
        }
    },
    emits: ['close', 'open', 'update:visible'],
    methods: {
        // 根据弹出方向获取满屏样式
        getFullScreenStyle() {
            const isVertical = ['top', 'bottom'].includes(this.mode);
            const isHorizontal = ['left', 'right'].includes(this.mode);

            if (isVertical) {
                // 从上或下弹出：满屏宽度
                return {
                    width: '100vw',
                    maxWidth: '100vw'
                };
            } else if (isHorizontal) {
                // 从左或右弹出：满屏高度
                return {
                    height: '100vh',
                    maxHeight: '100vh'
                };
            } else {
                // center模式：不设置满屏
                return {};
            }
        },

        // 关闭弹出层
        handleClose() {
            this.$emit('close');
            this.$emit('update:visible', false);
        },

        // 打开弹出层
        handleOpen() {
            this.$emit('open');
        }
    }
};
</script>

<style lang="scss" scoped>
// 可以在这里添加自定义样式</style>