<template>
	<view class="pageSty">
		<view class="user_msg">
			<image :src="userInfo.userImg[0].url" alt="头像" class="user_pic" @click="imgOpera" />
			<view class="rig_info">
				<view>{{userInfo.nickname}}</view>
				<view class="user_mood">{{userInfo.mood}}</view>
				<view class="settBtn">
					<uni-icons type="gear" class="icons"/>
					<text @click="toSettingPage" v-show="userId == userInfo._id">修改</text>
				</view>
			</view>
		</view>
		<view class="tab">
			<text :class="['tabType',tabClick==1?'active':'']" @click="changeTab(1)">作品</text>
			<text :class="['tabType',tabClick==2?'active':'']" @click="changeTab(2)">喜欢</text>
		</view>
		<listComponent :scrollHeight="'calc(100% - 240px)'" :absTop="'240px'" :list="showList" :emptyTxt="'没有数据哦，要不你多发点咯'"/>
	</view>
	<!-- 预览头像 -->
	<previewImage :save-btn="false" ref="previewImage" :imgs="[userInfo.userImg[0].url]" :descs="['头像']"/>
</template>

<script>
	import previewImage from '@/components/kxj-previewImage.vue';
	import upBelow from '@/components/up-Below.vue'
	import listComponent from '@/components/listComponent.vue'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				tabClick:1,
				list:[],
				showList:[],
				userId:''
			};
		},
		components:{previewImage,upBelow,listComponent},
		onLoad(option) {
			this.userId = option?.userId || this.userInfo._id
			this.getAccountPageList()
		},
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length-1]
			if(currPage.isRefresh){
				this.getAccountPageList()
				currPage.isRefresh = false
			}
		},
		methods:{
			getAccountPageList(){
				this.$http.post('userPublish',{userId:this.userId,type:'get'}).then(result=>{
					this.list = result?.list?.data || [];
					this.showList = result?.list?.data || [];
				})
			},
			imgOpera(){
				this.$refs.previewImage.open(this.userInfo.userImg[0].url);
			},
			changeTab(type){
				const list = this.list
				this.tabClick = type;
				if(type == 2){
					this.showList = list.filter(k=> !!k.userLike)
				}else{
					this.showList = this.list
				}
			},
			toSettingPage(){
				uni.navigateTo({
					url: 'setting'
				});
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
	}
</script>

<style lang="scss">
	.pageSty{
		padding: 84upx 40upx 0;
		.user_msg{
			padding-bottom: 40upx;
			display: flex;
			justify-content: left;
			border-bottom: 1px solid #ddd;
			.rig_info{
				margin-left: 40upx;
				margin-top: 30upx;
				.user_mood{
					color: #686968;
					font-size: 25upx;
				}
			}
			.user_pic{
				width: 200upx;
				height: 200upx;
				border-radius: 50%;
				border:2upx solid #ddd;
			}
			.settBtn{
				width: 80px;
				border: 1px solid none;
				border-radius: 5px;
				margin-top: 15px;
				text-align: center;
				color: #fff;
				background-color: #6374fb;
				padding: 2px;
			}
			.icons ,.icons text{
				color: #fff !important;
				margin-right: 5px;
			}
		}
		.tab{
			display: flex;
			padding-top: 40upx;
			justify-content: space-around;
			.tabType{
				line-height: 60upx;
				border: 1px solid #ddd;
				width: 50%;
				text-align: center;
				color: #686968;
				font-size:25upx;
				&:nth-child(1){
					border-right: 0;
					border-radius: 5px 0 0 5px;
				}
				&:nth-child(2){
					border-radius: 0 5px 5px 0;
				}
			}
			.active{
				border-color: #6374fb;
				background-color: #6374fb;
				color: #fff;
			}
		}
	}
</style>
