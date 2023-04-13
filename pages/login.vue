<template>
	<view class="content">
		<view class="title">
			<view>你好,</view>
			<view>欢迎登陆Zane Mood</view>
		</view>
		<!-- 登陆 wx不支持:style-->
		<view class="pagePre" v-if="isLogin">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="" name="name" required>
					<input type="text" v-model="formData.name" placeholder="请输入用户名"/>
				</uni-forms-item>
				<uni-forms-item label="" name="psw" required>
					<input type="password" v-model="formData.psw" placeholder="请输入密码"/>
				</uni-forms-item>
			</uni-forms>
		</view>
		<!-- 注册 所以分开-->
		<view class="pageNext" v-else>
			<uni-forms :modelValue="formData">
				<uni-forms-item name="userImg" >
					<uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles" 
						file-mediatype="image" @select="setUserImg" v-model="formData.userImg"
						class="selectImg"
					/>
					<text class="autoImgText">点击头像更换</text>
				</uni-forms-item>
				<uni-forms-item label="" name="nickname" required>
					<input type="text" v-model="formData.nickname" placeholder="请输入昵称"/>
				</uni-forms-item>
				<uni-forms-item label="" name="name" required>
					<input type="text" v-model="formData.name" placeholder="请输入用户名"/>
				</uni-forms-item>
				<uni-forms-item label="" name="psw" required>
					<input type="password" v-model="formData.psw" placeholder="请输入密码"/>
				</uni-forms-item>
				<uni-forms-item label="" name="mood" required>
					<input type="text" v-model="formData.mood" placeholder="记录此刻心情"/>
				</uni-forms-item>
				<uni-forms-item label="" name="sexs">
					<uni-data-checkbox v-model="formData.sex" :localdata="sexs" class="sexLab"/>
				</uni-forms-item>
			</uni-forms>
		</view>
		<view v-if="!isLogin">
			<button class="submitBtn" @click="sumbit(2)" >注册</button>
			<view class="register">已有账号，点击<text class="registerBtn" @click="onLoginOrRegister()"> 登陆</text></view>
		</view>
		<view v-else>
			<button class="submitBtn" @click="sumbit(1)" >登陆</button>
			<view class="register">没有账号，点击<text class="registerBtn" @click="onLoginOrRegister()"> 注册</text></view>
			<view class="register">忘了密码?你重新注册算了，懒得写了</view>
		</view>
	</view>
</template>

<script>
	import pic from './../static/login.jpeg'
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
				isLogin:true,//true登陆-false注册
				formData:{
					userImg:[{
						url: pic,
						extname: 'png',
						name: '默认头像.png',
					}],
					nickname:'',
					name:'',
					psw:'',
					mood:'',
					sex:3
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
				showPsw:false,
			}
		},
		methods: {
			setUserImg(img){
				this.formData.userImg = [{
					url:img.tempFiles[0].url,
					extname: img.tempFiles[0].extname,
					name: img.tempFiles[0].name,
				}]
			},
			sumbit(type){
				if(!this.isLogin && (!this.formData.nickname || !this.formData.name || !this.formData.psw || !this.formData.mood) ||
					this.isLogin && (!this.formData.name || !this.formData.psw)
				){
					uni.showModal({
						content: '必填项不能为空',
						showCancel: false
					});
					return
				}
				if(!this.isLogin && (this.formData.nickname.length<4 || this.formData.name.length<4 || this.formData.psw.length<4)){
					uni.showModal({
						content: '昵称/用户/密码你多写几个字不行吗？至少4个字符',
						showCancel: false
					});
					return
				}
				if(!this.isLogin && this.formData.name == 'admin'){
					uni.showModal({
						content: '不要用这个用户名，留给我',
						showCancel: false
					});
					return
				}
				const userType = type==1?'sign':'create';
				const _this = this;
				this.$http.post('users',{...this.formData,userType}).then(result=>{
					uni.showToast({
						title: result.msg,
						icon:result.code == 10?'success':'error',
						mask: true
					})
					if(result.code == 10){
						_this.$store.dispatch('setUserInfo',result.info)
						_this.$store.dispatch('setLoginTime',result.time)
						uni.redirectTo({
							url: 'index'
						});
					}
				})
			},
			onLoginOrRegister(){
				this.isLogin = !this.isLogin;
				this.formData = {
					userImg:[{
						url: pic,
						extname: 'png',
						name: '默认头像.png',
					}],
					nickname:'',
					name:'',
					psw:'',
					sex:3
				}
			}
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 10% 10%;
		font-size: 25px;
	}
	.uni-forms{
		input{
			border-bottom: 1px solid #ddd;
		}
		.uni-icons{
			position: absolute;
			right: 0;
			top: -8px;
			font-size: 25px !important;
			color: #979797 !important;
		}
	}
	.pagePre{
		padding-top:40%
	}
	.pageNext{
		padding-top:10%
	}
	.autoImgText{
		text-align: center;
		color: #979797;
		display: block;
		margin: 5px 15px;
	}
	::v-deep .uni-file-picker__container{
		justify-content: center;
	}
	.submitBtn{
		background-color: #6374fb;
		color: #fff;
		border-radius: 15px;
	}
	.register{
		font-size: 14px;
		text-align: right;
		margin-top: 20px;
		color: #979797;
		.registerBtn{
			color: #6374fb;
			font-size: 14px;
		}
	}
	::v-deep .uni-modal{
		top: 45%;
	}
	::v-deep .sexLab .checklist-text{
		font-size: 16px !important;
	}
</style>
