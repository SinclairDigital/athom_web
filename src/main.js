import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import EventsBus from './core/bus.vue';
import storage from './core/storage';
import consts from './core/consts';
import mixins from './core/mixins';
import apps from './core/applications';

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.mixin(mixins);

window.Vue = Vue;

let theBus  = new Vue(EventsBus);

Vue.prototype.$bus          = theBus;
Vuex.Store.prototype.$bus   = theBus;
window.Vue.$bus             = theBus;

window.$store   = new Vuex.Store(storage);
window.$bus     = theBus;
window.$consts  = consts;
window.$registerApplication = apps.registerApplication;

//Application component storage
window.$applications    = {};

Vue.config.productionTip = false;

//Multi Language
Vue.filter('lang', function (value) {

    let lang = window.$store.state.display.lang;
    let consts  = window.$consts;

    if(lang in consts.LANGS && value in consts.LANGS[lang])
        return consts.LANGS[lang][value];
    else {
        console.warn('Not found lang const ', value);
        return value;
    }
})

new Vue({
    el: '#app',
    router,
    store : window.$store,
    components: { App },
    template: '<App/>'
});

window.$store.dispatch('initData');

setTimeout(() => {
    window.$bus.$emit(consts.EVENTS.APP_IS_LOADED);
}, 50)
