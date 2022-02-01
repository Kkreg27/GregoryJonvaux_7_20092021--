<template>
  <nav>
    <ul>
      <li>
        <router-link class="router" to="/Feed"
          ><i class="fas fa-globe" id="group"></i
          ><span>GROUPOMANIA</span></router-link
        >
      </li>
      <li>
        <router-link class="router" to="/Profil"
          ><i class="fas fa-user" id="logo1"></i
          ><span>Profil</span></router-link
        >
      </li>
      <li @click="logout">
        <i class="fas fa-power-off" id="logo2"></i><span>Deconnexion</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    logout: function () {
      this.$store.commit("logout");
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  :root {
    --btn-width-100: 100px;
  }
}
nav {
  margin: 0;
  padding: 0;
  background-color: white;
  > ul {
    font-size: 20px;
    margin: 0;
    padding: 8px 15px;
    list-style: none;
    display: flex;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
    width: 100%;
    justify-content: space-between;
    > li {
      width: 25%;
      padding: 3px;
      display: flex;
      text-decoration: none;
      align-items: center;
      color: black;
      cursor: pointer;

      span {
        margin-left: 10px;
        font-weight: bold;
      }
      #group {
        background-color: #0b84ed;
        color: white;
        border: 2px solid #0b84ed;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
      }
      .router {
        width: 100%;
        text-decoration: none;
        display: flex;
        color: black;
        align-items: center;
        text-align: center;

        #logo1 {
          align-items: center;
          justify-content: center;
          border: none;
          outline: none;
          background: rgba(0, 0, 0, 0.068);
          padding: 8px;
          color: #888;
          width: 40px;
          height: 40px;
          font-size: 1rem;
          border-radius: 50%;
          display: flex;
        }
      }
      #logo2 {
        border: none;
        outline: none;
        background: rgba(0, 0, 0, 0.068);
        padding: 8px;
        color: #888;
        width: 40px;
        height: 40px;
        font-size: 1rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
