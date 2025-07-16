/**
 * 拖拽排序 Mixin
 * 提供通用的拖拽排序功能，可在任何需要拖拽排序的组件中使用
 */
export default {
    data() {
        return {
            // 拖拽相关状态
            dragIndex: -1,
            dragOverIndex: -1,
            startY: 0,
            moveOffsetY: 0,
            positions: [],
            isDragging: false,
            
            // 配置项
            dragConfig: {
                itemHeight: 70, // 每个项目的高度
                gap: 10, // 项目间距
                enableVibration: true, // 是否启用震动反馈
                enableScale: true, // 是否启用缩放效果
                scaleValue: 1.05 // 缩放值
            }
        };
    },
    
    methods: {
        /**
         * 初始化拖拽配置
         * @param {Object} config 配置项
         */
        initDragConfig(config = {}) {
            this.dragConfig = { ...this.dragConfig, ...config };
        },
        
        /**
         * 初始化位置数组
         * @param {Array} items 项目数组
         */
        initPositions(items) {
            this.positions = [];
            const { itemHeight, gap } = this.dragConfig;
            items.forEach((_, index) => {
                this.positions.push({
                    y: index * (itemHeight + gap),
                    zIndex: 1
                });
            });
        },
        
        /**
         * 获取项目的位置样式
         * @param {Number} index 项目索引
         * @returns {Object} 样式对象
         */
        getPositionStyle(index) {
            const { itemHeight, gap, enableScale, scaleValue } = this.dragConfig;
            if (!this.positions[index]) return {};
            
            let y = this.positions[index].y;
            
            // 拖拽时动态让位
            if (this.isDragging && this.dragIndex !== -1 && this.dragOverIndex !== -1 && index !== this.dragIndex) {
                if (index > this.dragIndex && index <= this.dragOverIndex) {
                    y -= (itemHeight + gap);
                } else if (index < this.dragIndex && index >= this.dragOverIndex) {
                    y += (itemHeight + gap);
                }
            }
            
            const zIndex = (this.dragIndex === index && this.isDragging) ? 10 : 1;
            const transform = `translate3d(0, ${y}px, 0)`;
            const scale = (this.dragIndex === index && this.isDragging && enableScale) ? ` scale(${scaleValue})` : '';
            
            return {
                transform: transform + scale,
                zIndex
            };
        },
        
        /**
         * 拖拽开始事件
         * @param {Number} index 项目索引
         * @param {Event} event 触摸事件
         * @param {Boolean} isEditMode 是否为编辑模式
         */
        onDragStart(index, event, isEditMode = true) {
            if (!isEditMode) return;
            
            const touch = event.touches[0];
            this.dragIndex = index;
            this.dragOverIndex = index;
            this.startY = touch.clientY;
            this.moveOffsetY = 0;
            this.isDragging = true;
            this.positions[index].zIndex = 10;
            
            // 震动反馈
            if (this.dragConfig.enableVibration && uni && uni.vibrateShort) {
                uni.vibrateShort();
            }
            
            // 触发自定义事件
            this.$emit('drag-start', { index, event });
        },
        
        /**
         * 拖拽移动事件
         * @param {Event} event 触摸事件
         */
        onDragMove(event) {
            if (this.dragIndex === -1 || !this.isDragging) return;
            
            const touch = event.touches[0];
            const deltaY = touch.clientY - this.startY;
            this.moveOffsetY += deltaY;
            this.positions[this.dragIndex].y += deltaY;
            this.startY = touch.clientY;
            this.calcDragOverIndex();
            
            // 触发自定义事件
            this.$emit('drag-move', { event, deltaY });
        },
        
        /**
         * 拖拽结束事件
         * @param {Array} items 项目数组
         * @param {Function} onOrderChange 顺序变化回调
         */
        onDragEnd(items, onOrderChange) {
            if (this.dragIndex === -1) return;
            
            // 计算最终插入位置
            if (this.dragOverIndex !== this.dragIndex) {
                const moved = items.splice(this.dragIndex, 1)[0];
                items.splice(this.dragOverIndex, 0, moved);
            }
            
            this.snapAllItemsToGrid(items);
            this.isDragging = false;
            this.dragIndex = -1;
            this.dragOverIndex = -1;
            this.moveOffsetY = 0;
            
            // 触发顺序变化回调
            if (onOrderChange) {
                onOrderChange([...items]);
            }
            
            // 触发自定义事件
            this.$emit('drag-end', { newOrder: [...items] });
        },
        
        /**
         * 将所有项目对齐到网格
         * @param {Array} items 项目数组
         */
        snapAllItemsToGrid(items) {
            const { itemHeight, gap } = this.dragConfig;
            items.forEach((_, index) => {
                this.positions[index] = {
                    y: index * (itemHeight + gap),
                    zIndex: 1
                };
            });
        },
        
        /**
         * 计算拖拽目标位置
         */
        calcDragOverIndex() {
            const { itemHeight, gap } = this.dragConfig;
            const dragCenterY = this.positions[this.dragIndex].y + itemHeight / 2;
            let target = this.dragIndex;

            // 遍历所有项，找到拖拽项应该插入的位置
            for (let i = 0; i < this.positions.length; i++) {
                if (i === this.dragIndex) continue;

                const itemTop = this.positions[i].y;
                const itemCenter = itemTop + itemHeight / 2;

                // 如果拖拽项中心点超过目标项中心点，则插入到该位置
                if (dragCenterY < itemCenter) {
                    target = i;
                    break;
                }

                // 如果是最后一项，且拖拽项中心点超过最后一项中心点
                if (i === this.positions.length - 1 && dragCenterY > itemCenter) {
                    target = this.positions.length;
                }
            }

            // 边界处理：拖拽到最前面
            if (dragCenterY < this.positions[0].y + itemHeight / 2) {
                target = 0;
            }

            this.dragOverIndex = target;
        },
        
        /**
         * 重置拖拽状态
         */
        resetDragState() {
            this.dragIndex = -1;
            this.dragOverIndex = -1;
            this.startY = 0;
            this.moveOffsetY = 0;
            this.isDragging = false;
            this.positions = [];
        }
    }
}; 