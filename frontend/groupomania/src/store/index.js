import { createStore } from 'vuex'
const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/'
});

const store = createStore({
    state: {
        status: '',
        user: {
            _id: '',
            token: '',
        }, userInfos: {
            idProfil: "",
            nom: '',
            prenom: '',
            age: '',
            photo: '',
            poste: '',
        },

    },
    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },
        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            state.user = user;
        }, userInfos: function (state, userInfos) {
            state.userInfos = userInfos
        },


    },
    actions: {
        createAccount: ({ commit }, userInfos) => {//userInfos provient du 2eme argument de sa vue 
            commit('setStatus', 'loading')//permet de créer un status pour voir le status de connexion 
            return new Promise((resolve, reject) => {
                instance.post('/auth/signup', userInfos)//instance est la base de l'url fourni pour la requete en haut de page
                    .then(function (response) {
                        commit('setStatus', 'created')//commit sert à appeler la mutation set status
                        resolve(response);
                    })
                    .catch(function (error) {//catch l'erreur de creation de compte 
                        commit('setStatus', 'error_create')//commit sert à appeler la mutation set status
                        reject(error);
                    });
            })

        },
        connexionAccount: ({ commit }, userInfos) => {//userInfos provient du 2eme argument de sa vue 
            commit('setStatus', 'loading')
            return new Promise((resolve, reject) => {
                instance.post('/auth/login', userInfos)//instance est la base de l'url fourni pour la requete en haut de page
                    .then(function (response) {
                        commit('setStatus', '')//commit sert à appeler la mutation set status
                        commit('logUser', response.data)////commit sert à appeler la mutation logUser
                        resolve(response);
                    })
                    .catch(function (error) {//catch l'erreur
                        commit('setStatus', 'error_login')
                        reject(error);
                    });
            })

        },
        createUserInfos: ({ commit }, userInfos) => {//userInfos provient du 2eme argument de sa vue

            return new Promise((resolve, reject) => {

                instance.post('/profil/me/create', userInfos)
                    .then(function (response) {
                        commit('userInfos', '')
                        resolve(response)

                    })
                    .catch(function (error) {
                        commit('userInfos', 'error_creation')
                        reject(error);
                    });
            })

        },


    }

})

export default store;