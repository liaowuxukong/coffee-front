// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import 'common/stylus/index.styl';
// 安装 "VueRouter"这个插件
/* eslint-disable no-new */
Vue.use(VueRouter);
Vue.use(VueResource);
let routes = [
  {path: '/', name: '/index', component: App, children: [{path: '/goods', component: goods}]}
];
let router = new VueRouter({
  'linkActiveClass': 'active',
   routes // （缩写）相当于 routes: routes
});
let app = new Vue({
  router
}).$mount('#app');
router.push({path: '/goods'});
export default app;
