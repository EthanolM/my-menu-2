<template>
    <view class="container">
        <view class="privacy-card">
            <view class="privacy-title">隐私政策</view>
            <view class="privacy-subtitle">最后更新：2023年12月1日</view>

            <view class="privacy-section">
                <view class="section-title">引言</view>
                <view class="section-content">
                    <text>我的菜单（以下简称"本应用"）非常重视用户的隐私保护，并致力于维护您的个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和共享您的个人信息，以及您如何访问、更新、控制和保护您的个人信息。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">我们收集的信息</view>
                <view class="section-content">
                    <text>1. 您提供的信息：注册账号时提供的个人信息（如昵称、手机号等）。</text>
                    <text>2. 设备信息：设备型号、操作系统、唯一设备标识符、IP地址等。</text>
                    <text>3. 使用信息：您使用本应用的方式，如访问时间、使用的功能等。</text>
                    <text>4. 位置信息：在您授权的情况下，我们可能会收集您的位置信息。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">信息的使用</view>
                <view class="section-content">
                    <text>我们使用收集的信息来：</text>
                    <text>1. 提供、维护和改进我们的服务。</text>
                    <text>2. 开发新功能和服务。</text>
                    <text>3. 了解用户如何使用我们的服务。</text>
                    <text>4. 通信和回复您的问题。</text>
                    <text>5. 防止欺诈和滥用。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">信息共享</view>
                <view class="section-content">
                    <text>我们不会向第三方出售您的个人信息。我们可能在以下情况下共享您的信息：</text>
                    <text>1. 在得到您明确同意的情况下。</text>
                    <text>2. 根据法律要求或为遵守法律程序。</text>
                    <text>3. 保护我们的用户的权利、财产或安全。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">信息安全</view>
                <view class="section-content">
                    <text>我们采取合理的技术和组织措施来保护您的个人信息不被未经授权的访问、使用或披露。但请注意，互联网传输不是完全安全的，尽管我们会尽最大努力保护您的个人信息，但我们不能保证您的数据在传输过程中的安全性。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">您的权利</view>
                <view class="section-content">
                    <text>您对自己的个人信息拥有以下权利：</text>
                    <text>1. 访问、更正或删除您的个人信息。</text>
                    <text>2. 限制或反对我们处理您的个人信息。</text>
                    <text>3. 获取您个人信息的副本。</text>
                    <text>4. 撤回您的同意。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">政策更新</view>
                <view class="section-content">
                    <text>我们可能会不时更新本隐私政策。当我们对隐私政策进行重大更改时，我们会通过应用内通知或其他方式通知您。我们鼓励您定期查看本政策以了解我们如何保护您的信息。</text>
                </view>
            </view>

            <view class="privacy-section">
                <view class="section-title">联系我们</view>
                <view class="section-content">
                    <text>如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：</text>
                    <text>电子邮件：privacy@mymenu.example.com</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.privacy-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 40rpx 30rpx;
    margin-bottom: 30rpx;
}

.privacy-title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20rpx;
    color: $text-color;
}

.privacy-subtitle {
    font-size: 26rpx;
    text-align: center;
    color: $text-color-lighter;
    margin-bottom: 40rpx;
}

.privacy-section {
    margin-bottom: 40rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: $text-color;
}

.section-content {
    display: flex;
    flex-direction: column;
}

.section-content text {
    font-size: 28rpx;
    color: $text-color-light;
    line-height: 1.6;
    margin-bottom: 16rpx;
}
</style>
