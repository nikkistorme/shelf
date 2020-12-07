<template>
  <div class="nav-and-main-container">
    <Nav />
    <div :class="[{ nav_open: showNav }]" class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Nav from "./components/Nav.vue";

const getTodayISO = () => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  today = `${y}-${m <= 9 ? "0" + m : m}-${d <= 9 ? "0" + d : d}`;
  return today;
};

export default {
  components: {
    Nav
  },
  computed: {
    ...mapGetters(["userProfile", "showNav"])
  },
  watch: {
    userProfile: function(newUser) {
      const userClone = JSON.stringify(newUser);
      let userShelves = this.userProfile.shelves;
      for (let i = 0; i < userShelves.length; i++) {
        for (let j = 0; j < userShelves[i].volumes.length; j++) {
          // eslint-disable-next-line prettier/prettier
          let lastUpdatedGoalProgress = userShelves[i].volumes[j].goalToday;
          let todayDate = getTodayISO();
          console.log("todayDate", todayDate);
          if (lastUpdatedGoalProgress.date !== todayDate) {
            console.log("goalToday is different from todayDate");
            userShelves[i].volumes[j].goalToday.date = todayDate;
            // eslint-disable-next-line prettier/prettier
            userShelves[i].volumes[j].goalToday.page = userShelves[i].volumes[j].currentPage;
            console.log(
              `updated goalToday.date for ${userShelves[i].volumes[j].name}`
            );
          } else if (
            lastUpdatedGoalProgress.page > userShelves[i].volumes[j].currentPage
          ) {
            // eslint-disable-next-line prettier/prettier
            userShelves[i].volumes[j].goalToday.page = userShelves[i].volumes[j].currentPage;
            console.log(
              `updated goalToday.page for ${this.userProfile.shelves[i].volumes[j].name}`
            );
          }
        }
      }
      console.log("update shelf info?", userClone !== JSON.stringify(newUser));
      if (userClone !== JSON.stringify(newUser)) {
        this.$store.dispatch("updateShelves");
      }
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html {
  height: -webkit-fill-available;
  font-size: 10px;
}
body {
  height: 100vh;
  height: -webkit-fill-available;
  margin: 0;
  font-family: "Cabin", sans-serif;
  font-size: 1.6rem;
  background: #c0c0c0;
  overflow: hidden;
}
h1,
h2,
h3,
h4 {
  font-family: "Roboto", sans-serif;
  margin: 0;
}
input {
  font-size: 16px;
}
p {
  margin: 0;
}
/* .nav-and-main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (min-width: 768px) {
    display: block;
  }
  .nav-container {
    order: 2;
  }
} */
.main-container {
  transition: margin-left 0.5s;
  height: 91vh;
  height: -webkit-calc(100vh - 50px);
  height: -moz-calc(100vh - 50px);
  height: calc(100vh - 50px);
  margin-bottom: 50px;
  /* flex: 1; */
  overflow: hidden;
  @media (min-width: 768px) {
    margin-left: 50px;
    height: 100vh;
  }
  .section-with-margin {
    height: 100%;
    padding: 15px;
    overflow: auto;
    @media (min-width: 768px) {
      padding: 50px;
    }
  }
}
.nav_open {
  margin-left: 250px;
}
</style>
