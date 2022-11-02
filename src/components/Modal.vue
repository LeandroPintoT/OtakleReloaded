<template>
    <div class="modal fade" ref="modal" tabindex="-1" aria-hidden="true">
        <div v-bind:class="{ 'modal-dialog': true,
                             'modal-xl': contentSize == 'xl',
                             'modal-lg': contentSize == 'lg',
                             'modal-sm': contentSize == 'sm'}">
            <div class="modalCustom">
                <div v-if="modal_shown">
                    <div class="modal-header modalHeaderCustom" v-if="!noheader">
                        <slot name="header"></slot>
                    </div>
                    <div class="modal-body" v-if="!nobody" ref="slot">
                        <slot name="body"></slot>
                    </div>
                    <div class="modal-footer" v-if="!nofooter">
                        <div class="modal-footer">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ctes from '@a/js/ctes'

export default {
    name: 'ModalPopup',
    data () {
        return {
            modal_shown: false,
            contentSize: '',
            imgWidth: 0,
            imgHeight: 0
        }
    },
    props: {
        noheader: {
            type: Boolean,
            default: false,
            required: false
        },
        nobody: {
            type: Boolean,
            default: false,
            required: false
        },
        nofooter: {
            type: Boolean,
            default: false,
            required: false
        },
        dir: {
            type: String,
            default: "",
            required: false
        },
        currDir: {
            type: String,
            default: "",
            required: false
        },
        arch: {
            type: String,
            default: "",
            required: false
        },
        nomUsuario: {
            type: String,
            default: "",
            required: false
        },
        tipo: {
            type: Number,
            required: true
        }
    },
    components: {
        
    },
    mounted() {
        let modal = this.$refs.modal
        
        modal.addEventListener('show.bs.modal', function () {
            this.modal_shown = true
            switch (this.tipo) {
                case ctes.IMG:
                    this.contentSize = 'lg'
                    break;
                case ctes.VIDEO:
                    this.contentSize = 'xl'
                    break;
                case ctes.AUDIO:
                    this.contentSize = ''
                    break;
                case ctes.PDF:
                    this.contentSize = 'xl'
                    break;
                case ctes.UPLOAD:
                    this.contentSize = 'xl'
                    break;
                default:
                    break;
            }
        }.bind(this))   // se manda this para tener la referencia al componente
        modal.addEventListener('hidden.bs.modal', function () {
            this.modal_shown = false
        }.bind(this))   // se manda this para tener la referencia al componente
    },
    methods: {
        
    }
}
</script>

<style scoped>

</style>