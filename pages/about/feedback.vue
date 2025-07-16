<template>
    <view class="container">
        <!-- 头部区域 -->
        <view class="header-card">
            <view class="header-icon">
                <image src="/static/icons/feedback-large.png" class="header-image"></image>
            </view>
            <view class="header-content">
                <view class="header-title">意见反馈</view>
                <view class="header-desc">您的建议是我们进步的动力</view>
            </view>
        </view>

        <!-- 反馈表单 -->
        <view class="card feedback-form">
            <view class="form-group">
                <view class="form-label">反馈类型</view>
                <picker class="form-picker" @change="onTypeChange" :value="typeIndex" :range="feedbackTypes">
                    <view class="type-selector" :class="{ 'has-value': feedbackType }">
                        <text>{{ feedbackType || '请选择反馈类型' }}</text>
                        <image class="icon-arrow" src="/static/icons/arrow-down.png"></image>
                    </view>
                </picker>
            </view>

            <view class="form-group">
                <view class="form-label">反馈内容</view>
                <view class="textarea-container">
                    <textarea v-model="content" placeholder="请详细描述您遇到的问题或建议..." class="form-textarea"
                        maxlength="500"></textarea>
                    <view class="word-count">{{ content.length }}/500</view>
                </view>
            </view>

            <view class="form-group">
                <view class="form-label">上传截图（选填）</view>
                <view class="image-upload-area">
                    <view class="image-preview-wrapper" v-for="(image, index) in uploadImages" :key="index">
                        <image class="preview-image" :src="image" mode="aspectFill"></image>
                        <view class="delete-btn" @tap.stop="removeImage(index)">
                            <text class="delete-icon">×</text>
                        </view>
                    </view>

                    <view class="upload-button" @tap="chooseImage" v-if="uploadImages.length < 3">
                        <image class="upload-icon" src="/static/icons/upload.png"></image>
                        <text class="upload-text">添加图片</text>
                    </view>
                </view>
                <view class="form-tip">最多上传3张图片</view>
            </view>

            <view class="form-group">
                <view class="form-label">联系方式（选填）</view>
                <input type="text" v-model="contact" placeholder="请留下您的手机号或邮箱，方便我们联系您" class="form-input" />
            </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-btn-container">
            <view class="btn primary submit-btn" @tap="submitFeedback">提交反馈</view>
        </view>

        <!-- 提交成功弹窗 -->
        <view class="success-panel-container" v-if="showSuccessPanel">
            <view class="success-panel" :class="{ 'panel-show': showSuccessPanel }">
                <image class="success-icon" src="/static/icons/success-large.png"></image>
                <view class="success-title">提交成功</view>
                <view class="success-desc">感谢您的反馈，我们会尽快处理</view>
                <view class="btn primary back-btn" @tap="goBack">返回</view>
            </view>
            <view class="mask" @tap="goBack"></view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            feedbackTypes: ['功能建议', '操作问题', '内容错误', '程序异常', '其他'], // 反馈类型选项
            typeIndex: 0, // 当前选中的类型索引
            feedbackType: '', // 当前选中的反馈类型
            content: '', // 反馈内容
            contact: '', // 联系方式
            uploadImages: [], // 上传的图片数组
            showSuccessPanel: false // 是否显示成功提示面板
        };
    },
    methods: {
        // 选择反馈类型
        onTypeChange(e) {
            this.typeIndex = e.detail.value;
            this.feedbackType = this.feedbackTypes[this.typeIndex];
        },

        // 选择图片
        chooseImage() {
            uni.chooseImage({
                count: 1, // 一次选择一张
                sizeType: ['compressed'], // 使用压缩图片
                sourceType: ['album', 'camera'], // 可从相册或相机选择
                success: (res) => {
                    if (this.uploadImages.length < 3) { // 最多上传3张图片
                        this.uploadImages.push(res.tempFilePaths[0]);
                    }
                }
            });
        },

        // 删除图片
        removeImage(index) {
            this.uploadImages.splice(index, 1);
        },

        // 提交反馈
        submitFeedback() {
            // 验证反馈类型
            if (!this.feedbackType) {
                uni.showToast({
                    title: '请选择反馈类型',
                    icon: 'none'
                });
                return;
            }

            // 验证反馈内容
            if (!this.content.trim()) {
                uni.showToast({
                    title: '请输入反馈内容',
                    icon: 'none'
                });
                return;
            }

            // 模拟提交过程
            uni.showLoading({
                title: '提交中...'
            });

            // 1.5秒后显示成功面板
            setTimeout(() => {
                uni.hideLoading();
                this.showSuccessPanel = true;
            }, 1500);
        },

        // 返回上一页
        goBack() {
            if (this.showSuccessPanel) {
                // 如果显示了成功面板，先隐藏面板，再返回上一页
                this.showSuccessPanel = false;
                setTimeout(() => {
                    uni.navigateBack();
                }, 300);
            } else {
                uni.navigateBack();
            }
        }
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.container {
    padding-bottom: 120rpx;
}

/* 头部卡片 */
.header-card {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #5A67D8, #7F9CF5);
    border-radius: $card-radius;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-md;
    color: white;
}

.header-icon {
    width: 88rpx;
    height: 88rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-lg;
}

.header-image {
    width: 48rpx;
    height: 48rpx;
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

/* 反馈表单 */
.feedback-form {
    margin-bottom: $spacing-lg;
}

.form-group {
    margin-bottom: $spacing-lg;

    &:last-child {
        margin-bottom: 0;
    }
}

.form-label {
    font-size: 28rpx;
    font-weight: 500;
    color: $text-color;
    margin-bottom: $spacing-xs;
}

.form-picker {
    width: 100%;
}

.type-selector {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 0 $spacing-md;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: $text-color-light;
    border: 2rpx solid $border-color;

    &.has-value {
        color: $text-color;
    }

    .icon-arrow {
        width: 32rpx;
        height: 32rpx;
        opacity: 0.5;
    }
}

.form-input {
    background-color: #F9FAFB;
    border-radius: $input-radius;
    padding: 0 $spacing-md;
    height: 88rpx;
    font-size: 28rpx;
    color: $text-color;
    width: 100%;
    box-sizing: border-box;
    border: 2rpx solid $border-color;
}

.textarea-container {
    position: relative;
    border-radius: $input-radius;
    border: 2rpx solid $border-color;
    background-color: #F9FAFB;
    padding: $spacing-md;
}

.form-textarea {
    width: 100%;
    height: 240rpx;
    font-size: 28rpx;
    color: $text-color;
    line-height: 1.5;
    padding: 0;
    background-color: transparent;
}

.word-count {
    position: absolute;
    bottom: $spacing-sm;
    right: $spacing-md;
    font-size: 24rpx;
    color: $text-color-lighter;
}

.image-upload-area {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-bottom: $spacing-xs;
}

.image-preview-wrapper {
    width: 180rpx;
    height: 180rpx;
    border-radius: $input-radius;
    overflow: hidden;
    position: relative;
    box-shadow: $shadow-sm;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delete-btn {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 44rpx;
    height: 44rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.delete-icon {
    color: white;
    font-size: 28rpx;
    line-height: 1;
}

.upload-button {
    width: 180rpx;
    height: 180rpx;
    background-color: #F9FAFB;
    border: 2rpx dashed $border-color;
    border-radius: $input-radius;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:active {
        background-color: darken(#F9FAFB, 2%);
    }
}

.upload-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: $spacing-xs;
    opacity: 0.5;
}

.upload-text {
    font-size: 24rpx;
    color: $text-color-light;
}

.form-tip {
    font-size: 24rpx;
    color: $text-color-light;
    margin-top: $spacing-xs;
}

/* 提交按钮 */
.submit-btn-container {
    padding: 0 $spacing-lg;
    margin-top: $spacing-xl;
}

.submit-btn {
    width: 100%;
    height: 88rpx;
    border-radius: $btn-radius;
    font-size: 32rpx;
    font-weight: 600;
}

/* 成功弹窗 */
.success-panel-container {
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

.success-panel {
    width: 80%;
    max-width: 560rpx;
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1000;
    box-shadow: $shadow-lg;
    opacity: 0;
    transform: scale(0.9);
    @include transition-normal;

    &.panel-show {
        opacity: 1;
        transform: scale(1);
    }
}

.success-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: $spacing-lg;
}

.success-title {
    font-size: 36rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-sm;
}

.success-desc {
    font-size: 28rpx;
    color: $text-color-light;
    margin-bottom: $spacing-xl;
    text-align: center;
}

.back-btn {
    width: 100%;
    height: 88rpx;
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
</style>
