/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/login/login'),
    redirect: '/login',
    meta: {
      title: '登录',
      keepAlive: false
    }
  },
  {
    path: '/home',
    component: () => import('@/views/home/index'),
    name:"Home",
    meta: {
      title: '首页',
      keepAlive: false
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login'),
    meta: {
      title: '登陆',
      keepAlive: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/register'),
    meta: {
      title: '注册',
      keepAlive: false
    }
  },
  {
    path: '/updatePassword',
    name: 'UpdatePassword',
    component: () => import('@/views/login/updatePassword'), // 路由懒加载
    meta: {
      title: '修改密码', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/index'), // 路由懒加载
    meta: {
      title: '关于我们', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/message/index'), // 路由懒加载
    meta: {
      title: '系统消息', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  },
  {
    path: '/messageDetails',
    name: 'MessageDetails',
    component: () => import('@/views/message/messageDetails'), // 路由懒加载
    meta: {
      title: '消息详情', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  },
  {
    path: '/inviteFriends',
    name: 'InviteFriends',
    component: () => import('@/views/inviteFriends/index'), // 路由懒加载
    meta: {
      title: '邀请好友', // 页面标题
      keepAlive: false // keep-alive 标识
    }
  },
  {
    path: '/myWallet',
    name: 'MyWallet',
    component: () => import('@/views/myWallet/index'),
    meta: {
      title: '我的钱包',
      keepAlive: false
    }
  },
  {
    path: '/myWalletDetails',
    name: 'mMWalletDetails',
    component: () => import('@/views/myWallet/myWalletDetails'),
    meta: {
      title: '明细详情',
      keepAlive: false
    }
  },
  {
    path: '/myDebt',
    name: 'MyDebt',
    component: () => import('@/views/myDebt/index'),
    meta: {
      title: '我的债务',
      keepAlive: false
    }
  },
  {
    path: '/myDebtDetails',
    name: 'MyDebtDetails',
    component: () => import('@/views/myDebt/myDebtDetails'),
    meta: {
      title: '债事详情',
      keepAlive: false
    }
  },
  {
    path: '/myDebtTips',
    name: 'MyDebtTips',
    component: () => import('@/views/myDebt/myDebtTips'),
    meta: {
      title: '信息详情',
      keepAlive: false
    }
  },
  {
    path: '/myRecord',
    name: 'MyRecord',
    component: () => import('@/views/myRecord/index'),
    meta: {
      title: '我要备案',
      keepAlive: false
    }
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/views/myRecord/pay'),
    meta: {
      title: '支付状态',
      keepAlive: false
    }
  },
  {
    path: '/myRecordForm',
    name: 'MyRecordForm',
    component: () => import('@/views/myRecord/myRecordForm'),
    meta: {
      title: '财务咨询登记表',
      keepAlive: false
    }
  },
  {
    path: '/myRecordDetails',
    name: 'MyRecordDetails',
    component: () => import('@/views/myRecord/myRecordDetails'),
    meta: {
      title: '备案信息登记表',
      keepAlive: false
    }
  },
]
