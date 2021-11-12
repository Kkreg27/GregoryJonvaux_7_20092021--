<template>
  <div>
    <img
      id="logo"
      src="@/assets/images/icon-left-font-monochrome-black.png"
      alt=""
    />
    <div id="connexion">
      <h1>Connexion</h1>
      <p>
        Vous n'avez pas encore de compte ?
        <router-link to="/Signup" id="test">inscrivez vous !</router-link>
      </p>
      <router-view />
      <form class="login" @submit.prevent="login">
        <label id="Email">Email</label>
        <input
          id="fieldEmail"
          v-model="email"
          type="email"
          placeholder="BillyCat@gmail.com"
        />
        <label id="Password">Password</label>
        <input
          id="fieldPassword"
          v-model="password"
          type="password"
          placeholder="******************"
        />

        <div v-if="status == 'error_login'">
          Email et/ ou password invalide !
        </div>

        <button id="button" @click="connexionAccount()" type="submit">
          <span v-if="status == 'loading'">Connexion en cours...</span>
          <span v-else>Connexion</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "login",
  data: function () {
    return {
      email: "", //V-model:email ^up
      password: "", //V-model:password ^up
    };
  },
  computed: {
    ...mapState(["status"]),
  },
  methods: {
    connexionAccount: function () {
      const self = this;
      this.$store
        .dispatch(
          // dispactch appel une action dasn le store connexionAccount
          "connexionAccount",
          {
            email: this.email,
            password: this.password,
          }
        )
        .then(
          function () {
            self.$router.push("/createProfil"); //le then fais ensuite une redirection vers la vue createProfil
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>


<style scoped src="@/assets/css/styles.css">
</style>
