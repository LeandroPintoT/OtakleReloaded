<template>
    <b-container>
        <h1>Otakle</h1>
        <h5>An anime character wordle!</h5>

        <div class="contenedor">
            <div class="filaIntentos" v-bind:key="'fila-intentos-' + i" v-for="i in range(CTES.INTENTOS_MAX)">
                <div class="cuadroIntento" :id="'cuadro' + i + j" v-bind:key="'cuadro-' + j" v-for="j in range(resp[1].length)">
                    <span :id="'i' + i + 'l' + j"></span>
                </div>
            </div>
        </div>

        <div>
            <div class="filaIntentos" v-bind:key="'fila-keys-' + i" v-for="i in range(qwerty.split(',').length-1)">
                <div class="cuadroIntento" v-bind:key="'cuadro-key-' + j" v-for="j in range(qwerty.split(',')[i].length)" @click="clickLetra(qwerty.split(',')[i][j])">
                    <span>{{ qwerty.split(',')[i][j] }}</span>
                </div>
            </div>
            <div class="filaIntentos">
                <div class="cuadroIntentoEnter" @click="clickEnter">
                    <span style="display:table-cell; vertical-align:middle;">ENTER</span>
                </div>
                <div class="cuadroIntento" v-bind:key="'cuadro-' + j" v-for="j in range(qwerty.split(',')[qwerty.split(',').length-1].length)" @click="clickLetra(qwerty.split(',')[qwerty.split(',').length-1][j])">
                    <span>{{ qwerty.split(',')[qwerty.split(',').length-1][j] }}</span>
                </div>
                <div class="cuadroIntentoEnter" @click="clickBorrar">
                    <span style="display:table-cell; vertical-align:middle;"><i class="bi bi-eraser-fill" /></span>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <Modal :tipo="CTES.IMG" nofooter aria-hidden="true" id="modalRespuesta" ref="modal_respuesta">
            <template #header>
                <h2 class="headerResp">{{ respuestaCorrecta ? "¡Correcto!" : "Lamentable..." }}</h2>
            </template>
            <template #body>
                <b-row>
                    <b-col>
                        <h3>Character name was:</h3>
                        <h4><strong>{{ resp[2] }}</strong></h4>
                    </b-col>
                    <b-col>
                        <img id="imgPersonaje" :src="resp[3]">
                    </b-col>
                </b-row>
            </template>
        </Modal>
        <button hidden ref="boton_muestra_archivo_texto" data-bs-toggle="modal" data-bs-target="#modalRespuesta"></button>
    </b-container>
</template>

<script>
//import axios from 'axios'
import animeNamesFull from '!raw-loader!@a/animeNamesFull.txt';
import Modal from '@c/Modal'
import ctes from '@a/js/ctes'

const fechaSubida = new Date('10/31/2022')

export default {
    name: 'MainPage',
    data() {
        return {
            idFila: 0,
            idColumna: 0,
            resp: [],
            CTES: ctes,
            respuestaCorrecta: false,
            intentos: [],
            palabrasAdmitidas: [],
            qwerty: 'qwertyuiop,asdfghjkl,zxcvbnm'
        }
    },
    components: {
        Modal
    },
    created() {
        let diffTime = Math.abs(Date.now() - fechaSubida)
        this.idActual = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1
        let lineas = animeNamesFull.split("\n")
        this.resp = lineas.find(linea => linea.split(",")[0] == this.idActual).split(",")
        for (let item in lineas)
        {
            this.palabrasAdmitidas.push(item.split(",")[1])
        }

        window.addEventListener('keydown', (e) => { if(!e.altKey && !e.shiftKey && !e.ctrlKey) this.keyPressed(e.key) });
    },
    mounted() {
        this.$nextTick(() => {
            document.getElementById("cuadro" + this.idFila + this.idColumna).classList.add('siguienteLetra')
        })
    },
    methods: {
        abreModalRespuesta() {
            this.$refs.boton_muestra_archivo_texto.click()
        },

        clickEnter() {
            let letras = []
            Array.from(document.querySelectorAll('[id^="cuadro' + this.idFila + '"]')).forEach(elem => {
                letras.push(elem.children[0].innerText.toLowerCase())
            })
            let palabra = letras.join('')
            let respuesta = this.resp[1].toLowerCase()

            letras.forEach((letra, i) => {
                let count = (respuesta.match(new RegExp(letra, 'g')) || []).length
                let encontrado = 0
                let tmp = respuesta
                if (count == 0) {
                    document.getElementById("cuadro" + this.idFila + i).classList.add('letraIncorrecta')
                    return
                }
                while (tmp.indexOf(letra) > -1) {
                    if (respuesta.indexOf(letra) > -1) {
                        encontrado++
                        if (encontrado > count) {
                            break
                        }
                        if (respuesta.indexOf(letra) == palabra.toLowerCase().indexOf(letra)) {
                            document.getElementById("cuadro" + this.idFila + i).classList.add('letraCorrecta')
                        } else {
                            document.getElementById("cuadro" + this.idFila + i).classList.add('letraCasi')
                        }
                    }
                    tmp = tmp.slice(respuesta.indexOf(letra), respuesta.length - 1)
                }
            });
            
            if (palabra == respuesta) {
                this.respuestaCorrecta = true
                this.abreModalRespuesta()
                return
            }
            this.idFila++
            this.idColumna = 0
            document.getElementById("cuadro" + this.idFila + this.idColumna).classList.add('siguienteLetra')
        },
        
        clickBorrar() {
            let cuadro = document.getElementById("cuadro" + this.idFila + this.idColumna)
            if (cuadro)
                cuadro.classList.remove('siguienteLetra')
            if (this.idColumna > 0) {
                this.idColumna--
            }
            let casilla = document.getElementById('i' + this.idFila + 'l' + this.idColumna)
            if (casilla) {
                document.getElementById("cuadro" + this.idFila + this.idColumna).classList.add('siguienteLetra')
                casilla.innerText = ""
            }
        },
        
        clickLetra(letra) {
            let casilla = document.getElementById('i' + this.idFila + 'l' + this.idColumna)
            if (casilla) {
                document.getElementById("cuadro" + this.idFila + this.idColumna).classList.remove('siguienteLetra')
                casilla.innerText = letra.toUpperCase()
                this.idColumna++
                let cuadro = document.getElementById("cuadro" + this.idFila + this.idColumna)
                if (cuadro)
                    cuadro.classList.add('siguienteLetra')
            }
        },

        range(start, stop, step = 1) {
            if (typeof stop == 'undefined') {
                // one param defined
                stop = start
                start = 0
            }

            if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
                return []
            }

            var result = []
            for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
                result.push(i)
            }

            return result
        },

        keyPressed(key) {
            if ((new RegExp('^[a-zA-Z]$')).test(key)) {
                this.clickLetra(key.toLowerCase())
            } else if ((new RegExp('^Enter$')).test(key)) {
                this.clickEnter()
            } else if ((new RegExp('^Backspace$')).test(key)) {
                this.clickBorrar()
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/css/custom-css.css';
</style>
