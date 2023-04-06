<template>
	<view>
		<uni-search-bar v-model="searchValue" placeholder="请输入关键词(日期/内容)" clearButton="auto" cancelButton="none" @confirm="search" />
		<listComponent :list="list" :scrollHeight="'calc(100% - 60px)'" :absTop="'60px'" v-if="list.length"/>
		<luanqing-empty :show="true" text="有你要的吗？要不试试换换关键词" textColor="#999" v-else/>
	</view>
</template>

<script>
	import listComponent from '@/components/listComponent.vue'
	export default {
		data() {
			return {
				searchValue:'',
				list:[]
			}
		},
		components:{listComponent},
		methods: {
			search(){
				const key = this.searchValue;
				this.$uniCloud('publicData',{type:'search'}).then(res=>{
					const { result } = res
					const resContent = result?.list?.data || [];
					this.list = resContent.filter(k=>(k.content.indexOf(key)>-1 || k.time.indexOf(key)>-1))
				})
			},
			clear(){
				this.searchValue = '';
			},
		}
	}
</script>

<style>

</style>
