<template>
	<view class="settingForm">
		<uni-forms ref="baseForm" :modelValue="baseFormData">
			<uni-forms-item label="头像修改:">
				<uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles"
					file-mediatype="image" @select="setUserImg" v-model="userInfo.userImg"
					class="selectImg"
				/>
			</uni-forms-item>
			<uni-forms-item label="昵称:" required>
				<input type="text" v-model="baseFormData.nickname" :placeholder="userInfo.nickname"/>
			</uni-forms-item>
			<uni-forms-item label="用户名:" required>
				<input type="text" v-model="baseFormData.name" :placeholder="userInfo.name"/>
			</uni-forms-item>
			<uni-forms-item label="密码:" required>
				<input type="password" v-model="baseFormData.psw" placeholder="请输入新密码(不填默认旧密码)"/>
			</uni-forms-item>
			<uni-forms-item label="性别:">
				<uni-data-checkbox v-model="userInfo.sex" :localdata="sexs" @change="changeSex"/>
			</uni-forms-item>
			<uni-forms-item label="动态:" required>
				<input type="text" v-model="baseFormData.mood" :placeholder="userInfo.mood"/>
			</uni-forms-item>
		</uni-forms>
		<button @click="sumbit">确认</button>
	</view>
</template>

<script>
	import previewImage from '@/components/kxj-previewImage.vue';
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				imageStyles: {
					width: 120,
					height: 120,
					border: {
						radius: '50%'
					}
				},
				baseFormData: {
					_id:'',
					userImg:[{
						url: '',
						extname: 'png',
						name: '默认头像.png',
					}],
					nickname: '',
					name: '',
					psw:'',
					sex: '',
					mood:'',
				},
				sexs: [{
					text: '男',
					value: 1
				}, {
					text: '女',
					value: 2
				}, {
					text: '保密',
					value: 3
				}],
			};
		},
		methods:{
			setUserImg(img){
				this.baseFormData.userImg = [{
					url: img.tempFiles[0].url,
					extname: img.tempFiles[0].extname,
					name: img.tempFiles[0].name,
				}]
			},
			changeSex(e){
				this.baseFormData.sex = e.detail.data.value
			},
			sumbit(){
				let newInfo = {};
				const _this = this;
				const newObj = this.baseFormData;
				const oldObj = this.userInfo;
				console.log(this.baseFormData)
				for(let key in newObj){
					if(!newObj[key] && oldObj[key] || key=='userImg'&& !newObj[key].url){
						this.baseFormData[key] = oldObj[key]
					}
				}
				_this.$uniCloud('upUserInfo', {..._this.baseFormData,upKey:'all'}).then(res=>{
					const { result } = res
					uni.showToast({
						title: result.msg,
						icon:'success',
						mask: true
					})
					if(result.code == 10){
						_this.$store.dispatch('setUserInfo',result.info)
					}
					uni.redirectTo({
						url: 'index'
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
	::v-deep .uni-file-picker__container{
		justify-content: left;
		margin-bottom: 22px;
	}
	.settingForm{
		padding: 30px;
		::v-deep .uni-forms-item__label{
			width: 25% !important;
		}
		.uni-forms-item__content input{
			font-size: 13px;
			height: 100%;
			border-bottom:1px solid #ddd ;
		}
	}
	uni-button,button{
		margin-top: 40px;
		background-color: #6374fb;
		color: #fff;
	}
</style>
