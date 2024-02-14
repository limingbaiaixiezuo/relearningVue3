import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, Router  } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import VisualizerComponent from '../views/Visualizer.vue'
// import MBNonUniformGridHeatmap from '@/components';
const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/visualizer',
      name: 'visualizer',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TestChart.vue')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('../views/Loading/index.vue')
    },
    {
        path: '/Directive',
        name: 'Directive',
        component: () => import('../views/TestDirective.vue')
    }
    // {
    //   path: '/Visualizer',
    //   name: 'Visualizer',
    //   component: MBNonUniformGridHeatmap
    // }
  ]

const router: Router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL)
})

export default router
