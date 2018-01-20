<template>
  <div class="header">
    <div class="content-wrapper">
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span>
    </div>
    <div class="background">
      <img :src="banner.picUrl" alt="" class="" width="100%" height="100%">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: [],
    data() {
      return {
        detailShow: false,
        banner: ''
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    mounted() {
      this.$http.get('http://127.0.0.1:7001/bannerList')
        .then(function (response) {
        this.banner = response.body[0];
      });
    },
    components: {
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "header.styl";
</style>
