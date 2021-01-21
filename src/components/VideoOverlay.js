import React from 'react';
import classNames from 'classnames';

import Button from './UI/Button';
import Title from './UI/Title';
import Modal from './Event/Modal';

import MouseEvent from './Event/MouseEvent';
import withTwitch from '../utils/HOCs/withTwitch';
import renderComponents from '../utils/functions/renderComponents';

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

        const global = {
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
                        <Modal global={global} />
                    </div>

                    <div
                        className={classNames(
                            'VideoOverlay-center-components VideoOverlay-safe-top',
                            {
                                'VideoOverlay-safe-right': userInterface.right?.components,
                                'VideoOverlay-top-layer': !modal.isOpen,
                            }
                        )}
                    >
                        {userInterface.left?.components && (
                            <div className="VideoOverlay-left-components">
                                {userInterface.left.components.map(
                                    renderComponents(Components, global, 'video_overlay', 'column')
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
                                    renderComponents(Components, global, 'video_overlay', 'column')
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
                        {userInterface.bottom?.components?.map(
                            renderComponents(Components, global, 'video_overlay', 'row')
                        )}
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default withTwitch(VideoOverlay, 'video_overlay');
