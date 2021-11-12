<template>
  <div>
    <div id="connexion">
      <h1>Créer mon profil</h1>
      <form class="profil" @submit.prevent="profil">
        <label id="Nom">Nom</label>
        <input id="fieldNom" v-model="Nom" type="text" placeholder="greg" />
        <label id="Prénom">Nom</label>
        <input
          id="fieldPrenom"
          v-model="Prenom"
          type="text"
          placeholder="jon"
        />
        <label id="Age">age</label>
        <input id="fieldAge" v-model="age" type="number" placeholder="40" />
        <label id="photo">Photo</label>
        <input id="fieldPhoto" type="file" v-on:change="file" />
        <label id="Poste">Poste</label>
        <input
          id="fieldPoste"
          v-model="Poste"
          type="text"
          placeholder="Developpeur"
        />

        <div v-if="status == 'error_login'">
          Email et/ ou password invalide !
        </div>

        <button id="button" @click="createUserInfos()" type="submit">
          Créer profil
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "profil",
  data: function () {
    return {
      idProfil: "",
      nom: "",
      prenom: "",
      age: "",
      photo: "",
      poste: "",
    };
  },
  computed: {
    ...mapState(["status"]),
  },
  methods: {
    createUserInfos: function () {
      const self = this;
      return this.$store
        .dispatch(
          // dispactch appel une action dans le store createUserInfos
          "createUserInfos",
          {
            idProfil: "",
            nom: this.nom,
            prenom: this.prenom,
            age: this.age,
            photo: this.photo,
            poste: this.poste,
          }
        )
        .then(
          function () {
            self.$router.push("/Profil"); //le then fais ensuite une redirection vers la vue Profil
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style>
</style>