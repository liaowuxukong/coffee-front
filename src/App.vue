<template>
  <div>
    <!-- 头部 -->
    <v-header></v-header>
    <!-- 主体切换 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  export default {
    components: {
      'v-header': header
    },
    created() {
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import 'common/stylus/mixin.styl';

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  /* border: 1px solid rgba(7,17,27,0.1); */
  border-1px(rgba(7, 17, 27, 0.1));
}

.tab .tab-item {
  flex: 1;
  text-align: center;
}

.tab .tab-item a {
  display: block;
  font-size: 14px;
  color: rgb(77, 85, 93);
}

.tab .tab-item .active {
  color: rgb(240, 20, 20);
}
</style>
