<template>
  <i class="fas fa-ellipsis-h" id="option" @click="opt(postId)"></i>
  <div :id="postId" class="dis" v-show="op">
    <button @click="toggleClick">Modifier</button>
    <button @click="delet(postId)">Supprimer</button>
  </div>
  <div id="modify" v-show="show">
    <div id="calque" v-on:Click="toggleClick" v-show="show"></div>

    <div id="frame">
      <i @click="toggleClick(postId)" class="fas fa-times" id="cross"></i>
      <p>Modifier la publication</p>
      <textarea id=""></textarea>
      <img :src="previewImage" v-if="image != null" width="50" height="50" />
      <input id="file" type="file" accept="image/jpeg" @change="UploadImage" />
      <button id="button-modify" @click="change(postId)">Modifier</button>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      image: null,
      previewImage: null,
      show: false,
      op: false,
    };
  },
  props: {
    postId: {
      required: true,
      default: null,
    },
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
    toggleClick(id) {
      this.show = !this.show;

      let x = document.getElementById(id);
      console.log((x.children.modify.children.frame.children[2].value = ""));
    },
    opt() {
      this.op = !this.op;
    },
    change(id) {
      let x = document.getElementById(id);
      let value = x.children.modify.children.frame.children[2].value;
      var fd = new FormData();
      let usrLocal = localStorage.getItem("user");
      let usr = JSON.parse(usrLocal);
      fd.append("image", this.image);
      fd.append(
        "description",
        JSON.stringify({ id_user: usr._id, description: value })
      );

      axios
        .put(`http://localhost:3000/api/post/${id}`, fd)
        .then((response) => {
          console.log(response);
          this.$router.go();
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
<style lang="scss" scoped>
i {
  width: 20px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  &:hover {
    color: #0b83eda1;
  }
}
.dis {
  position: absolute;
  right: 10px;
  top: 20px;
  flex-direction: column;
  button {
    width: 100%;
    border: none;
  }
}
#modify {
  z-index: 5;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  #calque {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 5;
  }
  #frame {
    padding: 5px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    position: fixed;
    width: 50%;
    background-color: white;
    border-radius: 15px;
    #cross {
      position: absolute;
      float: right;
      margin-top: 5px;
      margin-right: 5px;
    }
    p {
      text-align: center;
    }
    textarea {
      display: inline-flex;
      font-family: Arial, sans-serif;
      border: 1px solid rgba(0, 0, 0, 0.1);
      outline: none;
      width: 100%;
      box-sizing: border-box;
      resize: none;
    }
    #button-modify {
      width: 30%;
    }
  }
}
</style>
