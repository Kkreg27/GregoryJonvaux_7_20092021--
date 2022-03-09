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
    publish: "",
  },
  //améliorer les mutations qui sont identique
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
      instance.defaults.headers.common["Authorization"] = user.token;
      state.publish = infoPublish;
    },
    delete: function (state, user) {
      instance.defaults.headers.common["Authorization"] = user.token;
    },
    modify: function (state, user) {
      instance.defaults.headers.common["Authorization"] = user.token;
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
            if (response.data.profil == 1) {
              commit("User", response.data);
              router.push("/Profil");
              resolve(response);
              return;
            } else {
              commit("User", response.data);
              router.push("/createProfil");
              resolve(response);
              return;
            }
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
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .post("/profil/me/create", infoProfil)

          .then(function (response) {
            commit("userProfil", response.data);
            router.push("/Profil");
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    Publish: ({ commit }, post) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .post("/post/publish", post)
          .then(function (response) {
            response;
            commit("userPublish", response.data);
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    delete: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .delete(`http://localhost:3000/api/post/${id.post}`, {
            data: { id_user: id.user },
          })
          .then(function (response) {
            commit("delete", response);
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    modify: ({ commit }, fd) => {
      let id = fd.get("id");
      return new Promise((resolve, reject) => {
        instance
          .put(`http://localhost:3000/api/post/${id}`, fd)
          .then((response) => {
            response;
            commit("modify", response);
            resolve(response);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },
    getProfil: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .get(`http://localhost:3000/api/profil/me/${id}`)
          .then((response) => {
            response;
            commit;
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    getMyPost: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .get(`http://localhost:3000/api/profil/me/post/${id}`)
          .then((response) => {
            response;
            commit;
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    getAllPost: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .get(`http://localhost:3000/api/post/all`)
          .then((response) => {
            response;
            commit;
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    modifyProfil: ({ commit }, fd) => {
      let myUser = fd.get("user");
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .put(`http://localhost:3000/api/profil/me/${myUser}`, fd)
          .then((response) => {
            response;
            commit;
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    deleteAccount: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .delete(`http://localhost:3000/api/profil/me/${id}`)
          .then((response) => {
            response;
            commit("logout");
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    Comment: ({ commit }, comment) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .post(`/post/comment/${comment.post}`, comment)
          .then((response) => {
            response;
            commit;
            resolve(response);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
    getAllComment: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        instance.defaults.headers.common["Authorization"] = user.token;
        instance
          .get(`http://localhost:3000/api/post/comment/${id}`)
          .then((response) => {
            response;
            resolve(response);
            commit;
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
            reject(error);
          });
      });
    },
  },
});
