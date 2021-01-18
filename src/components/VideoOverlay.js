import React from 'react';
import classNames from 'classnames';

import Button from './UI/Button';
import Title from './UI/Title';
import Modal from './Event/Modal';

import MouseEvent from './Event/MouseEvent';
import withTwitch from '../utils/HOCs/withTwitch';

import './VideoOverlay.css';

class VideoOverlay extends React.PureComponent {
    render() {
        const {
            auth,
            twitch,
            modal,
            userInterface,
            actions,
            userCooldown,
            setCooldownOnAction,
        } = this.props;

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
            modal,
        };

        if (userInterface) {
            return (
                <div className="VideoOverlay">
                    <div
                        className={classNames('VideoOverlay-modal', {
                            'VideoOverlay-modal-hidden': !modal.isOpen,
                        })}
                    >
                        <Modal modal={modal} actions={actions} userCooldown={userCooldown} />
                    </div>

                    <div
                        className={classNames(
                            'VideoOverlay-center-components VideoOverlay-safe-top',
                            {
                                'VideoOverlay-safe-right': userInterface.right?.components,
                            }
                        )}
                    >
                        {/* TODO improve user interface UI*/}
                        {userInterface.left?.components && (
                            <div className="VideoOverlay-left-components">
                                {userInterface.left.components.map(
                                    ({ type, ...properties }) =>
                                        Components[type] &&
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
                        {userInterface.right?.components && (
                            <div className="VideoOverlay-right-components">
                                {userInterface.right.components.map(
                                    ({ type, ...properties }) =>
                                        Components[type] &&
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
                    <div
                        className={classNames('VideoOverlay-bottom-components', {
                            'VideoOverlay-safe-bottom': userInterface.bottom?.components?.find(
                                ({ type }) => type === 'button'
                            ),
                        })}
                    >
                        {/* TODO improve user interface UI*/}
                        {userInterface.bottom?.components?.map(
                            ({ type, ...properties }) =>
                                Components[type] &&
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
