<template>
  <ChessBoard />
</template>

<script>
import ChessBoard from './components/ChessBoard.vue'

export default {
  name: 'App',
  components: {
    ChessBoard
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>