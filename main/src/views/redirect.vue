<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Redirect',
  created() {
    console.log('Redirect', 333333333333)
    const { params, query } = this.$route
    const { path } = params
    this.$router
      .replace({
        path: `/${path}`,
        query
      })
      .catch((err) => {
        console.warn(err)
      })
  }
})
</script>
