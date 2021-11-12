<template>
  <div>
    <img
      id="logo"
      src="@/assets/images/icon-left-font-monochrome-black.png"
      alt=""
    />
    <div id="inscription">
      <h1>Inscription</h1>
      <p>
        Vous êtes deja pas inscrit ?
        <router-link to="/" id="test">Connectez vous !</router-link>
      </p>
      <form class="Signup" @submit.prevent="Signup">
        <label id="Email">Email</label>
        <input
          id="fieldEmail"
          v-model="email"
          type="text"
          placeholder="BillyCat@gmail.com"
        />
        <label id="Password">Password</label>
        <input
          id="fieldPassword"
          v-model="password"
          type="password"
          placeholder="******************"
        />
        <div v-if="status == 'error_create'">Email déja utilisé!</div>
        <button id="button" @click="createAccount()" type="submit">
          <span v-if="status == 'loading'">Inscription en cours...</span>
          <span v-else>Inscription</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "signup",
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
    createAccount: function () {
      const self = this;
      return this.$store
        .dispatch(
          // dispactch appel une action dans le store createAccount
          "createAccount",
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


<style src="@/assets/css/styles.css">
</style>
