<template>
    <view class="container">
        <view class="page-title">创建菜单集</view>

        <view class="form-section">
            <view class="form-group">
                <view class="form-label required">菜单集名称</view>
                <input type="text" v-model="menuSetName" placeholder="请输入菜单集名称" class="form-input" maxlength="20" />
            </view>

            <view class="form-tip">
                创建后你可以为这个菜单集添加专属的菜品和食材。
            </view>
        </view>

        <view class="action-bar">
            <view class="btn outline" @tap="goBack">取消</view>
            <view class="btn primary" :class="{ disabled: isCreating }" @tap="createMenuSet">
                {{ isCreating ? '创建中...' : '创建菜单集' }}
            </view>
        </view>
    </view>
</template>

<script>
import { menuSetService } from '@/services/dataService.js';

export default {
    data() {
        return {
            menuSetName: '', // 菜单集名称
            isCreating: false // 是否正在创建中，用于防止重复提交
        };
    },
    methods: {
        /**
         * 返回上一页
         */
        goBack() {
            uni.navigateBack();
        },

        /**
         * 创建菜单集
         * 1. 验证表单数据
         * 2. 设置创建状态，防止重复提交
         * 3. 调用服务创建菜单集
         * 4. 根据结果显示提示并处理跳转
         */
        createMenuSet() {
            // 防止重复提交
            if (this.isCreating) return;

            // 表单验证
            if (!this.menuSetName.trim()) {
                uni.showToast({
                    title: '请输入菜单集名称',
                    icon: 'none'
                });
                return;
            }

            // 设置创建状态
            this.isCreating = true;

            // 调用服务创建菜单集
            // TODO 将createMenuSet改成异步形式
            const result = menuSetService.createMenuSet(this.menuSetName);

            // 处理创建结果
            if (result) {
                uni.showToast({
                    title: '创建成功',
                    icon: 'success'
                });
                // 延迟返回，让用户看到成功提示
                setTimeout(() => {
                    uni.navigateBack();
                }, 1000);
            } else {
                uni.showToast({
                    title: '创建失败',
                    icon: 'none'
                });
                // 创建失败时重置状态
                this.isCreating = false;
            }
        }
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.page-title {
    font-size: 36rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-xl;
}

.form-section {
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $card-padding;
    box-shadow: $shadow-sm;
    margin-bottom: $spacing-xl;
}

.form-group {
    margin-bottom: $spacing-lg;
}

.form-label {
    font-size: 28rpx;
    color: $text-color;
    font-weight: 500;
    margin-bottom: 12rpx;

    &.required:after {
        content: '*';
        color: $error-color;
        margin-left: 4rpx;
    }
}

.form-input {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 20rpx;
    font-size: 28rpx;
    width: 100%;
    box-sizing: border-box;
    border: 2rpx solid $border-color;
    height: 88rpx;

    &:focus {
        border-color: $primary-color;
        background-color: white;
    }
}

.form-tip {
    font-size: 26rpx;
    color: $text-color-light;
    line-height: 1.5;
}

.action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: $spacing-md $container-padding;
    background-color: $card-color;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 10;

    .btn {
        flex: 1;
        margin: 0 $spacing-sm;

        &.disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    }
}
</style>
