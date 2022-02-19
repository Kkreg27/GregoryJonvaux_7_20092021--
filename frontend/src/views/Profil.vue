<template>
  <div><NavBar></NavBar></div>
  <div id="profil">
    <i id="option" class="fas fa-gears" @click="opt()"></i>
    <div v-show="show" id="modify"></div>
    <form id="formulaire" @submit.prevent="create">
      <label>Nom</label>
      <input id="field" type="text" v-model="info.nom" />

      <label>Prénom</label>
      <input id="field" type="text" v-model="info.prenom" />

      <label>Age</label>
      <input id="field" type="number" v-model="info.age" />

      <label>Photo</label>
      <input id="field" type="file" accept="image/jpeg" @change="UploadImage" />

      <label>Poste</label>
      <input id="field" type="text" v-model="info.poste" />
      <p></p>
      <button id="create" type="submit" @click="modifyProfil()">
        Modifier Profil
      </button>
    </form>
    <div id="info">
      <img :src="info.photo" id="photo" alt="" />
      <div id="details">
        <div>
          <p>{{ info.prenom }}</p>
          <p></p>
          <p>{{ info.nom }}</p>
        </div>
        <p>Age : {{ info.age }}</p>
        <p>Poste : {{ info.poste }}</p>
      </div>
    </div>
    <div id="poste">
      <h1>Mes posts</h1>
      <div v-for="elem in post" :key="elem">
        <div :id="elem.idPost" class="div">
          <p>{{ elem.description }}</p>
          <img :src="elem.image" alt="" class="img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import NavBar from "../components/NavBar";
export default {
  components: {
    NavBar: NavBar,
  },
  data() {
    return {
      info: null,
      post: null,
      show: false,
      op: false,
    };
  },
  methods: {
    opt() {
      this.show = !this.show;
    },
  },
  beforeCreate() {
    let storage = localStorage.getItem("user");
    let usr = JSON.parse(storage);
    axios
      .get(`http://localhost:3000/api/profil/me/${usr._id}`)
      .then((response) => (this.info = response.data.message[0]))
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:3000/api/profil/me/post/${usr._id}`)
      .then((response) => (this.post = response.data.message))
      .catch((error) => console.log(error));
  },
  created: function () {
    document.body.style.backgroundColor = "#F0F2F5";
  },
};
</script>

<style lang="scss" scoped>
#profil {
  padding: 5%;
  margin: 50px 10% 50px 10%;
  display: flex;
  justify-content: space-around;
  background-color: white;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  flex-direction: column;
  #option {
    font-size: 150%;
    &:hover {
      color: #0b83eda1;
    }
  }
  #modify {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  #formulaire {
    border: 1px solid black;
    padding: 5%;
    border-radius: 54px;
    background: white;
    position: absolute;
    top: 20%;
    bottom: 20%;
    right: 30%;
    left: 30%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  #info {
    padding: 2%;
    #details {
      div {
        width: 50%;
        display: flex;
        margin: 0 auto;
        text-align: center;
        font-weight: bold;
        justify-content: center;
        p {
          margin-left: 10px;
          font-size: 150%;
        }
      }
    }
    #photo {
      display: flex;
      width: 250px;
      height: 250px;
      border: 10px solid white;
      box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
      margin: 0 auto;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  #poste {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    h1 {
      text-align: center;
    }
    .div {
      width: 90%;
      padding: 10px;
      border: 1px solid black;
      border-radius: 15px;
      display: flex;
      height: 100%;
      flex-direction: column;
      text-align: left;
      margin: 20px;
      .img {
        width: 50%;
      }
    }
  }
}
</style>
