<template>
	<view class="textSty">
		<textarea name="" id="" cols="30" rows="3" placeholder="记录此时此刻mood～" v-model="mood"></textarea>
		<uni-file-picker 
			v-model="moodImg" 
			fileMediatype="image" 
			limit="1" 
			:imageStyles="imageStyles"
			@success="success" 
		/>
		<view class="secret">
			仅个人主页可见:<switch name="switch" @change="change" style="transform:scale(0.7)"/>
		</view>
		<button @click="publish">发布</button>
	</view>
</template>

<script>
	import previewImage from '@/components/kxj-previewImage.vue';
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				imageStyles: {
					width: '100%',
					height: 200,
					border: {
						radius: 0,
					}
				},
				moodImg:[],
				mood:'',
				time:'',
				isSecret:false
			};
		},
		components:{
			previewImage
		},
		onLoad(options) {
			this.time = options.date;
		},
		methods:{
			success(img){
				this.moodImg = [{
					url: img.tempFiles[0].path,
					extname:img.tempFiles[0].extname,
					name:img.tempFiles[0].name
				}]
			},
			change(){
				this.isSecret = !this.isSecret;
			},
			publish(){
				setTimeout(()=>{
					let obj = {
						src:this.moodImg.length && this.moodImg[0].url,
						content:this.mood,
						time:this.time,
						isSecret:this.isSecret,
						userId:this.userInfo._id,
						nickname:this.userInfo.nickname,
						type:'add'
					}
					if(!obj.src && !obj.content){
						uni.showModal({
							content: '动态/图片不能同时为空',
							showCancel: false
						});
						return;
					}
					this.$http.post('userPublish',obj).then(result=>{
						uni.showToast({
							title: result.msg,
							icon:'success',
							mask: true
						})
						uni.redirectTo({
							url: 'index?date=' + obj.time
						});
					})
				},1000)
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
	}
</script>

<style lang="scss">
	.textSty{
		width: calc(100% - 40px);
		margin: 20px;
	}
	uni-textarea,textarea{
		width: calc(100% - 20px);
		padding: 10px;
		border: 1px solid #ddd;
	}
	uni-view.uni-file-picker{
		border: 1px solid #ddd;
	}
	::v-deep uni-view.file-picker__box-content{
		margin:0;
	}
	::v-deep uni-view.file-picker__box,.file-picker__box-content{
		background-color: #ddd;
	}
	::v-deep uni-view.file-picker__box-content.is-add{
		margin: 0;
	}
	uni-button,button{
		margin-top: 40px;
		background-color: #6374fb;
		color: #fff;
		clear: both;
	}
	.secret{
		margin: 20px 0;
		float: right;
	}
</style>
