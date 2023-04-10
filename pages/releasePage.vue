<template>
	<view class="textSty">
		<textarea name="" id="" cols="30" rows="3" placeholder="记录此时此刻mood～" v-model="mood"></textarea>
		<uni-file-picker limit="1" :imageStyles="imageStyles" disable-preview @select="setUserImg"></uni-file-picker>
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
				moodImg:[{
					url: '',
					extname: 'png',
					name: '默认头像.png',
				}],
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
			setUserImg(img){
				const _this = this;
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFiles[0];
						_this.moodImg = [{
							url: src.url,
							extname: src.extname,
							name: src.name,
						}]
					}
				});
			},
			change(){
				this.isSecret = !this.isSecret;
			},
			publish(){
				let obj = {
					src:this.moodImg[0].url,
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
