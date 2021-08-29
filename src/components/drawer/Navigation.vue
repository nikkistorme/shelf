<template>
  <nav>
    <h2><router-link to="/home">Home</router-link></h2>
    <h2><router-link to="/shelves">Shelves</router-link></h2>
    <h2><router-link to="/add-book">Add a Book</router-link></h2>
    <h2><router-link to="/account">Account</router-link></h2>
  </nav>
</template>

<style lang="scss">
nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  h2 {
    margin-bottom: 1rem;
  }
  a {
    color: #000;
    text-decoration: none;
    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style>
