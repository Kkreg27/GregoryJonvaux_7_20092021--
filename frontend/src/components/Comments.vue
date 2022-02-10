<template>
  <button v-if="!comments" @click="display()">Voir les commentaires</button>
  <button v-else @click="comments = null">Masquer les commentaires</button>
  <div v-for="elem in comments" :key="elem">
    <div id="idCom">
      <div id="usr">
        <img :src="elem.photo" alt="" />
        <p>{{ elem.nom }}</p>
        <p>{{ elem.prenom }}</p>
      </div>
      <p>{{ elem.texte }}</p>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  data() {
    return {
      comments: null,
    };
  },
  props: {
    postId: {
      required: true,
      default: null,
    },
  },
  methods: {
    display() {
      if (this.$props.postId == null) {
        return;
      } else {
        axios
          .get(`http://localhost:3000/api/post/comment/${this.$props.postId}`)
          .then((response) => {
            this.comments = response.data.message;
          })
          .catch((error) => console.log(error));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#idCom {
  border: 1px solid black;
  margin: 10px;
  #usr {
    display: flex;
    p {
      font-weight: bold;
    }
    img {
      margin: 10px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  p {
    margin-left: 10px;
  }
}
button {
  border: none;
  width: 50%;
  margin: 0 auto;
  margin-top: 10px;
  display: inline-block;
  padding: 5px;
  border-radius: 10rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0b83eda1;
    border-radius: 10rem;
    z-index: -2;
  }
  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: darken(#fff, 15%);
    transition: all 0.3s;
    border-radius: 10rem;
    z-index: -1;
  }
  &:hover {
    color: #0b83eda1;
    &:before {
      width: 100%;
    }
  }
}
</style>
