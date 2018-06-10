import Vue from 'vue'

Vue.mixin({
  'methods': {
    countAverageRating (theme) {
      const ratings = this.$store.getters['ratings/theme'](theme._id)
      let sum = 0

      ratings.forEach((rating) => {
        sum = sum + rating.value
      })

      return sum / ratings.length
    },
  },
})
