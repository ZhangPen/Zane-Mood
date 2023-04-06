<template>
	<scroll-view class="scroll-view" :style="{'height':scrollHeight,'top':absTop}" scroll-y="true" @scrolltoupper="bindscrolltoupper"
		@scrolltolower="bindscrolltolower" @scroll="bindscroll" @touchstart="touchstart" @touchmove="touchmove"
		@touchend="touchend">
		<view class="pulldown-loading-box" v-bind:style="'transform:translateY(115%)'" v-show="loading">
			<view class="loading"><uni-icons type="spinner-cycle"/></view>
		</view>
		<view class="main" v-bind:style="'transform:translateY('+offset*1+'rpx)'">
			<!-- 内容 -->
			<slot name="content"></slot>
			<!-- tab空位 -->
			<slot name="empty"></slot>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		props:['scrollHeight','absTop'],
		data() {
			return {
				offset: 0,
				onTheTop: true,
				touchSpot: {
					startX: 0,
					startY: 0
				},
				loading:false
			}
		},
		methods: {
			bindscrolltolower: function(e) {
				//可以从父组件传值统一控制上拉加载结束
				if (this.lock) return;
				this.lock = true;
				//上拉加载
				this.$emit("reachbottom", {
					stop: () => {
						this.lock = false;
					}
				});
			},
			bindscrolltoupper: function(e) {
				this.onTheTop = true;
			},
			bindscroll: function(e) {
				if (e.detail.scrollTop === 0) {
					this.onTheTop = true;
				} else {
					this.onTheTop = false;
				}
			},
			touchstart(e) {
				if (!this.onTheTop || !e.changedTouches[0]) return;
				const {
					pageX,
					pageY
				} = e.changedTouches[0];
				this.touchSpot.startX = pageX;
				this.touchSpot.startY = pageY;
			},
			touchmove(e) {
				//return//关闭下拉刷新
				if (!this.onTheTop || !e.changedTouches[0]) {
					return;
				} else if (!this.touchSpot.startX) {
					const {
						pageX,
						pageY
					} = e.changedTouches[0];
					this.touchSpot.startX = pageX;
					this.touchSpot.startY = pageY;

					return;
				}
				const {
					pageX,
					pageY
				} = e.changedTouches[0];
				let offset = (pageY - this.touchSpot.startY) / 2;
				this.offset = offset > 100 ? 100 : offset;
			},
			touchend(e) {
				// return
				const _this = this;
				if (this.offset >= 70) {
					if (this.offset < 100) {
						this.offset = 100;
					}
					this.loading = true
					// 下拉刷新
					this.$emit("pulldown", {
						stop: () => {
							_this.offset = 0
							_this.loading = false
						}
					});

				} else {
					this.offset = 0
				}
				this.resetTouchSpot();
			},
			resetTouchSpot() {
				this.touchSpot = {
					startX: 0,
					startY: 0
				};
			}
		}
	}
</script>

<style>
	.scroll-view {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
	}
	.pulldown-loading-box {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 3;
		transition: transform .3s;
	}
	.loading{
		text-align:center;
	}
	.main {
		transition: transform .3s;
	}
</style>
