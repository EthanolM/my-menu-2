/**
 * TabBar高度计算Mixin
 * 用于计算tabbar高度并在container中减去这个高度
 * 
 * 使用方法：
 * 1. 在页面中引入mixin：
 *    import tabBarMixin from '@/common/mixins/tabBarMixin.js';
 * 
 * 2. 在组件中使用mixin：
 *    export default {
 *      mixins: [tabBarMixin],
 *      // ... 其他配置
 *    }
 * 
 * 3. 在模板中使用动态高度：
 *    <view class="container" :style="{ height: getContainerHeight() }">
 * 
 * 4. 如果需要额外偏移量：
 *    <view class="container" :style="{ height: getContainerHeight(20) }">
 */

export default {
	data() {
		return {
			tabBarHeight: 0, // tabbar高度
		};
	},
	
	methods: {
		/**
		 * 获取tabbar高度
		 * 支持多种获取方式，确保兼容性
		 */
		getTabBarHeight() {
			try {
				// 方法1：通过系统信息获取（如果支持）
				const sysInfo = uni.getSystemInfoSync();
				if (sysInfo.tabBarHeight) {
					this.tabBarHeight = sysInfo.tabBarHeight;
					console.log('通过系统信息获取tabbar高度:', this.tabBarHeight);
					return;
				}
				
				// 方法2：通过查询选择器获取
				const query = uni.createSelectorQuery();
				query.select('.uni-tabbar').boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						this.tabBarHeight = res[0].height;
						console.log('通过选择器获取tabbar高度:', this.tabBarHeight);
					} else {
						// 方法3：使用默认值
						this.tabBarHeight = 50; // 默认50px
						console.log('使用默认tabbar高度:', this.tabBarHeight);
					}
				});
			} catch (e) {
				console.error('获取tabbar高度失败:', e);
				this.tabBarHeight = 50; // 默认50px
			}
		},
		
		/**
		 * 计算container高度
		 * @param {number} additionalOffset - 额外的偏移量
		 * @returns {string} CSS高度值
		 */
		getContainerHeight(additionalOffset = 0) {
			const totalOffset = this.tabBarHeight + additionalOffset;
			const heightValue = `calc(100vh - ${totalOffset}px)`;
			return heightValue;
		}
	},
	
	onReady() {
		// 在页面准备就绪时获取tabbar高度
		this.getTabBarHeight();
	}
}; 