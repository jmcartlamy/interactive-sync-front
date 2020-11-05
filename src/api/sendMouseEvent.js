import axios from 'axios';
import { logError, logSuccess } from '../utils/log';

export default async function (auth, twitch, params) {
    const baseRequest = auth.createRequest('POST', 'mouse/send');

    if (baseRequest) {
        const request = {
            ...baseRequest,
            data: {
                id: params.name,
                type: params.type,
                clientWidth: params.clientWidth,
                clientHeight: params.clientHeight,
                clientX: params.clientX,
                clientY: params.clientY,
            },
        };

        try {
            const { data, status } = await axios(request);

            const coord = 'x: ' + data.clientX + ', y: ' + data.clientY;
            logSuccess(twitch.rig.log, coord, status);
        } catch (error) {
            logError(twitch.rig.log, error);
        }
    }
}
