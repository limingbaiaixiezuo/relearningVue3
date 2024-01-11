import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import VisualizerComponent from '../views/Visualizer.vue'
// import MBNonUniformGridHeatmap from '@/components';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/HeatmapTest',
      name: 'HeatmapTest',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/heatmapTest.vue')
    }
    // {
    //   path: '/Visualizer',
    //   name: 'Visualizer',
    //   component: MBNonUniformGridHeatmap
    // }
  ]
})

export default router
