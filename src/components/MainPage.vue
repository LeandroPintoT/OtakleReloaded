<template>
    <b-container>
        <div>
            <img id="imgPersonaje" src="https://cdn.myanimelist.net/images/characters/7/65049.jpg" crossorigin="">
        </div>
    </b-container>
</template>

<script>
import axios from 'axios'

export default {
    name: 'MainPage',
    mounted() {
        axios.get('https://static.wikia.nocookie.net/naruto/images/8/8f/Naruto_Uzumaki_Parte_III_Anime.png/revision/latest/scale-to-width-down/1000?cb=20201023034708&path-prefix=es', {
            headers: {
                'Accept': '*/*',
                'Access-Control-Allow-Origin': '*'
            },
            withCredentials: true,
            credentials: 'same-origin',
        })
        .then((res) => {
            console.log(res)
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/css/custom-css.css';
</style>
