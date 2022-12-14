import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '个人元宇宙后台',
  },
  history: {type: 'hash'},
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: '语音识别',
      path: '/speech',
      component: './Speech',
    },
    {
      name: 'NFT选择',
      path: '/metamask',
      component: './Metamask',
    },
  ],
  npmClient: 'npm',
});
