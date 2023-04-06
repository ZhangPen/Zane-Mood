<template>
	<view class="status_bar">
		<!-- 这里是状态栏 -->
	</view>
	<view class="header">
		<uni-icons v-if="showBackIcon" type="arrow-left" @click="backButton" class="image"></uni-icons>
		<view v-else class="image"></view>
		<view class="title">{{title}}</view>
		<uni-icons @click="rightIconBtn.fn()" :type="rightIconBtn.type" class="image"></uni-icons>
	</view>
</template>

<script>
	export default {
		name: "accountPageBar",
		props:["showBackIcon","title","rightIconBtn"],
		data() {
			return {
			};
		},
		methods:{
			backButton(){
				uni.redirectTo({
					url: 'index'
				});
			},
		}
	}
</script>

<style lang="scss">
	.header {
		position: fixed;
		background: #fff;
		left: var(--window-left);
		right: var(--window-right);
		height:44px;
		line-height:44px;
		display: flex;
		overflow: hidden;
		justify-content: space-between;
		box-sizing: border-box;
		z-index: 998;
		transition-property: all;
		color: #686968;
		.title {
			display: flex;
			justify-content: center;
			font-size: 30upx;
			overflow: hidden;
		}
		.image {
			padding-left: 16upx;
			padding-right: 16upx;
			width: 40upx;
			&:before{
				font-size: 40upx;
				color: #686968;
			}
		}
	}
</style>
