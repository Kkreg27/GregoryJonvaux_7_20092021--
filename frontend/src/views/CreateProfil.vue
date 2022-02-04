<template>
  <button id="logout">Déconnexion</button>
  <div>
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
      <button id="create" type="submit" @click="CreateProfil()">
        Créer profil
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      image: null,
      info: {
        user: "",
        nom: "",
        prenom: "",
        age: "",
        photo: "",
        poste: "",
      },
    };
  },
  methods: {
    UploadImage(e) {
      this.image = e.target.files[0];
    },
    CreateProfil: function () {
      var fd = new FormData();
      fd.append("image", this.image);
      fd.append("data", JSON.stringify(this.info));
      return this.$store.dispatch("CreateProfil", fd);
    },
  },
};
</script>

<style lang="scss" scoped>
#formulaire {
  border: 1px solid rgb(230, 228, 228);
  font-size: 150%;
  padding: 5%;
  border-radius: 54px;
  background: #0b83eda1;

  box-shadow: -27px 27px 54px #acacac, 27px -27px 54px #ffffff;
  position: absolute;
  top: 20%;
  bottom: 20%;
  right: 30%;
  left: 30%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  #field {
    outline: none;
  }
  #create {
    background: white;
    border: none;
  }
}
</style>
