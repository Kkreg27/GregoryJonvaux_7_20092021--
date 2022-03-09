<template>
  <NavBar> </NavBar>
  <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
  <div id="feed">
    <div id="publish">
      <img :src="info.photo" id="photoProfil" alt="" />
      <form id="data" @submit.prevent="publish">
        <input
          id="text"
          type="text"
          v-model="description"
          :placeholder="`Quoi de neuf ,` + [[info.prenom]] + ` ?`"
        />
        <img :src="previewImage" v-if="image != null" width="50" height="50" />
        <input
          id="file"
          type="file"
          accept="image/jpeg"
          @change="UploadImage"
        />

        <label for="file"
          ><i class="fas fa-image" id="addImg"></i>Photo/Image</label
        >
        <button
          type="submit"
          @click="Publish()"
          style="display: none"
          onclick="document.getElementById('text').value = ''"
        >
          Publier
        </button>
      </form>
    </div>
  </div>
  <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
  <div id="allPublish">
    <div v-for="elem in AllPubli" :key="elem">
      <div :id="elem.idPost" class="div">
        <ModifyPubli
          v-if="this.me == elem.user"
          :postId="elem.idPost"
          @delete="(val) => onDelete(val)"
          @modify="() => onModify()"
        ></ModifyPubli>
        <div id="usr">
          <img :src="elem.photo" id="photoId" alt="" />
          <p>{{ elem.nom }}</p>
          <p>{{ elem.prenom }}</p>
        </div>
        <div id="inf">
          <div id="descr">{{ elem.description }}</div>
          <img :src="elem.image" id="photo" alt="" />
        </div>

        <form @submit.prevent="com" id="formCom">
          <input type="text" :placeholder="`Ecrivez un commentaire`" />

          <button
            style="display: none"
            type="submit"
            @click="Comment(elem.idPost)"
          >
            Ajouter commentaire
          </button>
        </form>
        <Comments :postId="elem.idPost"></Comments>
      </div>
    </div>
  </div>
</template>

<script>
//const axios = require("axios");

import NavBar from "../components/NavBar";
import Comments from "../components/Comments";
import ModifyPubli from "../components/ModifyPubli";

export default {
  components: {
    NavBar: NavBar,
    Comments: Comments,
    ModifyPubli: ModifyPubli,
  },
  data() {
    return {
      me: JSON.parse(localStorage.getItem("user"))._id,
      image: null,
      previewImage: null,
      info: null,
      AllPubli: null,
      description: "",
      comments: {
        comment: "",
        user: null,
      },
      displayCom: {
        com: null,
        id: null,
      },
    };
  },

  methods: {
    UploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      this.image = e.target.files[0];
    },
    Publish: function () {
      var fd = new FormData();
      let user = JSON.parse(localStorage.getItem("user"));
      user = user._id;
      fd.append("id_user", user);
      fd.append("image", this.image);
      fd.append("description", this.description);
      let self = this;
      this.description = "";
      this.image = null;

      this.$store
        .dispatch("Publish", fd)
        .then(function (response) {
          response;
          self.$store
            .dispatch("getAllPost")
            .then(function (response) {
              self.AllPubli = response.data.message;
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
    },
    Comment: function (id) {
      let usr = JSON.parse(localStorage.getItem("user"));
      this.$store
        .dispatch("Comment", {
          post: id,
          value: document.getElementById(id).children.formCom[0].value,
          user: usr._id,
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data.message);
            console.log(error.response.status);
            console.log(error.response);
          }
        });
      document.getElementById(id).children.formCom[0].value = "";
    },
    onDelete(val) {
      for (let elem of this.AllPubli) {
        if (val === elem.idPost) {
          const index = this.AllPubli.indexOf(elem);
          if (index > -1) {
            this.AllPubli.splice(index, 1);
          }
        }
      }
    },
    onModify() {
      let self = this;
      this.$store
        .dispatch("getAllPost")
        .then(function (response) {
          self.AllPubli = response.data.message;
        })
        .catch(function (error) {
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
      .dispatch("getAllPost")
      .then(function (response) {
        self.AllPubli = response.data.message;
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

<style scoped lang="scss">
#feed {
  background-color: white;
  font-family: "Courier New", Courier, monospace;
  border-radius: 15px;
  width: 60%;
  margin: 50px 20% 50px 20%;
  justify-content: space-between;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);

  #publish {
    padding: 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    #data {
      width: 70%;
      display: flex;
      flex-direction: column;
      input[type="file"] {
        display: none;
      }

      label {
        width: 50%;
        background-color: white;
        text-align: center;
        border: 1px solid black;
        border-radius: 10px;
        align-items: center;
        display: flex;
        justify-content: space-around;
        #addImg {
          color: green;
          font-size: 150%;
        }
      }
    }
    #text {
      font-family: "Courier New", Courier, monospace;
      color: black;
      outline: none;
      border-radius: 10px;
      border: none;
      padding: 5px;
      background-color: #f0f2f5;
    }
    #photoProfil {
      width: 100px;
      height: 100px;
      border: 2px solid black;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}
#allPublish {
  background-color: white;
  border-radius: 15px;
  width: 60%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);

  .div {
    padding: 5px;
    border: 1px solid grey;
    border-radius: 15px;
    display: flex;
    height: 100%;
    flex-direction: column;
    text-align: left;
    margin: 30px 10% 30px 10%;
    position: relative;

    #usr {
      font-weight: bold;
      align-items: center;
      display: flex;
      p {
        margin-left: 10px;
      }
    }
    #inf {
      padding: 5px;

      #photo {
        width: 30%;
        border-radius: 15px;
      }
    }
  }
  #photoId {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    border-radius: 50%;
    object-fit: cover;
  }
  #formCom {
    width: 100%;
    display: flex;
    > input {
      outline: none;
      border-radius: 10px;
      padding: 5px;
      width: 100%;
      border: 1px solid grey;
      background-color: #f0f2f5;
    }
  }
}
</style>
