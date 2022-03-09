<template>
  <button id="logout" @click="logout">Déconnexion</button>
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
      return this.$store
        .dispatch("CreateProfil", fd)
        .then(function (response) {
          response;
        })
        .catch((error) => {
          console.log("Creéation de profil échoué" + error);
        });
    },
    logout: function () {
      this.$store.commit("logout");
    },
  },
};
</script>

<style lang="scss" scoped>
#formulaire {
  padding: 5%;
  border-radius: 54px;
  background: #0b83eda1;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  box-shadow: -27px 27px 54px #acacac, 27px -27px 54px #ffffff;
  width: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  #field {
    outline: none;
  }
  #create {
    color: white;
    box-sizing: border-box;
    background: lighten(#0b83eda1, 3%);
    border: 1px solid darken(#0b83eda1, 4%);
    border-radius: 20px;
    padding: 15px;
    box-shadow: 0px 2px 0 darken(#0b83eda1, 5%),
      2px 4px 6px darken(#0b83eda1, 2%);
    letter-spacing: 1px;
    transition: all 120ms linear;
    &:hover {
      background: darken(#0b83eda1, 1.5%);
      border: 1px solid rgba(#000, 0.05);
      box-shadow: 1px 1px 2px rgba(#fff, 0.2);
      text-decoration: none;
      transition: all 130ms linear;
    }
  }
}
</style>
