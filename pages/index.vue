<template>
	<view class="content">
		<!-- 顶部 -->
		<view class="header">
			<uni-icons type="person" size="20" @click="individual"></uni-icons>
			<view class="selectTime" @click="selectionDay">
				<text>{{selectDate}}</text>
				<uni-icons type="bottom" size="20" v-if="!isShowCalendar"></uni-icons>
				<uni-icons type="top" size="20" v-else></uni-icons>
			</view>
			<uni-icons type="search" size="20" @click="toSearch"></uni-icons>
		</view>
		<view class="kb"></view>
		<view v-show="!isShowCalendar">
			<view v-if="mianList.length">
				<view v-for="(item,key) in mianList" class="listSty" @click="toDetail(item)">
					<view :style="{'backgroundImage':`url(${item.src})`}" v-if="item.src" class="listImg"></view>
					<view v-if="item.content" class="listText">{{item.content}}</view>
					<view class="listTime">{{item.time}}</view>
				</view>
			</view>
			<luanqing-empty v-else :show="true" text="没有数据哦，要不你多发点咯" textColor="#999"></luanqing-empty>
		</view>
	</view>
	<!-- 抽屉 -->
	<userDeawer ref="userDeawer"/>
	<!-- 日历 -->
	<uni-calendar :insert="isShowCalendar" :lunar="true" @change="change">
	</uni-calendar>
	<!-- 公共按钮 -->
	<view class="globalBtn">
		<uni-icons type="compose" @click="operation"></uni-icons>
		<uni-icons type="calendar-filled" @click="selectionDay"></uni-icons>
	</view>
	<!-- 头像弹出 -->
	<uni-popup ref="imgPopup" type="bottom" :animation="false" background-color="#fff">
		<view class="popup-content" >
			<view class="text" @click="previewPic">预览</view>
			<view class="text" @click="upLoadImg">选择头像</view>
			<view class="text" @click="cancelPop">取消</view>
		</view>
	</uni-popup>
	<!-- 头像预览 -->
	<previewImage :save-btn="false" ref="previewImage" :imgs="[userInfo.userImg[0].url || '']" :descs="['头像']"/>
</template>

<script>
	import userDeawer from "../components/user.vue"
	import previewImage from '@/components/kxj-previewImage.vue';
	
	export default {
		data() {
			return {
				userInfo:{},
				selectDate: '',
				isShowCalendar: false,
				mianList:[]
			};
		},
		components:{
			userDeawer,
			previewImage
		},
		onLoad(option) {
			if(option.date){
				this.selectDate = this.$commonFn.format(option.date, 'yyyy/MM/dd')
			}else{
				this.selectDate = this.$commonFn.format(new Date(), 'yyyy/MM/dd')
			}
			this.userInfo = this.$store.state.userInfo;
			if(!this.userInfo.name || !this.userInfo.psw || this.$commonFn.isLogin(this.$store.state.loginTime)){
				uni.showToast({
					title: '信息错误,请重新登陆',
					icon:'error',
					mask: true
				})
				uni.redirectTo({
					url: 'login'
				});
				return;
			}
			this.getMianList()
		},
		methods: {
			getMianList(){
				this.$uniCloud('publicData',{type:'get',time:this.selectDate}).then(res=>{
					const { result } = res
					this.mianList = result?.list?.data || []
				})
			},
			individual(){
				this.$refs.userDeawer.showDrawer();
			},
			toSearch(){
				uni.navigateTo({
					url: 'searchPage'
				});
			},
			change(data) {
				this.selectDate = data.fulldate.replace(/-/ig, '/')
				this.isShowCalendar = false
				console.log('查询对应日期数据')
				this.$uniCloud('publicData',{type:'get',time:this.selectDate}).then(res=>{
					const { result } = res
					this.mianList = result?.list?.data || []
				})
			},
			toDetail(item){
				uni.navigateTo({
					url: `detailsPage?time=${item.time}&_id=${item._id}`
				});
			},
			operation() {
				const selectDate = this.selectDate;
				uni.navigateTo({
					url: 'releasePage?date=' + selectDate
				});
			},
			selectionDay() {
				this.isShowCalendar = !this.isShowCalendar
			},
			previewPic(){
				this.$refs.previewImage.open(this.userInfo.userImg[0].url);
			},
			upLoadImg(){
				const _this = this;
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFiles[0];
						_this.userInfo.userImg = [{
							url: src.path,
							extname: src.type,
							name:src.name
						}];
						console.log('接口==设置头像',_this.userInfo);
						_this.$uniCloud('upUserInfo', {..._this.userInfo,upKey:'userImg'}).then(res=>{
							const { result } = res
							uni.showToast({
								title: result.msg,
								icon:'success',
								mask: true
							})
							if(result.code == 10){
								_this.$store.dispatch('setUserImg',_this.userInfo.userImg)
							}
						})
						_this.$refs.imgPopup.close();
						_this.$refs.userDeawer.showDrawer();
					}
				});
			},
			cancelPop(){
				this.$refs.imgPopup.close();
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #fff;
		// height: 100vh;
		.header {
			height: 40px;
			line-height: 40px;
			position: fixed;
			width: calc(100% - 40px);
			padding: 0 20px;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			margin-bottom: 15px;
			.selectTime {
				text-align: center;
			}
		}
		.kb{
			height: 40px;
			background-color: #fff;
		}
	}
	.globalBtn {
		position: fixed;
		right: 10px;
		bottom: 25px;
		.uni-icons {
			color: #6374fb !important;
			font-size: 30px !important;
			margin: auto 10px;
		}
	}
	.popup-content {
		z-index: 99;
		background-color: #fff;
		.text{
			padding: 15px 0;
			text-align: center;
			font-size: 13px;
		}
	}
	.listSty{
		margin: 10px 20px;
		padding-bottom:10px;
		border: 1px solid #f2f2f2;
		background-color: #f2f2f2;
		font-size: 25upx;
		.listImg{
			width: 100%;
			height: 240px;
			background-size: cover;
		}
		.listText{
			text-align: center;
			padding: 10px;
		}
		.listTime{
			text-align: right;
			margin-top: 5px;
			padding-right: 20px;
		}
	}
</style>