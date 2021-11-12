import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/auth.vue/login.vue";
import Signup from "@/views/auth.vue/signup.vue";
import createProfil from "@/views/createProfil.vue";

const routes = [
    {
        name: 'login',
        path: '/',
        component: Login,
    },
    {
        name: 'signup',
        path: '/signup',
        component: Signup,
        props: true
    },
    {
        name: 'profil',
        path: '/createProfil',
        component: createProfil,

    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;