<template>
  <div class="wrapper">
    <div style="margin:auto; width: 80%">
      <el-carousel :interval="4000" type="card" height="350px">
        <el-carousel-item style="border-radius: 10px" v-for="item in imgList" :key="item">
          <img style="width:100%;height:350px;object-fit: cover" :src="item">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="box">
      <router-link to="/hardware">
        <div class="boxtext" @mouseenter="mouseover($event)" @mouseleave="mouseleave($event)">硬件中心</div>
      </router-link>
    </div>
    <div class="box">
      <router-link to="/server">
        <div class="boxtext" @mouseenter="mouseover($event)" @mouseleave="mouseleave($event)">服务中心</div>
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  data () {
    return {
      imgList: [
        require('@/assets/banner/1.jpg'),
        require('@/assets/banner/2.jpg'),
        require('@/assets/banner/3.jpg')]
    }
  },
  methods: {
    mouseover (e) {
      e.currentTarget.className = 'boxhover'
    },
    mouseleave (e) {
      e.currentTarget.className = 'boxtext'
    }
  }
}
</script>

<style>

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.wrapper {
  padding-top: 100px;
  background: url("../assets/bg2.png");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 105%;
}

.box {
  width: 200px;
  height: 100px;
  display: inline-block;
  margin-top: 100px;
  margin-left: 100px;
  margin-right: 100px;
}

.boxhover {
  background-color: aliceblue;
  border-radius: 10px;
  opacity: 0.9;
  font-size: 23px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: aqua;
  width: 100%;
  height: 100%;
  line-height: 100px;
}

.boxtext {
  background-color: aliceblue;
  border-radius: 10px;
  opacity: 0.5;
  font-size: 25px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-weight: bold;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  line-height: 100px;
}

</style>
