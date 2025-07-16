<template>
    <view class="container">
        <!-- 菜单集信息卡片 -->
        <view class="menu-card" v-if="sharedMenu">
            <view class="menu-header">
                <view class="menu-title">{{ sharedMenu.name }}</view>
                <view class="menu-meta">
                    <text class="menu-creator">由 {{ creatorName }} 分享</text>
                    <text class="menu-date">{{ formatDate(sharedMenu.created) }}</text>
                </view>
                <view class="menu-stats">
                    <view class="stat-item">
                        <text class="stat-value">{{ sharedMenu.dishes.length }}</text>
                        <text class="stat-label">道菜</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-value">{{ likeCount }}</text>
                        <text class="stat-label">赞</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-value">{{ commentCount }}</text>
                        <text class="stat-label">评论</text>
                    </view>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-bar">
                <button class="action-btn like-btn" :class="{ 'liked': isLiked }" @tap="toggleLike">
                    <image class="btn-icon" :src="isLiked ? '/static/icons/liked.png' : '/static/icons/like.png'">
                    </image>
                    <text>{{ isLiked ? '已赞' : '点赞' }}</text>
                </button>
                <button class="action-btn share-btn" @tap="shareMenu">
                    <image class="btn-icon" src="/static/icons/share-white.png"></image>
                    <text>分享</text>
                </button>
            </view>
        </view>

        <!-- 菜品列表 -->
        <view class="section" v-if="!loading && !error">
            <view class="section-header">
                <text class="section-title">菜品列表</text>
                <text class="section-count">共{{ sharedMenu?.dishes.length || 0 }}道菜</text>
            </view>
            <view class="dish-list">
                <view class="dish-item" v-for="dish in dishes" :key="dish.id">
                    <image class="dish-image" :src="dish.image" mode="aspectFill"></image>
                    <view class="dish-info">
                        <text class="dish-name">{{ dish.name }}</text>
                        <text class="dish-desc">{{ dish.description }}</text>
                        <view class="dish-tags">
                            <text class="tag" v-for="(tag, index) in dish.tags" :key="index">{{ tag }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 评论区 -->
        <view class="section" v-if="!loading && !error">
            <view class="section-header">
                <text class="section-title">评论区</text>
                <text class="section-count">{{ commentCount }}条评论</text>
            </view>

            <!-- 评论输入框 -->
            <view class="comment-input">
                <input type="text" v-model="newComment" placeholder="说点什么..." @confirm="submitComment"
                    confirm-type="send" />
                <button class="send-btn" @tap="submitComment">发送</button>
            </view>

            <!-- 评论列表 -->
            <view class="comment-list">
                <view class="comment-item" v-for="comment in comments" :key="comment.id">
                    <image class="avatar" :src="comment.avatar" mode="aspectFill"></image>
                    <view class="comment-content">
                        <view class="comment-header">
                            <text class="username">{{ comment.username }}</text>
                            <text class="time">{{ formatDate(comment.time) }}</text>
                        </view>
                        <text class="comment-text">{{ comment.content }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 加载中 -->
        <view v-if="loading" class="loading-box">
            <text>加载中...</text>
        </view>

        <!-- 错误信息 -->
        <view v-else-if="error" class="error-box">
            <image class="error-icon" src="/static/icons/error.png"></image>
            <text class="error-text">{{ errorMessage }}</text>
            <view class="error-btn" @tap="goHome">返回首页</view>
        </view>
    </view>
</template>

<script>
import { shareService, dishService } from '@/services/dataService.js';

export default {
    data() {
        return {
            loading: true,
            error: false,
            errorMessage: '',
            shareId: '',
            sharedMenu: null,
            dishes: [],
            creatorName: '好友',
            isLiked: false,
            likeCount: 0,
            commentCount: 0,
            comments: [],
            newComment: ''
        };
    },

    onLoad(options) {
        if (options.shareId) {
            this.shareId = options.shareId;
            this.loadSharedMenu();
        } else {
            this.error = true;
            this.errorMessage = '分享参数无效，无法加载菜单';
            this.loading = false;
        }
    },

    methods: {
        loadSharedMenu() {
            try {
                const sharedMenu = shareService.getSharedMenu(this.shareId);
                if (sharedMenu) {
                    this.sharedMenu = sharedMenu;
                    this.loadMenuData();
                } else {
                    this.error = true;
                    this.errorMessage = '找不到此分享菜单，可能已过期或被删除';
                }
            } catch (e) {
                this.error = true;
                this.errorMessage = '加载分享菜单时出错，请稍后再试';
            } finally {
                this.loading = false;
            }
        },

        loadMenuData() {
            // 加载菜品详情
            this.dishes = this.sharedMenu.dishes.map(id => dishService.getDishById(id));

            // 加载评论和点赞数据
            const shareData = shareService.getShareData(this.shareId);
            this.comments = shareData.comments || [];
            this.likeCount = shareData.likes || 0;
            this.commentCount = this.comments.length;
            this.isLiked = shareService.isLikedByUser(this.shareId);
        },

        toggleLike() {
            if (this.isLiked) {
                shareService.unlikeShare(this.shareId);
                this.likeCount--;
            } else {
                shareService.likeShare(this.shareId);
                this.likeCount++;
            }
            this.isLiked = !this.isLiked;
        },

        submitComment() {
            if (!this.newComment.trim()) {
                return;
            }
            const comment = shareService.addComment(this.shareId, this.newComment);
            if (comment) {
                this.comments.unshift(comment);
                this.commentCount++;
                this.newComment = '';
            }
        },

        shareMenu() {
            uni.share({
                provider: "weixin",
                scene: "WXSceneSession",
                type: 0,
                title: this.sharedMenu.name,
                summary: `分享了${this.dishes.length}道美味菜品`,
                imageUrl: this.dishes[0]?.image,
                success: function (res) {
                    console.log("success:" + JSON.stringify(res));
                },
                fail: function (err) {
                    console.log("fail:" + JSON.stringify(err));
                }
            });
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        },

        goHome() {
            uni.switchTab({
                url: '/pages/index/index'
            });
        }
    }
};
</script>

<style lang="scss">
@import '@/common/styles/common.scss';

.menu-card {
    background-color: $card-color;
    border-radius: $card-radius;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-sm;
    overflow: hidden;
}

.menu-header {
    padding: $spacing-lg;
}

.menu-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $text-color;
    margin-bottom: $spacing-sm;
}

.menu-meta {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-md;
    font-size: 26rpx;
    color: $text-color-light;
}

.menu-creator {
    margin-right: $spacing-md;
}

.menu-stats {
    display: flex;
    border-top: 2rpx solid $divider-color;
    padding-top: $spacing-md;
}

.stat-item {
    flex: 1;
    text-align: center;

    .stat-value {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-color;
        display: block;
    }

    .stat-label {
        font-size: 24rpx;
        color: $text-color-light;
    }
}

.action-bar {
    display: flex;
    padding: $spacing-md $spacing-lg;
    border-top: 2rpx solid $divider-color;

    .action-btn {
        flex: 1;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $btn-radius;
        margin: 0 $spacing-xs;

        &.like-btn {
            background-color: $background-color;
            color: $text-color;

            &.liked {
                color: $primary-color;
            }
        }

        &.share-btn {
            background-color: $primary-color;
            color: white;
        }

        .btn-icon {
            width: 36rpx;
            height: 36rpx;
            margin-right: $spacing-xs;
        }
    }
}

.section {
    margin-bottom: $spacing-xl;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;

    .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-color;
    }

    .section-count {
        font-size: 26rpx;
        color: $text-color-light;
    }
}

.dish-list {
    .dish-item {
        display: flex;
        background-color: $card-color;
        border-radius: $card-radius;
        margin-bottom: $spacing-md;
        padding: $spacing-md;
        box-shadow: $shadow-sm;

        .dish-image {
            width: 160rpx;
            height: 160rpx;
            border-radius: $card-radius;
            margin-right: $spacing-md;
        }

        .dish-info {
            flex: 1;
        }

        .dish-name {
            font-size: 30rpx;
            font-weight: 500;
            color: $text-color;
            margin-bottom: $spacing-xs;
        }

        .dish-desc {
            font-size: 26rpx;
            color: $text-color-light;
            margin-bottom: $spacing-xs;
            @include text-ellipsis(2);
        }

        .dish-tags {
            display: flex;
            flex-wrap: wrap;

            .tag {
                font-size: 22rpx;
                color: $primary-color;
                background-color: $primary-light;
                padding: 4rpx 12rpx;
                border-radius: 4rpx;
                margin-right: $spacing-xs;
                margin-bottom: $spacing-xs;
            }
        }
    }
}

.comment-input {
    display: flex;
    align-items: center;
    background-color: $card-color;
    border-radius: $card-radius;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-sm;

    input {
        flex: 1;
        height: 72rpx;
        background-color: $background-color;
        border-radius: 36rpx;
        padding: 0 $spacing-lg;
        margin-right: $spacing-md;
        font-size: 28rpx;
    }

    .send-btn {
        width: 120rpx;
        height: 72rpx;
        background-color: $primary-color;
        color: white;
        border-radius: 36rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.comment-list {
    .comment-item {
        display: flex;
        padding: $spacing-md;
        border-bottom: 2rpx solid $divider-color;

        .avatar {
            width: 64rpx;
            height: 64rpx;
            border-radius: 50%;
            margin-right: $spacing-md;
        }

        .comment-content {
            flex: 1;
        }

        .comment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: $spacing-xs;

            .username {
                font-size: 28rpx;
                color: $text-color;
                font-weight: 500;
            }

            .time {
                font-size: 24rpx;
                color: $text-color-lighter;
            }
        }

        .comment-text {
            font-size: 28rpx;
            color: $text-color;
            line-height: 1.5;
        }
    }
}

// 保留原有的loading和error样式
.loading-box,
.error-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
}

.error-icon {
    width: 100rpx;
    height: 100rpx;
    margin-bottom: 20rpx;
}

.error-text {
    font-size: 28rpx;
    color: $text-color-light;
    text-align: center;
    margin-bottom: 30rpx;
}

.error-btn {
    padding: 16rpx 40rpx;
    background-color: $primary-color;
    color: #FFFFFF;
    border-radius: 8rpx;
    font-size: 28rpx;
}
</style>
