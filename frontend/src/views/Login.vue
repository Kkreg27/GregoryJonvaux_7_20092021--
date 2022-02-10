<template>
  <img id="icon" src="../assets/icon-left-font-monochrome-black.png" alt="" />
  <div id="login">
    <h1>Connexion</h1>
    <p>
      Vous n'avez pas encore de compte ?
      <router-link id="router" to="/Signup">inscrivez vous</router-link>!
    </p>
    <router-view />
    <form id="formulaire" @submit.prevent="Login">
      <label>Email</label><br />
      <input id="email" type="email" v-model="email" /><br />
      <label>Password</label><br />
      <input id="password" type="password" v-model="password" /><br />
      <p></p>
      <button id="connexion" type="submit" @click="connexionAccount()">
        Connexion
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    connexionAccount: function () {
      this.$store.dispatch("connexionAccount", {
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
#login {
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
    font-weight: bold;
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
      outline: none;
      background: #ffffff;
    }
    #password {
      width: 100%;
      border: none;
      outline: none;
      background: #ffffff;
    }
    #connexion {
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
}
</style>
