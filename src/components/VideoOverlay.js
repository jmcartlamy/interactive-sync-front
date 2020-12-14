import React from 'react';
import Button from './UI/Button';
import Title from './UI/Title';

import MouseEvent from './Event/MouseEvent';
import withTwitch from '../utils/HOCs/withTwitch';

import './VideoOverlay.css';

class VideoOverlay extends React.PureComponent {
    render() {
        const {
            auth,
            twitch,
            setCooldownForUser,
            userInterface,
            actions,
            userIsInCooldown,
            setCooldownOnAction,
        } = this.props;

        const userCooldown = { set: setCooldownForUser, value: userIsInCooldown };
        const Components = {
            title: Title,
            button: Button,
        };
        const props = {
            auth,
            twitch,
            actions,
            userCooldown,
            setCooldownOnAction,
        };

        if (userInterface) {
            return (
                <div className="VideoOverlay">
                    <div className="VideoOverlay-center-components">
                        {/* TODO improve user interface UI*/}
                        {userInterface.left && userInterface.left.components && (
                            <div className="VideoOverlay-left-components">
                                {userInterface.left.components.map(({ type, ...properties }) =>
                                    React.createElement(Components[type], {
                                        ...properties,
                                        ...props,
                                        view: 'video_overlay',
                                        direction: 'column',
                                    })
                                )}
                            </div>
                        )}
                        {userInterface.mouse ? (
                            <MouseEvent
                                mouseInterface={userInterface.mouse}
                                auth={auth}
                                twitch={twitch}
                            />
                        ) : (
                            <div className="VideoOverlay-middle-components" />
                        )}
                        {userInterface.right && userInterface.right.components && (
                            <div className="VideoOverlay-right-components">
                                {userInterface.right.components.map(({ type, ...properties }) =>
                                    React.createElement(Components[type], {
                                        ...properties,
                                        ...props,
                                        view: 'video_overlay',
                                        direction: 'column',
                                    })
                                )}
                            </div>
                        )}
                    </div>
                    <div className="VideoOverlay-bottom-components">
                        {/* TODO improve user interface UI*/}
                        {userInterface.bottom &&
                            userInterface.bottom.components &&
                            userInterface.bottom.components.map(({ type, ...properties }) =>
                                React.createElement(Components[type], {
                                    ...properties,
                                    ...props,
                                    view: 'video_overlay',
                                    direction: 'row',
                                })
                            )}
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default withTwitch(VideoOverlay, 'video_overlay');
