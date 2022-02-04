<template>
  <img id="icon" src="../assets/icon-left-font-monochrome-black.png" alt="" />
  <div id="signup">
    <h1>Inscription</h1>
    <p>
      Vous avez deja un compte ?
      <router-link id="router" to="/">Connectez vous</router-link>!🙂
    </p>
    <router-view />
    <form id="formulaire" @submit.prevent="Signup">
      <label>Email</label><br />
      <input id="email" type="email" v-model="email" /><br />
      <label>Password</label><br />
      <input id="password" type="password" v-model="password" /><br />
      <p></p>
      <button id="inscription" type="submit" @click="createAccount()">
        Inscription
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Signup",
  data: function () {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    createAccount: function () {
      this.$store.dispatch("createAccount", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#icon {
  width: 250px;
  height: 80px;
  object-fit: cover;
}
#signup {
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

  h1 {
    text-align: center;
  }
  p:nth-child(2) {
    text-align: center;
    #router {
      color: black;
    }
  }
  #formulaire {
    #email {
      width: 100%;
      border: none;
      background: white;

      outline: none;
    }
    #password {
      width: 100%;
      border: none;
      background: #ffffff;
      outline: none;
    }
    #inscription {
      border: none;
      font-size: 20px;
      display: flex;
      padding: 15px;
      margin: 0 auto;

      border-radius: 54px;
      background: #fcf8f8;
      box-shadow: inset -27px 27px 26px #ffffff, inset 27px -27px 26px #ffffff;
    }
  }
}
</style>
