<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleList($event)">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="iconfont icon-gouwuche" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}" >￥{{totalPrice}}</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook">
              </div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fade">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">已选商品</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="shopcart-food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>￥{{food.price * food.count}}</span></div>
                <div class="cartControl-wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from '../cartControl/cartControl.vue';
  import BScroll from 'better-scroll';
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
  function onBridgeReady() {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            'appId': 'wx2421b1c4370ec43b',     //公众号名称，由商户传入
            'timeStamp': '1395712654',         //时间戳，自1970年以来的秒数
            'nonceStr': 'e61463f8efa94090b1f366cccfbbb444', //随机串
            'package': 'prepay_id=u802345jgfjsdfgsdg888',     
            'signType': 'MD5',         //微信签名方式
            'paySign': '70EA570631E4BB79628FBCA90534C63FF7FADD89' //微信签名
        },
        function(res){     
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            if(res.err_msg == 'get_brand_wcpay_request:ok' ) {
            }     
        }
    ); 
  }
  

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [{price: 20, count: 2}];
        }
      }
    },
    data () {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        return '结算';
      },
      payClass() {
        return 'enough';
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = false;
      },
      pay() {
        let selectIds = [];
        this.selectFoods.forEach((food) => {
          selectIds.push(food.id);
        });
        if (typeof WeixinJSBridge == "undefined") {
          if( document.addEventListener ) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          onBridgeReady();
        }

        window.alert('支付' + this.totalPrice + '元' + ',选择了如下id:' + selectIds.join(';') + ',货架id:' + getQueryString('id'));
        this.$http.post('http://www.ealam.cn/buy', {
          ids: selectIds
        }).then(function(response) {
          if (response.bodyText === 'success') {
            window.alert('ok');
          } else {
            window.alert('fail');
          }
        });
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
//          let rf = el.offestHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    components: {
      cartControl
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "shopCart.styl";
</style>
