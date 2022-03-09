<template>
  <div><NavBar></NavBar></div>
  <div id="profil">
    <i id="option" class="fas fa-gears" @click="opt()"></i>
    <div id="modify" v-show="show">
      <div id="calque" v-on:Click="toggleClick"></div>
      <form id="formulaire" @submit.prevent="create">
        <label>Nom</label>
        <input type="text" v-model="usr.nom" class="value" />

        <label>Prénom</label>
        <input type="text" v-model="usr.prenom" class="value" />

        <label>Age</label>
        <input type="number" v-model="usr.age" class="value" />

        <label>Photo</label>
        <input
          id="field"
          type="file"
          accept="image/jpeg"
          @change="UploadImage"
          class="value"
        />

        <label>Poste</label>
        <input type="text" v-model="usr.poste" class="value" />
        <p></p>
        <button id="create" type="submit" @click="modifyProfil()">
          Modifier Profil
        </button>
        <button id="deleteAccount" @click="deleteAccount()">
          Supprimer mon compte
        </button>
      </form>
    </div>
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
      image: null,
      test: "test",
      usr: {
        nom: "",
        prenom: "",
        age: "",
        poste: "",
      },
    };
  },
  methods: {
    UploadImage(e) {
      this.image = e.target.files[0];
    },
    opt() {
      this.show = !this.show;
    },
    toggleClick() {
      this.show = !this.show;
    },
    modifyProfil() {
      let obj = this.usr;
      function createObject(obj) {
        for (let crit of Object.keys(obj)) {
          if (obj[crit] == null || obj[crit] == "") {
            delete obj[crit];
          }
        }
        return obj;
      }
      obj = createObject(obj);
      if (Object.keys(obj).length == 0 && this.image == null) {
        this.show = !this.show;
      } else {
        let fd = new FormData();
        fd.append("image", this.image);
        fd.append("body", JSON.stringify(obj));
        fd.append("user", this.info.user);
        let self = this;

        this.$store
          .dispatch("modifyProfil", fd)
          .then(function () {
            let storage = localStorage.getItem("user");
            let usr = JSON.parse(storage);
            self.$store
              .dispatch("getProfil", usr._id)
              .then(function (response) {
                self.info = response.data.message[0];
                self.usr.nom = "";
                self.usr.prenom = "";
                self.usr.age = "";
                self.usr.poste = "";
                document.getElementById("field").value = "";
                self.show = !self.show;
              })
              .catch(function (error) {
                if (error.response) {
                  console.log(error.response.data.message);
                  console.log(error.response.status);
                  console.log(error.response);
                }
              });
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data.message);
              console.log(error.response.status);
              console.log(error.response);
            }
          });
      }
    },
    deleteAccount() {
      let user = this.info.user;
      this.$store.dispatch("deleteAccount", user).catch(function (error) {
        if (error.response) {
          console.log(error.response.data.message);
          console.log(error.response.status);
          console.log(error.response);
        }
      });
    },
  },
  beforeCreate() {
    let storage = localStorage.getItem("user");
    let usr = JSON.parse(storage);
    let self = this;
    this.$store
      .dispatch("getProfil", usr._id)
      .then(function (response) {
        self.info = response.data.message[0];
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data.message);
          console.log(error.response.status);
          console.log(error.response);
        }
      });
    this.$store
      .dispatch("getMyPost", usr._id)
      .then(function (response) {
        self.post = response.data.message;
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data.message);
          console.log(error.response.status);
          console.log(error.response);
        }
      });
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
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    #calque {
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
      border: none;
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 1000;
      position: fixed;
      top: 25%;
      right: 25%;
      left: 25%;
      bottom: 25%;
      background-color: white;
      border-radius: 15px;
      #deleteAccount {
        background: none;
        position: absolute;
        border-radius: 5px;
        bottom: 10px;
        color: #0b83edbd;
        &:hover {
          color: black;
          background: #0b83edbd;
        }
      }
    }
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
