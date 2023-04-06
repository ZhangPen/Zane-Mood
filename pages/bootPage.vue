<template>
	<view class="content">
		<uni-transition ref="ani" custom-class="transition" :mode-class="['fade', 'zoom-in']" :show="show" :duration="3000">
			<image class="login_img" src="./../static/login.jpeg"/>
			<view class="title">一种不一样的记事本</view>
		</uni-transition>
		<view class="btn" @click="toHome">
			跳过 {{count}}s
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				count:5,
				timer:null
			}
		},
		onShow() {
			const that = this;
			this.show = true;
			this.timer = setInterval(function() {
				that.count--;
				if(that.count==0){
					that.toHome()
					clearInterval(that.timer);
					that.timer = null;
				}
		 	}, 1000);
		},
		onHide() {//离开页面前清除计时器
			clearInterval(this.timer);
			this.timer = null;
		},
		methods: {
			toHome(){
				clearInterval(this.timer);
				this.timer = null;
				uni.redirectTo({
					url: 'login'
				});
			}
		},
	}
</script>

<style lang="scss">
	.content {
		height: calc(100vh - 44px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.login_img {
			margin-top: -20%;
		}
		.title {
			font-size: 15px;
			background-image: linear-gradient(#403fcd, #d504ff);
			background-clip: text;
			color: transparent;
			-webkit-background-clip: text;
			text-align: center;
		}
		.btn{
			position: absolute;
			right: 20px;
			bottom: 20px;
			color: #fff;
			background: #ddd;
			border-radius: 20px;
			padding: 5px 10px;
			font-size: 13px;
		}
	}
</style>
