import axios from 'axios';
import { logError, logSuccess } from '../utils/log';

export default async function (currentAction, formikValues) {
    const { view, auth, twitch, name, setMessage, setCooldownOnAction } = currentAction;
    twitch.rig.log('Requesting an action', name);
    const baseRequest = auth.createRequest('POST', 'action/input');

    if (baseRequest) {
        const request = {
            ...baseRequest,
            data: { id: name, view },
        };

        if (formikValues) {
            request.data.values = formikValues;
        }

        return axios(request)
            .then(function ({ data: actionObject, status }) {
                logSuccess(twitch.rig.log, actionObject.duration, status);
                if (!actionObject.broadcast) {
                    setCooldownOnAction(name, actionObject.duration);
                }
            })
            .catch(function (error) {
                if (error.response && error.response.status === 406) {
                    setMessage(error.response.data.message);
                    const tempTimeout = setTimeout(function () {
                        setMessage('');
                        clearTimeout(tempTimeout);
                    }, 3000);
                } else {
                    // TODO add notification
                    setMessage('');
                }
                logError(twitch.rig.log, error);
            });
    }
}
