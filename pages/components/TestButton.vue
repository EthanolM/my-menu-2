<template>
    <view>
        <!-- 浮动按钮 -->
        <view class="floating-btn test" @tap="showPopup = true">
            <text class="test-icon">🧪</text>
        </view>
        <!-- 测试弹窗 -->
        <CustomPopup :visible="showPopup" mode="bottom" position="bottom" :round="20" :custom-style="popupStyle"
            @close="showPopup = false">
            <view class="test-popup-content">
                <view class="test-popup-header">
                    <text class="test-popup-title">测试工具</text>
                </view>
                <view class="form-group">
                    <label>用户ID：</label>
                    <input v-model="userId" type="number" class="input" style="width: 180rpx;" @blur="saveUserId" />
                    <label>菜单集ID：</label>
                    <input v-model="menuSetId" type="number" class="input" style="width: 180rpx;"
                        @blur="saveMenuSetId" />
                </view>
                <button @click="resetDish" class="reset-btn">重置菜品和菜品分类</button>
                <button @click="resetIngredient" class="reset-btn">重置食材和食材分类</button>
                <button @click="getUserId" class="reset-btn">获取用户ID</button>
                <button @click="showPopup = false" class="close-btn">关闭</button>
            </view>
        </CustomPopup>
    </view>
</template>

<script>
import CustomPopup from '@/pages/components/CustomPopup/index.vue';
import dishApi from '@/api/dish.js';
import dishCategoryApi from '@/api/dishCategory.js';
import ingredientApi from '@/api/ingredient.js';
import ingredientCategoryApi from '@/api/ingredientCategory.js';

export default {
    name: 'TestButton',
    components: { CustomPopup },
    data() {
        return {
            showPopup: false,
            userId: 1001,
            menuSetId: 1,
            popupStyle: {
                height: '50vh',
                borderRadius: '20px 20px 0 0',
                padding: '24px 16px 16px 16px',
                boxSizing: 'border-box'
            }
        }
    },
    created() {
        this.userId = uni.getStorageSync('userId') || 1001
    },
    methods: {
        saveUserId() {
            // TODO: 调用重置菜品和分类API
            // uni.showToast({ title: '重置菜品和菜品分类', icon: 'none' });
            // if (import.meta.env.MODE === 'development') {
            //     console.log('现在是开发环境！');
            // } else {
            //     console.log('现在是生产环境！');
            // }

            uni.setStorageSync('userId', this.userId);
            // 可选：提示保存成功
            uni.showToast({ title: '用户ID已保存', icon: 'none' });
        },

        saveMenuSetId() {
            uni.setStorageSync('menuSetId', this.menuSetId);
        },

        async resetDish() {
            try {
                // ✅ 等待 Promise 结果
                const dishes = await dishApi.getByMenuSetId(this.menuSetId);
                const dishCategories = await dishCategoryApi.getByMenuSetId(this.menuSetId);
                console.log('菜单集1的所有菜品分类:', dishCategories);
                console.log('菜单集1的所有菜品:', dishes);


                if (dishes.length > 0) {
                    for (let dish of dishes) {
                        const res = await dishApi.remove(dish.id);
                        console.log("删除菜品：", dish.id, " 结果：", res);
                    }
                }
                if (dishCategories.length > 0) {
                    for (let dishCategory of dishCategories) {
                        console.log("将删除菜品id：", dishCategory.id)
                        await dishCategoryApi.remove(dishCategory.id);
                    }
                }
                console.log("以删除所有菜品和分类")

                const dishCategorieId = await dishCategoryApi.create({
                    name: '家常菜',
                    order: 1,
                    userId: 1001,
                    menuSetId: 1
                })
                console.log("创建菜品分类：", dishCategorieId)

                dishApi.create({
                    userId: 1001,
                    name: "香辣牛肉面",
                    image: "https://cdn.example.com/images/spicy_beef_noodles.jpg",
                    description: "一碗热辣爽口的牛肉面，适合喜欢重口味的你！",
                    steps: [
                        {
                            step: 1,
                            instruction: "将牛肉切块，加入生抽、老抽、料酒腌制30分钟。"
                        },
                        {
                            step: 2,
                            instruction: "锅中放油，煸香姜蒜，加入牛肉翻炒至变色。"
                        },
                        {
                            step: 3,
                            instruction: "加入水没过牛肉，放八角、桂皮，大火煮开后小火炖1小时。"
                        },
                        {
                            step: 4,
                            instruction: "另起锅煮面，煮熟后捞出放入碗中，浇上牛肉汤与牛肉。"
                        }
                    ],
                    category_id: dishCategorieId,
                    menu_set_id: 1,
                })

                uni.showToast({ title: '重置菜品和菜品分类成功', icon: 'none' });



            } catch (err) {
                console.error('执行重置菜品失败:', err);
                uni.showToast({ title: '重置菜品失败', icon: 'none' });
            }
        },

        async resetIngredient() {
            // TODO: 调用重置食材和分类API
            try {
                const ingredients = await ingredientApi.getByMenuSetId(1);
                const ingredientCategories = await ingredientCategoryApi.getByMenuSetId(1);

                console.log('菜单集1的所有食材:', ingredients);
                console.log('菜单集1的所有食材分类:', ingredientCategories);
                if (ingredients.length > 0) {
                    for (let ingredient of ingredients) {
                        const res = await ingredientApi.remove(ingredient.id);
                        console.log("删除食材：", ingredient.id, " 结果：", res);
                    }
                }
                if (ingredientCategories.length > 0) {
                    for (let ingredientCategory of ingredientCategories) {
                        const res = await ingredientCategoryApi.remove(ingredientCategory.id);
                        console.log("删除食材分类：", ingredientCategory.id, " 结果：", res);
                    }
                }
            }
            catch (err) {
                console.error('执行重置食材失败:', err);
                uni.showToast({ title: '重置食材失败', icon: 'none' });
            }
        },
        getUserId() {
            const id = uni.getStorageSync('userId');
            uni.showToast({ title: `用户ID: ${id || '未手动更改，默认1001'}`, icon: 'none' });
        }
    }
}
</script>

<style scoped>
.floating-btn.test {
    position: fixed;
    right: 40rpx;
    bottom: 340rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #F59E42;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4rpx 16rpx rgba(245, 158, 66, 0.3);
    z-index: 9999;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-btn.test:active {
    box-shadow: 0 2rpx 8rpx rgba(245, 158, 66, 0.2);
}

.test-icon {
    color: #fff;
    font-size: 48rpx;
}

.test-popup-content {
    min-height: 300rpx;
    padding: 20rpx 0;
    background-color: #fff;
}

.test-popup-header {
    text-align: center;
    margin-bottom: 30rpx;
}

.test-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.form-group label {
    margin-right: 12px;
    font-size: 28rpx;
    color: #666;
}

.input {
    background-color: #F9FAFB;
    border-radius: 12rpx;
    padding: 16rpx;
    height: 60rpx;
    border: 2rpx solid #eee;
    font-size: 28rpx;
}

.reset-btn {
    display: block;
    width: 100%;
    margin-bottom: 12px;
    padding: 10px;
    background: #409eff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
}

.close-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 6px;
    font-size: 16px;
}
</style>