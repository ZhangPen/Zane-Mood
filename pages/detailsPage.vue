<template>
	<view class="detailSty">
		<image :src="item.src" alt="pictry" class="listImg"/>
		<view class="txt">{{item.content}}</view>
		<view class="txt lf">作者：{{item.nickname}}</view>
		<view class="txt rg">{{item.time}}</view>
	</view>
	<!-- 删除/点赞 -->
	<view class="opera">
		<view class="delTxt" v-show="item.userId == userInfo._id" @click="deleteDynamic"><uni-icons type='closeempty' color="#ddd"/>删除本条动态</view>
		<view class="icons">
			<span><uni-icons type='chat'/>{{showNumFormat(item.commentNum)}}</span>
			<span>
				<uni-icons type='heart' @click="beLike" v-if="!item.userLike"/>
				<uni-icons type='heart-filled' @click="beLike" v-else class="like"/>
				{{showNumFormat(item.likeNum)}}
			</span>
		</view>
	</view>
	<!-- 评论区 -->
	<view class="commentList">
		<upBelow @pulldown="pulldown" :scrollHeight="'calc(100% - 358px)'" :absTop="'358px'">
			<template v-slot:content>
				<view v-for="comment in item.commentList" class="commentUser">
					<view class="userSty">
						<image :src="comment.userImg[0].url" class="picture" @click="imgOpera(comment)" />
						<view class="listText">{{comment.nickname}}</view>
					</view>
					<view class="listComment">{{comment.comment}}</view>
					<view class="del" v-show="comment._id == userInfo._id">
						<uni-icons type='closeempty' @click="deleteComment(comment)"/>
					</view>
				</view>
			</template>
		</upBelow>
	</view>
	<!-- 删除动态弹出层 -->
	<uni-popup ref="delDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="取消" confirmText="确认" title="是否删除本条动态" @confirm="del"
		@close="cancel"/>
	</uni-popup>
	<!-- 删除评论弹出层 -->
	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="取消" confirmText="确认" title="是否删除评论" @confirm="dialogConfirm"
		@close="dialogClose"/>
	</uni-popup>
	<view class="ly_input">
		<input type="text" placeholder="说点什么" v-model="commentTxt"/>
		<view class="content" @click="commentResult" >评论</view>
	</view>
</template>

<script>
	import upBelow from '@/components/up-Below.vue'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				item:{},
				commentTxt:'',
				delInfo:{}
			};
		},
		components:{upBelow},
		onLoad(options) {
			this.$uniCloud('publicData',{...options,type:'get'}).then(res=>{
				const { result } = res;
				this.item = result?.list?.data?.[0] || {}
			})
		},
		methods:{
			pulldown(e){
				let {stop}=e;
				setTimeout(()=>{
					stop();
				},1000)
			},
			beLike(){
				this.item.userLike = !this.item.userLike;
				let isLike = this.item.userLike;
				let num = this.item.likeNum || 0;
				if(isLike){
					num++ ;
				}else if(num==0){
					num = 0;
				}else{
					num--;
				}
				const obj = {
					...this.item,
					userLike:isLike,
					likeNum:num,
					type:'upDate'
				}
				this.$uniCloud('publicData',obj).then(up=>{
					this.$uniCloud('publicData',{...this.item,type:'get'}).then(res=>{
						const { result } = res;
						this.item = result?.list?.data?.[0] || {}
					})
				})
			},
			showNumFormat(num){
				if(isNaN(num) || !num || num==='0') return 0;
				if(Number(num)>99){
					return '99+'
				}
				return num
			},
			// 删除本条动态
			deleteDynamic(){
				this.$refs.delDialog.open()
			},
			del(){
				this.$uniCloud('userPublish',{...this.item,type:'remove'}).then(res=>{
					const { result } = res
					uni.showToast({
						title: result.msg,
						icon:'success',
						mask: true
					})
					if(result.code == 10){
						uni.navigateBack({
							delta:1
						})
					}
				})
			},
			cancel(){
				
			},
			commentResult(){
				const userInfo = Object.assign({},this.userInfo)
				userInfo.comment = this.commentTxt;
				let itemCommentList = this.item.commentList || [];
				itemCommentList.push(userInfo)
				const obj = Object.assign(this.item,{commentList:itemCommentList})
				this.$uniCloud('publicData',{...obj,type:'upDate'}).then(up=>{
					this.$uniCloud('publicData',{...obj,type:'get'}).then(res=>{
						const { result } = res;
						this.item = result?.list?.data?.[0] || {}
						this.commentTxt = ''
					})
				})
			},
			imgOpera(comment){
				uni.navigateTo({
					url: 'accountPage?userId='+comment._id,
				});
			},
			// 删除评论
			deleteComment(comment){
				this.delInfo = comment;
				this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				let list = this.item.commentList;
				let delInfo = this.delInfo;
				let itemCommentList = list.filter(k=>{
					return delInfo._id == k._id && delInfo.comment != k.comment
				})
				const obj = Object.assign(this.item,{commentList:itemCommentList})
				this.$uniCloud('publicData',{...obj,type:'upDate'}).then(up=>{
					this.$uniCloud('publicData',{...obj,type:'get'}).then(res=>{
						const { result } = res;
						this.item = result?.list?.data?.[0] || {}
					})
				})
			},
			dialogClose(){
				this.$refs.alertDialog.close()
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
	}
</script>

<style lang="scss">
	.detailSty{
		padding: 10px 20px 20px;
		border-bottom: 1px solid #ddd;
		.listImg{
			width: 100%;
		}
		.txt{
			font-size: 13px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			padding-left: 10px;
		}
		.lf{
			float: left;
		}
		.rg{
			float: right;
		}
	}
	.opera{
		padding: 10px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.delTxt{
			color: #ddd;
			padding: 0 4px;
			border: 1px dashed #ddd;
		}
		.icons{
			span{
				margin-left: 10px;
			}
			.uni-icons{
				margin-right: 5px;
			}
		}
	}
	.ly_input{
		background-color: #fff;
		height: 60px;
		width: 100%;
		position: fixed;
		bottom: 0;
		box-shadow: -2rpx -6rpx 13rpx 0rpx rgba(0, 0, 0, 0.09);
		display: flex;
		align-items: center;
		padding: 0 20px;
		input{
			width: 65%;
			height: 40px;
			border-radius: 30rpx;
			border: 1rpx solid #2C405A;
			padding-left: 20px;
		}
		.content{
			font-size: 14px;
			color: #fff;
			text-align: center;
			padding: 10px 20px;
			margin-left: 20px;
			border-radius: 10px;
			background: #6374fb;
		}
	}
	.commentUser{
		display: flex;
		align-items: center;
		padding: 10px 20px;
		border-bottom: 1px dashed #ddd;
		.userSty{
			width: 50px;
			text-align: center;
			.listText{
				margin-top: -5px;
			}
			.picture{
				height: 40px;
				width: 40px;
				border-radius: 50%;
				border:1px solid #ddd;
			}
		}
		.listComment{
			width: calc(100% - 60px);
			font-size: 13px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			padding-left: 10px;
		}
		.del{
			width: 40px;
			text-align: center;
		}
	}
	.like ,.like text{
		color: #e4393c !important;
	}
</style>
