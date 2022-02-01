import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Profil from "../views/Profil.vue";
import CreateProfil from "../views/CreateProfil.vue";
import Feed from "../views/Feed.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/Signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/Profil",
    name: "Profil",
    component: Profil,
  },
  {
    path: "/CreateProfil",
    name: "CreateProfil",
    component: CreateProfil,
  },
  {
    path: "/Feed",
    name: "Feed",
    component: Feed,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
