<template>
  <button v-if="!comments" @click="display()">
    Voir tous les commentaires
  </button>
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
            console.log(this.comments);
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
  background-color: #0b83eda1;
  border: none;
  width: 50%;
  border-radius: 15px;
  margin: 0 auto;
  margin-top: 15px;
  padding: 8px;
}
</style>
