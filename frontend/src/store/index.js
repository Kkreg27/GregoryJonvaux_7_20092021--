import { createStore } from "vuex";
const axios = require("axios");
import router from "../router/index";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

let user = localStorage.getItem("user");
if (!user) {
  user = {
    _id: -1,
    token: "",
  };
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common["Authorization"] = user.token;
  } catch (ex) {
    user = {
      _id: -1,
      token: "",
    };
  }
}

export default createStore({
  state: {
    user: user,
    Profil: {
      nom: "",
      prenom: "",
      age: "",
      photo: "",
      poste: "",
    },
    publish: {
      description: "",
      user: "",
    },
  },
  mutations: {
    User: function (state, user) {
      instance.defaults.headers.common["Authorization"] = user.token;
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    userProfil: function (state, userProfil) {
      state.Profil = userProfil;
    },
    logout: function (state) {
      state.user = {
        _id: -1,
        token: "",
      };
      localStorage.removeItem("user");
      router.push("/");
    },
    userPublish: function (state, infoPublish) {
      state.publish = infoPublish;
    },
  },
  actions: {
    createAccount: ({ commit }, infoSignup) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/auth/signup", infoSignup)
          .then(function (response) {
            commit("User", response.data);
            router.push("/CreateProfil");
            resolve(response);
          })
          .catch(function (error) {
            commit("User", "error");
            reject(error);
          });
      });
    },
    connexionAccount: ({ commit }, infoLogin) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/auth/login", infoLogin)
          .then(function (response) {
            commit;
            console.log(response);
            // commit("User", response.data);
            // router.push("/Feed");
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    CreateProfil: ({ commit }, infoProfil) => {
      let info = infoProfil.get("data");
      let infoParse = JSON.parse(info);
      let userParse = JSON.parse(localStorage.getItem("user"));
      infoParse.user = userParse._id;
      info = JSON.stringify(infoParse);
      infoProfil.set("data", info);
      console.log(infoProfil.get("data"));
      return new Promise((resolve, reject) => {
        instance
          .post("/profil/me/create", infoProfil)
          .then(function (response) {
            commit("userProfil", response.data);
            router.push("/Profil");
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    Publish: ({ commit }, infoPublish) => {
      let info = infoPublish.get("description");
      let infoParse = JSON.parse(info);
      let userParse = JSON.parse(localStorage.getItem("user"));
      infoParse.user = userParse._id;
      info = JSON.stringify(infoParse);
      infoPublish.set("description", info);
      return new Promise((resolve, reject) => {
        instance
          .post("/post/publish", infoPublish)
          .then(function (response) {
            commit("userPublish", response.data);
            router.go();
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    Comment: ({ commit }, infoComment) => {
      return new Promise((resolve, reject) => {
        instance
          .post(`/post/comment/${infoComment.post}`, infoComment)
          .then(function (response) {
            commit("userPublish", response.data);
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
  },
});
