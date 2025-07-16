<template>
	<view class="container" :style="{ height: getContainerHeight() }">
		<!-- 使用Header组件 -->
		<Header :page-type="'index'" :safe-area-insets="safeAreaInsets" :menu-sets="menuSets"
			:current-menu-set="currentMenuSet" @menu-set-changed="onMenuSetChanged" @toggle-edit-mode="toggleEditMode"
			:is-edit-mode="isEditMode" />

		<!-- 编辑模式提示 -->
		<view class="edit-tip" v-if="isEditMode">
			<text class="tip-text">长按分类可拖拽调整顺序，点击删除按钮可删除分类及其菜品</text>
		</view>

		<!-- 主内容区域 - 左右分栏布局 -->
		<view class="main-content">
			<!-- 左侧分类导航 -->
			<CategoryNav :category-order="categoryOrder" :current-category="currentCategory" :is-edit-mode="isEditMode"
				@select-category="selectCategory" @delete-category="deleteCategory" @toggle-edit-mode="toggleEditMode"
				@update-category-order="updateCategoryOrder" />

			<!-- 右侧菜品列表 -->
			<scroll-view class="dish-list" scroll-y="true" :scroll-into-view="toView" scroll-with-animation="true">
				<!-- 多选删除模式头部 -->
				<view class="multi-select-header" v-if="isEditMode">
					<view class="multi-select-info">
						<text class="multi-select-title">多选删除菜品</text>
						<text class="selected-count">已选择 {{ selectedDishes.length }} 道菜</text>
					</view>
					<view class="multi-select-actions">
						<view class="action-btn" @tap="selectAllDishes">
							<text class="action-text">{{ isAllSelected ? '取消全选' : '全选' }}</text>
						</view>
						<view class="action-btn delete" @tap="deleteSelectedDishes"
							:class="{ 'disabled': selectedDishes.length === 0 }">
							<text class="action-text">删除选中</text>
						</view>
					</view>
				</view>

				<view v-if="categorizedDishes.length > 0">
					<view v-for="category in categorizedDishes" :key="category.id" class="category-section"
						:id="encodeId(category.name)">
						<view class="category-header">
							<view class="category-info">
								<text class="category-name">{{ category.name }}</text>
							</view>
							<text class="category-count">{{ category.dishes.length }}道菜</text>
						</view>

						<!-- 有菜品时显示菜品列表 -->
						<view v-if="category.dishes.length > 0" class="dish-list-horizontal">
							<view class="dish-card-horizontal" v-for="dish in category.dishes" :key="dish.id"
								@tap="isEditMode ? toggleDishSelection(dish.id) : navigateToDishDetail(dish.id)"
								:class="{ 'selected': selectedDishes.includes(dish.id) }">

								<!-- 编辑模式下的勾选框 -->
								<view class="dish-checkbox" v-if="isEditMode">
									<text class="checkbox-icon">{{ selectedDishes.includes(dish.id) ? '✓' : '' }}</text>
								</view>

								<image class="dish-image-horizontal" :src="dish.image" mode="aspectFill"></image>
								<view class="dish-info-horizontal">
									<text class="dish-name-horizontal">{{ dish.name }}</text>
									<view class="dish-availability-horizontal" v-if="dish.totalIngredientsCount > 0">
										<view class="availability-container-horizontal">
											<view class="availability-bar-horizontal">
												<view class="availability-value-horizontal"
													:class="getProgressClass(dish.availabilityPercentage)"
													:style="{ width: dish.availabilityPercentage + '%' }">
												</view>
											</view>
										</view>
										<view class="availability-text-horizontal">
											<text class="availability-label-horizontal">食材库存</text>
											<text class="availability-percentage-horizontal"
												:class="getProgressClass(dish.availabilityPercentage)">
												{{ dish.availabilityPercentage }}%
											</text>
										</view>
									</view>
								</view>
							</view>
						</view>

						<!-- 空分类时显示提示 -->
						<view v-else class="empty-category">
							<text class="empty-category-text">暂无餐品</text>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-else>
					<image src="/static/images/empty.png" mode="aspectFit" class="empty-image"></image>
					<view class="empty-text">暂无菜品，快去添加吧！</view>
					<view class="btn primary" @click="navigateToEdit">添加菜品</view>
				</view>
			</scroll-view>
		</view>

		<!-- 添加浮动按钮 -->
		<view class="floating-btn share" @tap="navigateToShare">
			<up-icon class="icon share-icon" name="share" size="28"></up-icon>
		</view>
		<view class="floating-btn add" @tap="navigateToEdit">
			<text class="add-icon">+</text>
		</view>
		<view class="floating-btn reset" @tap="resetData" style="bottom: 200px;">
			<text class="reset-icon">🔄</text>
		</view>
		<view class="floating-btn demo" @tap="showDemoPopup = true" style="bottom: 340px;">
			<text class="demo-icon">📋</text>
		</view>
	</view>

	<!-- 演示弹出层 - 移到container外部 -->
	<CustomPopup v-model:visible="showDemoPopup" @close="handleDemoClose">
		<view class="demo-popup-content">
			<view class="demo-popup-header">
				<text class="demo-popup-title">快速操作</text>
			</view>
			<view class="demo-popup-body">
				<view class="demo-menu-item" @click="console.log(userId)">
					<text class="demo-menu-text">获取当前用户id</text>
					<text class="demo-menu-desc">打印到控制台</text>
				</view>
				<view class="demo-menu-item" @click="handleQuickAction('share')">
					<text class="demo-menu-text">分享菜单</text>
					<text class="demo-menu-desc">分享给朋友</text>
				</view>
				<view class="demo-menu-item" @click="handleQuickAction('settings')">
					<text class="demo-menu-text">设置</text>
					<text class="demo-menu-desc">应用设置</text>
				</view>
			</view>
		</view>
	</CustomPopup>
	<TestButton />
</template>

<script>
import Header from '@/pages/components/Header/index.vue';
import CustomPopup from '@/pages/components/CustomPopup/index.vue';
import CategoryNav from '@/pages/components/CategoryManager/CategoryNav.vue';
import { dishService, ingredientService, menuSetService, categoryService } from '@/services/dataService.js';
import tabBarMixin from '@/common/mixins/tabBarMixin.js';
import TestButton from '@/pages/components/TestButton.vue';

export default {
	components: {
		Header,
		CustomPopup,
		CategoryNav,
		TestButton
	},
	mixins: [tabBarMixin],
	data() {
		return {
			dishes: [],
			filteredDishes: [],

			menuSets: [], // 所有菜单集
			currentMenuSet: {}, // 当前选择的菜单集
			showMenuSets: false, // 控制菜单集选择器显示

			categorizedDishes: [], // 按分类的菜品
			categoryOrder: [], // 分类顺序
			originalCategoryOrder: [], // 用于重置分类顺序
			currentCategory: null, // 当前选择的分类
			toView: '',

			isEditMode: false, // 是否为编辑模式
			selectedDishes: [], // 选中的菜品ID数组
			safeAreaInsets: null, // 安全区域边距

			searchKey: '',
			showDemoPopup: false, // 演示弹出层显示状态

			userId: 1001,
		};
	},
	computed: {
		isAllSelected() {
			return this.dishes.length > 0 && this.selectedDishes.length === this.dishes.length;
		}
	},
	onLoad() {
		// 加载菜品数据
		this.loadData();
	},
	onShow() {
		// 重新加载菜单集和菜品数据
		this.loadMenuSets();
		this.loadData();
	},
	onReady() {
		// 在DOM准备好后检查屏幕安全区域边距
		try {
			const sysInfo = uni.getSystemInfoSync();
			this.safeAreaInsets = sysInfo.safeAreaInsets;
			console.log('safeAreaInsets:', this.safeAreaInsets);
			console.log('System info:', {
				windowHeight: sysInfo.windowHeight,
				screenHeight: sysInfo.screenHeight,
				statusBarHeight: sysInfo.statusBarHeight,
				tabBarHeight: sysInfo.tabBarHeight
			});
		} catch (e) {
			console.error('获取系统信息失败', e);
			this.safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };
		}

		// 延迟获取tabbar高度，确保DOM已渲染
		setTimeout(() => {
			this.getTabBarHeight();
		}, 100);
	},
	methods: {
		// 加载菜单集数据
		loadMenuSets() {
			// 获取所有菜单集
			this.menuSets = menuSetService.getAllMenuSets();
			// 获取当前选中的菜单集
			const currentMenuSetId = menuSetService.getCurrentMenuSetId();
			this.currentMenuSet = menuSetService.getMenuSetById(currentMenuSetId);
		},

		// 菜单集改变时的回调
		onMenuSetChanged(menuSetId) {
			// 重新加载数据
			menuSetService.setCurrentMenuSet(menuSetId);
			this.currentMenuSet = menuSetService.getMenuSetById(menuSetId);
			this.loadData();
		},

		// 重置数据（用于调试）
		resetData() {
			uni.showModal({
				title: '确认重置',
				content: '这将清除所有数据并恢复示例数据，确定要继续吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除所有数据
						uni.removeStorageSync("categories");
						uni.removeStorageSync("dishes");
						uni.removeStorageSync("ingredients");
						uni.removeStorageSync("menuSets");
						uni.removeStorageSync("currentMenuSetId");
						uni.removeStorageSync("categoryOrder");

						// 重新初始化数据
						const { initializeData } = require('@/services/dataService.js');
						initializeData();

						// 重新加载数据
						this.loadData();

						uni.showToast({
							title: '数据已重置',
							icon: 'success'
						});
					}
				}
			});
		},

		loadData() {
			// 使用新的方法获取按分类分组的菜品
			this.categorizedDishes = dishService.getCurrentMenuSetDishesByCategory();

			// 获取所有菜品用于搜索和筛选
			const currentMenuSetId = menuSetService.getCurrentMenuSetId();
			const currentMenuSet = menuSetService.getMenuSetById(currentMenuSetId);
			const menuSetDishes = menuSetService.getDishesInMenuSet(currentMenuSet.id);

			// 添加调试信息
			console.log('当前菜单集ID:', currentMenuSetId);
			console.log('当前菜单集:', currentMenuSet);
			console.log('菜单集中的菜品:', menuSetDishes);
			console.log('按分类分组的菜品:', this.categorizedDishes);

			// 使用新的方法获取当前菜单集菜品的可用性
			const availabilityDishes = dishService.getCurrentMenuSetDishesWithAvailability();

			// 将库存数据合并到当前菜单的菜品中
			this.dishes = menuSetDishes.map(dish => {
				const availabilityInfo = availabilityDishes.find(d => d.id === dish.id);
				if (availabilityInfo) {
					return {
						...dish,
						availableIngredientsCount: availabilityInfo.availableIngredientsCount,
						totalIngredientsCount: availabilityInfo.totalIngredientsCount,
						availabilityPercentage: availabilityInfo.availabilityPercentage
					};
				}
				return dish;
			});

			this.filteredDishes = [...this.dishes];
			this.allTags = Array.from(new Set(this.dishes.flatMap(dish => dish.tags || [])));

			// 更新分类分组数据，包含库存信息
			this.updateCategorizedDishesWithAvailability();

			// 加载当前菜单集的分类顺序
			const categories = menuSetService.getCurrentMenuSetCategoriesByOrder();
			this.categoryOrder = categories.map(cat => cat.name);
			this.originalCategoryOrder = [...this.categoryOrder];
		},

		// 更新分类分组数据，包含库存信息 
		updateCategorizedDishesWithAvailability() {
			const availabilityDishes = dishService.getCurrentMenuSetDishesWithAvailability();

			this.categorizedDishes = this.categorizedDishes.map(category => ({
				...category,
				dishes: category.dishes.map(dish => {
					const availabilityInfo = availabilityDishes.find(d => d.id === dish.id);
					if (availabilityInfo) {
						return {
							...dish,
							availableIngredientsCount: availabilityInfo.availableIngredientsCount,
							totalIngredientsCount: availabilityInfo.totalIngredientsCount,
							availabilityPercentage: availabilityInfo.availabilityPercentage
						};
					}
					return dish;
				})
			}));
		},

		// 获取分类下的菜品数量
		getCategoryDishCount(categoryName) {
			// 先根据分类名称找到分类ID
			const category = categoryService.getCategoryByName(categoryName);
			if (!category) return 0;

			// 然后根据分类ID计算菜品数量
			return this.dishes.filter(dish => dish.categoryId === category.id).length;
		},

		// 切换编辑模式
		toggleEditMode() {
			this.isEditMode = !this.isEditMode;
			if (!this.isEditMode) {
				this.selectedDishes = [];
			}
		},

		// 全选/取消全选菜品
		selectAllDishes() {
			if (this.isAllSelected) {
				this.selectedDishes = [];
			} else {
				this.selectedDishes = this.dishes.map(dish => dish.id);
			}
		},

		// 切换菜品选择状态
		toggleDishSelection(dishId) {
			const index = this.selectedDishes.indexOf(dishId);
			if (index > -1) {
				this.selectedDishes.splice(index, 1);
			} else {
				this.selectedDishes.push(dishId);
			}
		},

		// 删除选中的菜品
		deleteSelectedDishes() {
			if (this.selectedDishes.length === 0) return;

			uni.showModal({
				title: '确认删除',
				content: `确定要删除选中的 ${this.selectedDishes.length} 道菜品吗？此操作不可恢复。`,
				success: (res) => {
					if (res.confirm) {
						// 删除菜品
						this.selectedDishes.forEach(dishId => {
							dishService.deleteDish(dishId);
						});

						// 重新加载数据
						this.loadData();
						this.selectedDishes = [];

						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
					}
				}
			});
		},

		// 删除分类
		deleteCategory(categoryName) {
			// 先根据分类名称找到分类ID
			const category = categoryService.getCategoryByName(categoryName);
			if (!category) return;

			const dishCount = this.getCategoryDishCount(categoryName);

			uni.showModal({
				title: '确认删除分类',
				content: `确定要删除分类"${categoryName}"吗？这将同时删除该分类下的 ${dishCount} 道菜品，此操作不可恢复。`,
				success: (res) => {
					if (res.confirm) {
						// 删除该分类下的所有菜品
						const categoryDishes = this.dishes.filter(dish => dish.categoryId === category.id);
						categoryDishes.forEach(dish => {
							dishService.deleteDish(dish.id);
						});

						// 删除分类
						categoryService.deleteCategory(category.id);

						// 重新加载数据
						this.loadData();

						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
					}
				}
			});
		},

		searchDishes() {
			if (!this.searchKey.trim()) {
				this.filteredDishes = [...this.dishes];
				return;
			}
			this.filteredDishes = this.dishes.filter(dish =>
				dish.name.includes(this.searchKey) ||
				dish.description.includes(this.searchKey) ||
				(dish.tags && dish.tags.some(tag => tag.includes(this.searchKey)))
			);
		},

		navigateToDishDetail(id) {
			uni.navigateTo({
				url: `/pages/dish/detail?id=${id}`
			});
		},

		// 添加获取进度条颜色的方法
		getProgressColor(percentage) {
			if (percentage >= 80) return '#10B981'; // 绿色，成功
			if (percentage >= 50) return '#F59E0B'; // 橙色，警告
			return '#EF4444'; // 红色，错误
		},

		// 获取进度条样式类
		getProgressClass(percentage) {
			if (percentage >= 70) return 'high';
			if (percentage >= 40) return 'medium';
			return 'low';
		},

		resetCategoryOrder() {
			this.categoryOrder = [...this.originalCategoryOrder];
		},

		// 导航到指定分类
		navigateToCategory(category) {
			if (this.isEditMode) return; // 编辑模式下不进行导航

			// 关闭分类面板
			this.showFilterPanel = false;

			// 给组件DOM渲染留出时间
			setTimeout(() => {
				// 查找对应的分类元素
				const query = uni.createSelectorQuery();
				query.selectAll('.category-section').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec((res) => {
					if (!res || !res[0] || !res[1]) return;

					const sections = res[0];
					const scrollTop = res[1].scrollTop;

					// 查找匹配的分类section
					const target = sections.find(section => {
						// 查找section中的category-name元素文本是否与目标分类匹配
						return section.dataset && section.dataset.category === category;
					});

					if (target) {
						// 计算滚动位置，考虑到顶部导航栏的高度(110rpx)
						const headerHeight = 55; // 顶部导航栏高度，单位px
						const targetPosition = scrollTop + target.top - headerHeight;

						// 执行滚动
						uni.pageScrollTo({
							scrollTop: targetPosition,
							duration: 300
						});
					}
				});
			}, 100);
		},

		// 添加新的导航方法
		navigateToEdit() {
			uni.navigateTo({
				url: '/pages/dish/edit'
			});
		},

		// 添加分享页面导航方法
		navigateToShare() {
			uni.navigateTo({
				url: `/pages/share/index?menuSetId=${this.currentMenuSet.id}`
			});
		},

		selectCategory(category) {
			this.currentCategory = category;
			this.toView = this.encodeId(category);
			console.log(this.toView, '前往这个分类')
		},

		encodeId(categoryName) {
			return 'category-' + encodeURIComponent(categoryName).replace(/%/g, '_');
		},

		// 演示弹出层相关方法
		handleDemoClose() {
			console.log('演示弹出层已关闭');
		},

		handleQuickAction(action) {
			this.showDemoPopup = false;

			switch (action) {
				case 'add':
					this.navigateToEdit();
					break;
				case 'share':
					this.navigateToShare();
					break;
				case 'settings':
					uni.showToast({
						title: '设置功能开发中',
						icon: 'none'
					});
					break;
				default:
					break;
			}
		},

		// 分类顺序更新
		updateCategoryOrder(newOrder) {
			this.categoryOrder = [...newOrder];
			// 同步到数据服务
			dishService.saveCategoryOrder(newOrder);
			// 重新加载数据以反映新的排序
			this.loadData();
		},
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/common.scss';

.container {
	padding-bottom: 0rpx;
	padding-left: 0;
	padding-right: 0;
	padding-top: 0;
	display: flex;
	flex-direction: column;
	/* height: 100vh; 移除固定高度，使用动态计算 */
	overflow: hidden; // 禁止整个页面滚动
}

.safe-area-container {
	background-color: $primary-color;
	box-shadow: $shadow-md;
}

/* 顶部导航栏样式 */
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 15rpx 0;
	max-height: 70rpx;
	background-color: $primary-color;
	box-shadow: $shadow-md;
	position: sticky;
	top: 0;
	z-index: 100;
}

.category-btn,
.search-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	// background-color: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	box-shadow: $shadow-sm;
	@include transition-fast;

	&:active {
		transform: scale(0.95);
		background-color: rgba(255, 255, 255, 0.3);
	}
}

.menu-set-selector {
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 16rpx;
	padding: 0 20rpx;
	box-shadow: $shadow-sm;
	@include transition-fast;

	.menu-set-name {
		font-size: 26rpx;
		color: #FFFFFF;
		font-weight: 500;
		max-width: 120rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

/* 筛选面板样式 */
.filter-panel {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 70vh;
	background-color: $card-color;
	z-index: 100;
	box-shadow: $shadow-lg;
	transform: translateY(100%);
	@include transition-normal;
	padding: $container-padding;
	box-sizing: border-box;
	overflow-y: auto;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
}

.filter-panel-show {
	transform: translateY(0);
}

.filter-section {
	margin-bottom: $spacing-xl;

	.filter-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: $spacing-md;
		color: $text-color;
	}
}

.category-item {
	padding: 30rpx 20rpx;
	text-align: center;
	border-bottom: 1px solid $border-color;
	@include transition-fast;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;

	&.active {
		background-color: #fff;
		color: $primary-color;
		font-weight: 500;
		position: relative;
	}

	&.edit-mode {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 20rpx;
		border: 2rpx solid $primary-color;
		border-radius: 12rpx;
		margin: 8rpx 16rpx;
		background-color: $primary-light;
	}

	&:active {
		background-color: rgba($primary-color, 0.05);
	}

	.category-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
		flex: 1;

		.category-name {
			font-size: 32rpx;
			line-height: 1.2;
			word-break: break-all;
			font-weight: 600;
		}
	}

	.category-actions {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.drag-handle {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(255, 255, 255, 0.8);
			border-radius: 8rpx;
			cursor: grab;

			.drag-icon {
				font-size: 20rpx;
				color: $text-color-light;
			}
		}

		.delete-btn {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #FEE2E2;
			border-radius: 8rpx;
			@include transition-fast;

			&:active {
				transform: scale(0.9);
			}

			.delete-icon {
				font-size: 20rpx;
			}
		}
	}
}

.filter-actions {
	position: sticky;
	bottom: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: $spacing-md;
	padding-top: $spacing-lg;
	background-color: $card-color;

	.btn {
		@include transition-fast;

		&:active {
			transform: scale(0.95);
		}
	}
}

/* 修改菜品列表布局样式 */
.dish-list-horizontal {
	width: auto;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	margin-top: 20rpx;

}

// 菜品列表样式
.dish-card-horizontal {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
	display: flex;
	gap: 20rpx;
	padding: 16rpx;
	position: relative;
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	border: 1px solid rgba(0, 0, 0, 0.03);

	&.selected {
		border-color: $primary-color;
		background-color: $primary-light;
	}

	&:active {
		transform: translateY(-2rpx);
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
	}

	.dish-checkbox {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid $border-color;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		flex-shrink: 0;
		@include transition-fast;

		.checkbox-icon {
			font-size: 24rpx;
			color: $primary-color;
			font-weight: bold;
		}
	}
}

// 优化的菜品卡片与库存进度条样式
.dish-image-horizontal {
	width: 140rpx;
	height: 140rpx;
	background-color: #F9FAFB; // 微妙的背景色
	border-radius: 12rpx;
	object-fit: cover; // 确保图片覆盖整个区域
}

.dish-info-horizontal {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 6rpx 0;
}

.dish-name-horizontal {
	font-size: 30rpx;
	font-weight: 600;
	color: #1F2937; // 更深的文本颜色
	line-height: 1.3;
	margin-bottom: 8rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 90%;
}

.dish-availability-horizontal {
	margin: 6rpx 0 12rpx;
}

.availability-container-horizontal {
	position: relative;
}

.availability-bar-horizontal {
	height: 4rpx; // 更细的进度条
	background-color: rgba(229, 231, 235, 0.7); // 更柔和的底色
	border-radius: 6rpx;
	overflow: hidden;
}

.availability-value-horizontal {
	height: 100%;
	border-radius: 6rpx;
	transform-origin: left center;
	transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);

	&.high {
		background: linear-gradient(to right, #10B981, #059669); // 更精致的渐变
	}

	&.medium {
		background: linear-gradient(to right, #F59E0B, #D97706);
	}

	&.low {
		background: linear-gradient(to right, #EF4444, #DC2626);
	}
}

.availability-text-horizontal {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 4rpx;

	.availability-label-horizontal {
		font-size: 20rpx; // 更小的字体
		color: #6B7280; // 更柔和的次要文本颜色
	}

	.availability-percentage-horizontal {
		font-size: 20rpx;
		font-weight: 600;

		&.high {
			color: #059669;
		}

		&.medium {
			color: #D97706;
		}

		&.low {
			color: #DC2626;
		}
	}
}

.dish-tags-horizontal {
	display: flex;
	overflow: hidden;
	gap: 8rpx;

	.tags-wrapper {
		display: flex;
		align-items: center;
		overflow: hidden;
		flex-wrap: nowrap;
		max-width: 100%;
		min-width: 0;
	}

	.tag-horizontal {
		font-size: 20rpx;
		padding: 2rpx 12rpx;
		background-color: #F3F4F6;
		color: #4B5563;
		border-radius: 12rpx;
		display: inline-block;
		margin-right: 8rpx;
		white-space: nowrap;
	}

	.tag-more {
		font-size: 20rpx;
		color: #6B7280;
		padding-left: 2rpx;
		white-space: nowrap;
	}
}

// 分类样式
.dish-list-by-category {
	padding: 0rpx 24rpx;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.category-count {
	font-size: 24rpx;
	color: $text-color-light;
}

/* 空状态样式 - 添加水平内边距 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx $container-padding;

	.empty-image {
		width: 240rpx;
		height: 240rpx;
		margin-bottom: $spacing-lg;
		opacity: 0.7;
	}

	.empty-text {
		font-size: 28rpx;
		color: $text-color-light;
		margin-bottom: $spacing-xl;
	}

	.btn {
		@include transition-fast;

		&:active {
			transform: scale(0.95);
		}
	}
}

/* 空分类提示样式 */
.empty-category {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	background-color: #f9f9f9;
	border-radius: 12rpx;
	margin-top: 16rpx;
	border: 1px dashed #e0e0e0;

	.empty-category-text {
		font-size: 26rpx;
		color: #999;
		font-style: italic;
	}
}

/* 菜单集选择器样式 */
.menu-set-selector {
	height: 72rpx;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	margin-right: 16rpx;
	box-shadow: $shadow-sm;

	.menu-set-name {
		font-size: 26rpx;
		color: white;
		font-weight: 500;
		max-width: 120rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// 下拉图标样式
	// .dropdown-icon {
	// 	width: 24rpx;
	// 	height: 24rpx;
	// 	margin-left: 8rpx;
	// 	filter: brightness(10);
	// }
}

/* 菜单集选择面板 */
.menu-set-panel {
	position: fixed;
	top: 20%;
	left: 10%;
	width: 80%;
	max-height: 60vh;
	background-color: $card-color;
	border-radius: $card-radius;
	z-index: 100;
	box-shadow: $shadow-lg;
	display: flex;
	flex-direction: column;
}

.menu-set-header {
	padding: 30rpx;
	border-bottom: 2rpx solid $divider-color;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.menu-set-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $text-color;
}

.create-menu-set {
	display: flex;
	align-items: center;
	color: $primary-color;
	font-size: 28rpx;

	.add-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 6rpx;
	}
}

.menu-set-list {
	flex: 1;
	max-height: 40vh;
}

.menu-set-item {
	padding: 24rpx 30rpx;
	border-bottom: 2rpx solid $divider-color;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&.active {
		background-color: $primary-light;
	}

	&:active {
		background-color: darken($primary-light, 5%);
	}
}

.menu-set-item-name {
	font-size: 28rpx;
	color: $text-color;
	font-weight: 500;
}

.menu-set-info {
	display: flex;
	align-items: center;
}

.menu-set-count {
	font-size: 24rpx;
	color: $text-color-light;
	margin-right: 16rpx;
}

.check-icon {
	width: 32rpx;
	height: 32rpx;
}

.menu-set-actions {
	padding: 20rpx 30rpx;
	border-top: 2rpx solid $divider-color;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16rpx;

	.btn {
		flex: 1;
	}
}

/* 主内容区域样式 */
.main-content {
	flex: 1;
	display: flex;
	overflow: hidden;
	background-color: #fff;
}

/* 左侧分类导航样式 */
.category-nav {
	width: 180rpx;
	height: 100%;
	background-color: #f5f5f5;
	border-right: 1px solid $border-color;
}

/* 右侧菜品列表样式 */
.dish-list {
	flex: 1;
	height: 100%;
	background-color: #fff;
}

.category-section {
	padding: 20rpx;
}

.category-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
	margin-bottom: 16rpx;
}

.category-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.category-name {
	font-size: 32rpx;
	font-weight: 600;
	color: $text-color;
	position: relative;
	padding-left: 20rpx;
}

.category-header .category-name::before {
	content: '';
	position: absolute;
	left: 0;
	top: 6rpx;
	height: 32rpx;
	width: 8rpx;
	background-color: $primary-color;
	border-radius: 4rpx;
}

.category-count {
	font-size: 24rpx;
	color: $text-color-light;
}

/* 修改浮动按钮位置 */
.floating-btn {
	position: fixed;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: $shadow-lg;
	z-index: 99;
	@include transition-fast;

	&.add {
		bottom: 160rpx;
		background: $primary-color;
		box-shadow: 0 4rpx 16rpx rgba(255, 149, 0, 0.3);

		&:active {
			box-shadow: 0 2rpx 8rpx rgba(255, 149, 0, 0.2);
		}

		.add-icon {
			color: #FFFFFF;
			font-size: 60rpx;
			font-weight: 300;
			line-height: 1;
			margin-top: -4rpx;
		}
	}

	&.share {
		bottom: 280rpx;
		background: #ffffff;
		box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.3);

		&:active {
			box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.2);
		}

		.share-icon {
			width: 50rpx;
			height: 50rpx;
		}
	}

	&.demo {
		bottom: 340rpx;
		background: #8B5CF6;
		box-shadow: 0 4rpx 16rpx rgba(139, 92, 246, 0.3);

		&:active {
			box-shadow: 0 2rpx 8rpx rgba(139, 92, 246, 0.2);
		}

		.demo-icon {
			color: #FFFFFF;
			font-size: 40rpx;
		}
	}
}

/* 演示弹出层样式 */
.demo-popup-content {
	min-height: 400rpx;
	padding: 40rpx;
	background-color: #fff;
}

.demo-popup-header {
	text-align: center;
	margin-bottom: 30rpx;

	.demo-popup-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}
}

.demo-popup-body {
	.demo-menu-item {
		padding: 30rpx 0;
		border-bottom: 1px solid #f0f0f0;
		@include transition-fast;

		&:last-child {
			border-bottom: none;
		}

		&:active {
			background-color: #f8f9fa;
		}

		.demo-menu-text {
			font-size: 28rpx;
			color: #333;
			display: block;
			margin-bottom: 8rpx;
			font-weight: 500;
		}

		.demo-menu-desc {
			font-size: 24rpx;
			color: #999;
		}
	}
}

@media screen and (min-width: 768px) {
	.dish-list-horizontal {
		flex-direction: row;
		flex-wrap: wrap;
	}
}

/* 编辑模式提示样式 */
.edit-tip {
	padding: 20rpx 30rpx;
	background-color: #FEF3C7;
	border-bottom: 1px solid #FDE68A;
}

.tip-text {
	font-size: 24rpx;
	color: #92400E;
	line-height: 1.4;
}

/* 多选删除模式样式 */
.multi-select-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #F8FAFC;
	border-bottom: 1px solid $border-color;
	position: sticky;
	top: 0;
	z-index: 10;
}

.multi-select-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;

	.multi-select-title {
		font-size: 28rpx;
		font-weight: 600;
		color: $text-color;
	}

	.selected-count {
		font-size: 24rpx;
		color: $text-color-light;
	}
}

.multi-select-actions {
	display: flex;
	gap: 16rpx;

	.action-btn {
		padding: 12rpx 20rpx;
		border-radius: 8rpx;
		background-color: $primary-light;
		@include transition-fast;

		&.delete {
			background-color: #FEE2E2;
		}

		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}

		&:active {
			transform: scale(0.95);
		}

		.action-text {
			font-size: 24rpx;
			color: $primary-color;
			font-weight: 500;
		}
	}
}
</style>
```
