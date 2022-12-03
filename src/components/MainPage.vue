<template>
    <b-container>
        <h1>Otakle</h1>
        <h5>An anime character Wordle!</h5>

        <!-- cuadros respuesta -->
        <div class="contenedor">
            <div class="filaIntentos" v-bind:key="'fila-intentos-' + i" v-for="i in range(CTES.INTENTOS_MAX)">
                <div class="cuadroIntento" :id="'cuadro' + i + j" v-bind:key="'cuadro-' + j" v-for="j in range(resp[1].length)">
                    <span :id="'i' + i + 'l' + j"></span>
                </div>
            </div>
        </div>
        <!-- teclado -->
        <div>
            <div class="filaIntentos" v-bind:key="'fila-keys-' + i" v-for="i in range(qwerty.split(',').length-1)">
                <div class="cuadroIntento" :id="qwerty.split(',')[i][j]" v-bind:key="'cuadro-key-' + j" v-for="j in range(qwerty.split(',')[i].length)" @click="clickLetra(qwerty.split(',')[i][j])">
                    <span>{{ qwerty.split(',')[i][j] }}</span>
                </div>
            </div>
            <div class="filaIntentos">
                <div class="cuadroIntentoEnter" @click="clickEnter">
                    <span style="display:table-cell; vertical-align:middle;">ENTER</span>
                </div>
                <div class="cuadroIntento" :id="qwerty.split(',')[qwerty.split(',').length-1][j]" v-bind:key="'cuadro-' + j" v-for="j in range(qwerty.split(',')[qwerty.split(',').length-1].length)" @click="clickLetra(qwerty.split(',')[qwerty.split(',').length-1][j])">
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
                <h1 class="headerResp">{{ respuestaCorrecta ? "Wonderful!" : "Lamentable..." }}</h1>
            </template>
            <template #body>
                <br>
                <b-row>
                    <b-col>
                        <h3>Character name was:</h3>
                        <h2><strong>{{ resp[2] }}</strong></h2>
                        <div class="div-timer">
                            <span>Next guess in:</span>
                            <div class="timer">
                                {{ timeLeft }}
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <img id="imgPersonaje" :src="resp[3]">
                    </b-col>
                </b-row>
                <br>
            </template>
        </Modal>
        <button hidden ref="boton_muestra_archivo_texto" data-bs-toggle="modal" data-bs-target="#modalRespuesta"></button>
    </b-container>
</template>

<script>
//import axios from 'axios'
import animeNamesFull from '!raw-loader!@pub/animeNamesFull.txt';
import Modal from '@c/Modal'
import ctes from '@a/js/ctes'
import { useToast } from "vue-toastification"

const fechaSubida = new Date('12/3/2022')

export default {
    name: 'MainPage',
    setup() {
      // Get toast interface
      const toast = useToast();
      // Make it available inside methods
      return { toast }
    },
    data() {
        return {
            idFila: 0,
            idColumna: 0,
            resp: [],
            CTES: ctes,
            respuestaCorrecta: false,
            intentos: [],
            palabrasAdmitidas: [],
            qwerty: 'qwertyuiop,asdfghjkl,zxcvbnm',
            juegoTerminado: false,
            timeLeft: ""
        }
    },
    components: {
        Modal
    },
    created() {
        let diffTime = Math.abs(new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })) - fechaSubida)
        this.idActual = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1
        let lineas = animeNamesFull.split("\n")
        this.resp = lineas.find(linea => linea.split(",")[0] == this.idActual).split(",")
        for (let item in lineas)
        {
            this.palabrasAdmitidas.push(lineas[item].split(",")[1])
        }

        window.addEventListener('keydown', (e) => { if(!e.altKey && !e.shiftKey && !e.ctrlKey) this.keyPressed(e.key) });
    },
    mounted() {
        this.$nextTick(async () => {
            let cookieRespuestas = this.getCookie("r")
            if (cookieRespuestas != "") {
                let palabras = cookieRespuestas.split("&&")
                for (let i in palabras) {
                    this.idFila = i
                    for (let j in palabras[i]) {
                        document.getElementById("i" + i + "l" + j).innerText = palabras[i][j].toUpperCase()
                    }
                    await this.clickEnter(false)
                    document.getElementById("cuadro" + (parseInt(i)+1) + 0).classList.remove('siguienteLetra')
                }
            } else {
                document.getElementById("cuadro" + this.idFila + this.idColumna).classList.add('siguienteLetra')
            }
            if (!this.juegoTerminado)
                document.getElementById("cuadro" + (parseInt(this.idFila)) + 0).classList.add('siguienteLetra')
        })

        this.getTimeLeftToReset()
        setInterval(this.getTimeLeftToReset, 1000)
    },
    methods: {
        abreModalRespuesta() {
            this.$refs.boton_muestra_archivo_texto.click()
        },

        async clickEnter(isClicked = true) {
            if (!this.juegoTerminado) {
                // obtiene las letras ingresadas y las convierte en un string
                let letras = []
                Array.from(document.querySelectorAll('[id^="cuadro' + this.idFila + '"]')).forEach(elem => {
                    letras.push(elem.children[0].innerText.toLowerCase())
                })

                let palabra = letras.join('')
                let respuesta = this.resp[1].toLowerCase()
                
                if (palabra.length == respuesta.length) {
                    if (this.checkPalabraValida(palabra)) {
                        Array.from(document.querySelectorAll('[id^="cuadro' + this.idFila + '"]')).forEach(elem => {
                            elem.classList.add("flip-palabra")
                        })

                        await new Promise(resolve => {
                            setTimeout(resolve, 200);
                        });
                        let dic = {}
                        if (isClicked)
                            this.setCookieJuego(palabra)

                        // busca las posiciones de cada letra
                        letras.forEach((letra) => {
                            if (!(letra in dic)) {
                                var regex = (new RegExp(letra, 'gi')), result, indices = [];
                                while ( (result = regex.exec(respuesta)) ) {
                                    indices.push(result.index)
                                }
                                dic[letra] = { cant: (respuesta.match(new RegExp(letra, 'g')) || []).length, pos: indices, checkeados: 0 }
                            }
                        });
                        // colorea las letras grises y verdes
                        for (let i in palabra) {
                            if (palabra[i] in dic && dic[palabra[i]].cant > 0) {
                                if (dic[palabra[i]].pos.includes(parseInt(i))) {
                                    dic[palabra[i]].checkeados++
                                    document.getElementById("cuadro" + this.idFila + i).classList.add('letraCorrecta')
                                    document.getElementById(palabra[i]).classList.remove('letraCasi')
                                    document.getElementById(palabra[i]).classList.add('letraCorrecta')
                                }
                            } else {
                                document.getElementById("cuadro" + this.idFila + i).classList.add('letraIncorrecta')
                                document.getElementById(palabra[i]).classList.add('letraIncorrecta')
                            }
                        }
        
                        // colorea las letras amarillas
                        for (let i in palabra) {
                            if (palabra[i] in dic && dic[palabra[i]].checkeados < dic[palabra[i]].pos.length) {
                                if (!document.getElementById("cuadro" + this.idFila + i).classList.contains('letraCorrecta'))
                                    document.getElementById("cuadro" + this.idFila + i).classList.add('letraCasi')
                                if (!document.getElementById(palabra[i]).classList.contains('letraCorrecta')) {
                                    document.getElementById(palabra[i]).classList.add('letraCasi')
                                }
                                dic[palabra[i]].checkeados++
                            }
                            else if (palabra[i] in dic && dic[palabra[i]].checkeados >= dic[palabra[i]].pos.length && !(document.getElementById("cuadro" + this.idFila + i).classList.contains('letraCorrecta')) || document.getElementById("cuadro" + this.idFila + i).classList.contains('letraCasi')) {
                                if (!document.getElementById("cuadro" + this.idFila + i).classList.contains('letraCorrecta'))
                                    document.getElementById("cuadro" + this.idFila + i).classList.add('letraCasi')
                                if (!(document.getElementById(palabra[i]).classList.contains('letraCorrecta') || document.getElementById(palabra[i]).classList.contains('letraCasi'))) {
                                    document.getElementById(palabra[i]).classList.add('letraIncorrecta')
                                }
                            }
                        }

                        if (palabra == respuesta) {
                            this.respuestaCorrecta = true
                            this.abreModalRespuesta()
                            this.juegoTerminado = true
                            return
                        }

                        this.idFila++
                        this.idColumna = 0
                        if (this.idFila == ctes.INTENTOS_MAX) {
                            this.respuestaCorrecta = false
                            this.abreModalRespuesta()
                            this.juegoTerminado = true
                            return
                        } else {
                            document.getElementById("cuadro" + this.idFila + this.idColumna).classList.add('siguienteLetra')
                        }
                    } else {
                        this.toast.error("That's not a valid character name", {
                            position: "top-center",
                            timeout: 2000,
                            closeOnClick: true,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            draggable: true,
                            draggablePercent: 0.6,
                            showCloseButtonOnHover: true,
                            hideProgressBar: true,
                            closeButton: "button",
                            icon: true,
                            rtl: false
                        });
                    }
                } else {
                    this.toast.error("You have to enter " + this.resp[1].length + " letters", {
                        position: "top-center",
                        timeout: 2000,
                        closeOnClick: true,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        draggablePercent: 0.6,
                        showCloseButtonOnHover: true,
                        hideProgressBar: true,
                        closeButton: "button",
                        icon: true,
                        rtl: false
                    });
                }
            }
        },

        checkPalabraValida(palabra) {
            for (let i = 0; i < this.palabrasAdmitidas.length; i++) {
                if (this.palabrasAdmitidas[i].toLowerCase() == palabra.toLowerCase()) {
                    return true
                }
            }
            return false
        },
        
        clickBorrar() {
            if (!this.juegoTerminado) {
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
            }
        },
        
        clickLetra(letra) {
            if (!this.juegoTerminado) {
                let casilla = document.getElementById('i' + this.idFila + 'l' + this.idColumna)
                if (casilla) {
                    document.getElementById("cuadro" + this.idFila + this.idColumna).classList.remove('siguienteLetra')
                    casilla.innerText = letra.toUpperCase()
                    this.idColumna++
                    let cuadro = document.getElementById("cuadro" + this.idFila + this.idColumna)
                    if (cuadro)
                        cuadro.classList.add('siguienteLetra')
                }
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
        },

        setCookieJuego(palabra) {
            let anterior = this.getCookie("r")
            let valor = anterior + (anterior != "" ? "&&" : "") + palabra
            this.setCookie("r", valor, this.getSoloFechaServer() - new Date())
        },

        setCookie(cname, cvalue, milisegundos) {
            const d = new Date()
            d.setTime(d.getTime() + milisegundos)
            let expires = "expires="+ d.toGMTString()
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
        },

        getCookie(cname) {
            let name = cname + "="
            let decodedCookie = decodeURIComponent(document.cookie)
            let ca = decodedCookie.split(';')
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i]
                while (c.charAt(0) == ' ') {
                        c = c.substring(1)
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length)
                }
            }
            return ""
        },

        msToTime(s) {
            // Pad to 2 or 3 digits, default is 2
            function pad(n, z) {
                z = z || 2
                return ('00' + n).slice(-z)
            }

            var ms = s % 1000
            s = (s - ms) / 1000
            var secs = s % 60
            s = (s - secs) / 60
            var mins = s % 60
            var hrs = (s - mins) / 60

            return pad(hrs) + ':' + pad(mins) + ':' + pad(secs)
        },

        getTimeLeftToReset() {
            let soloFechaServer = this.getSoloFechaServer()
            let segundosRestantesReset = this.msToTime(soloFechaServer - new Date())
            this.timeLeft = segundosRestantesReset
        },

        getSoloFechaServer() {
            let horaServer = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }))
            horaServer.setDate(horaServer.getDate() + 1)
            return new Date(horaServer.getFullYear(), horaServer.getMonth(), horaServer.getDate())
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/css/custom-css.css';
</style>
