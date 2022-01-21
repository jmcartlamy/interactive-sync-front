/**
 * Helpers for authentication against EBS service.
 * Allows the storage of a token to be accessed across components.
 */

const state = {};

const auth = {
    isLoggedIn: function () {
        return state.opaque_id[0] === 'U' ? true : false;
    },

    setUserAuth: function (auth) {
        state.token = auth.token;
        state.opaque_id = auth.userId;
    },

    // Set host coming from extension configuration to create request
    setHost: function (host) {
        state.host = host;
    },

    getHost: function () {
        return state.host;
    },

    // Checks to ensure there is a valid token in the state
    isAuthenticated: function () {
        if (state.token && state.opaque_id) {
            return true;
        } else {
            return false;
        }
    },

    // Prepare request to make calls
    createRequest: function (method = 'GET', path = '') {
        const host = process.env.NODE_ENV === 'production' ? state.host : '//localhost:8081/';

        if (typeof host !== 'undefined' && this.isAuthenticated()) {
            return {
                method: method,
                url: location.protocol + host + path,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.token}`,
                },
            };
        }
        return null;
    },
};

export default auth;
