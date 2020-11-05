import axios from 'axios';
import { logError, logSuccess } from '../utils/log';

export default async function (auth, twitch) {
    const request = auth.createRequest('GET', 'user/interface/query');

    if (request) {
        try {
            const { data, status } = await axios(request);
            logSuccess(twitch.rig.log, JSON.stringify(data), status);
            return data || null;
        } catch (error) {
            logError(twitch.rig.log, error);
            return null;
        }
    }
}
