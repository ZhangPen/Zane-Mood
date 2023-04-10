<template>
	<listComponent :list="list" :scrollHeight="'100%'" :absTop="0"/>
	<view>
	</view>
</template>

<script>
	import listComponent from '@/components/listComponent.vue'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				list:[]
			};
		},
		components:{listComponent},
		onLoad() {
			this.getCollectPageList()
		},
		methods:{
			getCollectPageList(){
				this.$http.post('userPublish',{userId:this.userInfo._id,type:'get'}).then(result=>{
					let arr = result?.list?.data || [];
					this.list = arr.filter(k=> !!k.userLike)
				})
			},
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">

</style>
