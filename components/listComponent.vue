<template>
	<upBelow @pulldown="pulldown" :scrollHeight="scrollHeight" :absTop="absTop">
		<template v-slot:content>
			<view class="showList">
				<view :class="['list',inx%2==0?'marlef':'']" v-for="(k,inx) in list" @click="toDetail(k)" v-if="list.length">
					<view class="imgSty">
						<image :src="k.src" alt="pictry" class="listImg"/>
						<uni-icons type="heart-filled" class="like" v-show="k.userLike"></uni-icons>
					</view>
					<view class="txt" style="min-height: 36px">{{k.content}}</view>
					<view :class="['txt',k.content?'':'pt']">{{k.time}}</view>
				</view>
				<luanqing-empty v-else :show="true" :text="emptyTxt" textColor="#999"></luanqing-empty>
			</view>
		</template>
	</upBelow>
	
</template>

<script>
	import upBelow from '@/components/up-Below.vue'
	export default {
		name: "listComponent",
		props: ["scrollHeight","absTop","list","emptyTxt"],
		data() {
			return {
			};
		},
		components:{upBelow},
		methods:{
			pulldown(e){
				let {stop}=e;
				setTimeout(()=>{
					stop();
				},1000)
			},
			toDetail(item){
				uni.navigateTo({
					url: `detailsPage?time=${item.time}&_id=${item._id}`
				});
			},
		}
	}
</script>

<style lang="scss">
	.showList {
		position: absolute;
		left: 0;
		padding: 20px;
		padding-bottom: 0;
		width: calc(100% - 40px);
		.list {
			width: 49%;
			height: 310px;
			display: inline-block;
			float: left;
			margin-bottom: 20px;
			border: 1px solid #f2f2f2;
			box-sizing: border-box;
		}
		.listImg {
			width: 100%;
			border-bottom: 1px solid #f2f2f2
		}
		.marlef {
			margin-right: 2%;
		}
		.txt {
			font-size: 13px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			padding-left: 10px;
		}
		.pt{
			padding-top: 20px;
		}
		.imgSty{
			position: relative;
		}
		.like ,.like text{
			position: absolute;
			bottom: 4%;
			right: 5%;
			font-size: 20px !important;
			color: #e4393c !important;
		}
	}
</style>
