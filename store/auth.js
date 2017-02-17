/**
 * User store
 * Keeps logged-in user's state
 */

import Cookie from 'cookie';
import Cookies from 'js-cookie';
import {setToken, $get, $post} from '../plugins/axios';

const inBrowser = typeof window !== 'undefined';
const ctx = global.__VUE_SSR_CONTEXT__;

function AuthStore({default_user} = {}) {
    let self = this;

    // ----------------------------------------
    // Default State
    // ----------------------------------------
    this.defaultState = {
        user: Object.assign({roles: [], name: null}, default_user),
        loggedIn: false,
        token: null
    };

    // ----------------------------------------
    // State
    // ----------------------------------------
    this.state = Object.assign({}, self.defaultState);

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    this.getters = {};

    // ----------------------------------------
    // Mutations
    // ----------------------------------------
    this.mutations = {

        setUser(state, user) {
            // Fill user with defaults data
            state.user = Object.assign({}, self.defaultState.user, user);

            // Set actual loggedIn status
            state.loggedIn = Boolean(user);
        },

        setToken(state, token) {
            state.token = token;

            // Setup axios
            setToken(token);

            // Store token in cookies
            if (inBrowser) {
                Cookies.set('token', token);
            }
        }

    };

    // ----------------------------------------
    // Actions
    // ----------------------------------------
    this.actions = {

        loadToken({commit}) {
            // Try to extract token from cookies
            let cookieStr = inBrowser ? document.cookie : ctx.req.headers.cookie;
            let cookies = Cookie.parse(cookieStr || '') || {};
            let token = cookies.token;

            commit('setToken', token);
        },

        async fetch({commit, dispatch, state}) {
            // Load user token
            dispatch('loadToken');

            // No token
            if (!state.token) {
                return;
            }

            // Get user profile
            try {
                let {user} = await $get('/auth/user');
                commit('setUser', user);
            } catch (err) {
                commit('setToken', null);
                commit('setUser', null);
            }
        },

        async login({commit, dispatch}, fields) {
            let {id_token} = await $post('/auth/login', fields);
            commit('setToken', id_token);
            await dispatch('fetch');
        },

        async logout({commit}) {
            // Unset token
            commit('setToken', null);

            // Unload user profile
            commit('setUser', null);

            // Server side logout
            try {
                await $get('/auth/logout');
            } catch (err) {

            }
        }
    };
}

export default AuthStore;

