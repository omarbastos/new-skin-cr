import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
Vue.use(VueRouter);
// ...
const routerOptions = [
  { path: '/', name: 'Home' },
  { path: '/carrito', name: 'Cart', meta: { requiresAuth: true } },
  { path: '/error', name: 'Error' },
  { path: '/catalogo', name: 'Catalogo' },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: (to, from, next) => {
      if (!store.state.auth.loggedIn) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/register',
    name: 'Register',
    beforeEnter: (to, from, next) => {
      if (!store.state.auth.loggedIn) {
        next();
      } else {
        next('/');
      }
    },
  },
  { path: '/profile', name: 'Profile', meta: { requiresAuth: true } },
  { path: '/verify', name: 'Verify' },
  {
    path: '/admin',
    name: 'Admin',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin/products',
    name: 'Admin/Products',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    name: 'Privacy',
    path: '/privacy',
  },
  {
    name: 'Product',
    path: '/product/:id',
  },
  {
    name: 'Paypal',
    path: '/order/:id',
    meta: { requiresAuth: true },
  },
  {
    name: 'Admin/Ordenes',
    path: '/admin/ordenes',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    name: 'Admin/Products/Edit',
    path: '/admin/product/:id',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    name: 'Admin/Usuarios',
    path: '/admin/usuarios',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    name: 'Admin/OrderProfile',
    path: '/admin/order/:id',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    name: 'Ordenes',
    path: '/ordenes',
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/products/new',
    name: 'Admin/Products/New',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin/costos-de-envio',
    name: 'Admin/CostosDeEnvio',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin/category',
    name: 'Admin/Category',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin/size',
    name: 'Admin/Size',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin/colors',
    name: 'Admin/Colors',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/admin/banner',
    name: 'Admin/Banner',
    beforeEnter: (to, from, next) => {
      if (store.state.auth.user.admin) {
        next();
      } else {
        next('/login');
      }
    },
  },
  { path: '*', redirect: { name: 'Home' } },
];
const routes = routerOptions.map((r) => {
  return {
    ...r,
    component: () =>
      import(/* webpackChunkName: "[request]" */ `@/views/${r.name}/Index.vue`),
  };
});
const router = new VueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes,
});
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.auth.loggedIn;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
  /* 
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login", "/register", "/catalogo", "/", "/verify"];
  const authRequired = !publicPages.includes(to.path);

  const loggedIn = store.state.auth.loggedIn;
  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next(); */
});
export default router;
