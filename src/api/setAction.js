import axios from 'axios';
import { logError, logSuccess } from '../utils/log';

export default async function (auth, twitch, name, setMessage) {
    twitch.rig.log('Requesting an action', name);
    const baseRequest = auth.createRequest('POST', 'action/new');

    if (baseRequest) {
        const request = {
            ...baseRequest,
            data: { id: name },
        };

        return axios(request)
            .then(function ({ data: actionCooldown, status }) {
                logSuccess(twitch.rig.log, actionCooldown, status);
            })
            .catch(function (error) {
                if (error.response && error.response.status === 406) {
                    setMessage(error.response.data.message);
                    const tempTimeout = setTimeout(function () {
                        setMessage('');
                        clearTimeout(tempTimeout);
                    }, 3000);
                } else {
                    setMessage('Denied');
                }
                logError(twitch.rig.log, error);
            });
    }
}
