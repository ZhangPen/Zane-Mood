<template>
	<listComponent :list="list" :scrollHeight="'100%'" :absTop="0" :emptyTxt="'没有数据哦，你要记得点爱心才能收藏'"/>
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
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length-1]
			if(currPage.isRefresh){
				this.getCollectPageList()
				currPage.isRefresh = false
			}
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
