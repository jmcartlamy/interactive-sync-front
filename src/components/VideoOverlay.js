import React from 'react';
import Button from './UI/Button';
import Title from './UI/Title';

import getUserInterface from '../api/getUserInterface';
import withAuth from '../utils/HOCs/withAuth';
import MouseEvent from './Event/MouseEvent';
import getAllActions from '../api/getAllActions';

import './VideoOverlay.css';

class VideoOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userInterface: null,
            actions: null,
        };
    }

    async componentDidMount() {
        const { auth, twitch } = this.props;

        if (twitch) {
            const userInterface = await getUserInterface(auth, twitch);
            if (userInterface && userInterface.video_overlay) {
                this.setState({
                    userInterface: userInterface.video_overlay,
                });
            }

            const actions = await getAllActions(auth, twitch);
            this.setState({
                actions,
            });

            twitch.listen('broadcast', (target, contentType, body) => {
                const parseData = JSON.parse(body);
                if (parseData.type === 'action') {
                    const { actionId, actionCooldown } = parseData.data;
                    this.setState({
                        actions: {
                            ...this.state.actions,
                            [actionId]: Date.now() + actionCooldown,
                        },
                    });
                } else if (parseData.type === 'user_interface') {
                    twitch.rig.log('Received broadcast user_interface', parseData.data);
                    this.setState({
                        userInterface: parseData.data.video_overlay,
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.props.twitch) {
            this.props.twitch.unlisten('broadcast', () =>
                twitch.rig.log('Successfully unlistened')
            );
        }
    }

    render() {
        const { userInterface, actions } = this.state;
        const { auth, twitch } = this.props;

        const Components = {
            title: Title,
            button: Button,
        };

        if (userInterface) {
            return (
                <div className="VideoOverlay">
                    {userInterface.mouse && (
                        <MouseEvent
                            mouseInterface={userInterface.mouse}
                            auth={auth}
                            twitch={twitch}
                        />
                    )}
                    <div className="VideoOverlay-components">
                        {/* TODO improve user interface UI*/}
                        {userInterface.components &&
                            userInterface.components.map(({ type, ...props }) => 
                                React.createElement(Components[type], {
                                    ...props,
                                    auth,
                                    twitch,
                                    actions,
                                })
                            )}
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default withAuth(VideoOverlay);
