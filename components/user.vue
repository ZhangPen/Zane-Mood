<template>
	<view class="userDrawer">
		<uni-drawer ref="showRight" mode="left" :mask-click="true" :mask="true" class="drawer">
			<view class="user_top">
				<image :src="userInfo.userImg[0].url" alt="头像" class="picture" @click="imgOpera" />
				<view class="nickSty">{{userInfo.nickname}}</view>
				<input type="text" v-model="newMood" :placeholder="userInfo.mood || '记录心情状态～'" @blur="setMood" />
			</view>
			<view class="user_msg">
				<view class="user_li" @click="toPath('account')"><uni-icons type="vip" class="icon"/>个人中心</view>
				<view class="user_li" @click="toPath('list')"><uni-icons type="heart" class="icon"/>收藏/点赞列表</view>
				<view class="user_li" @click="toPath('login')"><uni-icons type="undo" class="icon"/>退出登陆</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: "user",
		data() {
			return {
				newMood:''
			};
		},
		methods: {
			showDrawer() {
				this.$refs.showRight.open();
			},
			imgOpera(e) {
				this.$refs.showRight.close();
				this.$parent.$refs.imgPopup.open()
			},
			setMood() {
				console.log('==== 设置心情分发储存 ===');
				this.$http.post('upUserInfo',{...this.userInfo,mood:this.newMood,upKey:'mood'}).then(result=>{
					if(result.code == 10){
						this.$store.dispatch('setMood',this.newMood)
					}
				})
			},
			toPath(type){
				this.$refs.showRight.close();
				const path = {
					account:'accountPage',
					list:'collectPage',
					login:'login'
				}
				if(type == 'login'){
					uni.redirectTo({
						url: 'login'
					});
					return
				}
				uni.navigateTo({
					url: path[type],
				});
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
	}
</script>

<style lang="scss" scoped>
	.userDrawer {
		text-align: center;
		font-size: 13px;
		::v-deep .uni-drawer__content{
			width: 170px;
		}
		.user_top {
			margin: 50% 0;
			.picture {
				width: 100px;
				height: 100px;
				border-radius: 50%;
				background-color: bisque;
				margin-bottom: 15px;
			}
			::v-deep .uni-input-placeholder{
				font-size: 13px;
			}
			input.uni-input-input{
				font-size: 10px;
			}
			.nickSty{
				font-size: 35upx;
			}
			input{
				color: #686968;
				margin-top: 10upx;
			}
		}
	}
	.user_msg{
		margin-top: 70%;
		text-align: left;
		padding-left: 25%;
	}
	::v-deep .user_li{
		padding: 10% 0;
	}
	.icon{
		margin-right: 12px;
	}
	::v-deep .drawer{
		z-index: 10 !important;
	}
</style>
