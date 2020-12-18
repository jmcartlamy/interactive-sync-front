import React from 'react';
import jsonwebtoken from 'jsonwebtoken';

import withAuth from '../utils/HOCs/withAuth';
import Panel from './Panel';
import VideoOverlay from './VideoOverlay';
import Mobile from './Mobile';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.setModalIsOpen = this.setModalIsOpen.bind(this);
        this.setCurrentAction = this.setCurrentAction.bind(this);

        // If the extension is running on twitch or dev rig,
        // set the shorthand here, otherwise set to null
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: 'light',
            isVisible: true,
            isAuthorize: false,
            modalIsOpen: false,
            currentAction: null,
        };
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                if (auth) {
                    if (auth.token) {
                        // Request permission and reload extension if user accept
                        this.requestTwitchUserIdShare(auth.token);
                    }
                    // Set user auth
                    this.props.auth.setUserAuth(auth);
                }

                // if we've not set up after getting a token, let's set it up now.
                if (!this.state.finishedLoading) {
                    // Force rerender
                    this.setState(() => {
                        return { finishedLoading: true };
                    });
                }
            });

            this.twitch.onVisibilityChanged((isVisible, _c) => {
                this.visibilityChanged(isVisible);
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdated(context, delta);
            });
        }
    }

    requestTwitchUserIdShare(jwt) {
        const payload = jsonwebtoken.decode(jwt);
        if (
            (!payload || !payload.user_id || payload.user_id.length === 0) &&
            this.twitch &&
            this.twitch.actions
        ) {
            Twitch.ext.actions.requestIdShare();
        }
    }

    contextUpdated(context, delta) {
        this.twitch.rig.log(context);

        if (delta.includes('theme')) {
            this.setState(() => {
                return { theme: context.theme };
            });
        }
    }

    visibilityChanged(isVisible) {
        this.setState(() => {
            return {
                isVisible,
            };
        });
    }

    setModalIsOpen(modalIsOpen) {
        this.setState(() => {
            return {
                modalIsOpen,
            };
        });
    }

    setCurrentAction(currentAction) {
        this.setState(() => {
            return {
                currentAction,
            };
        });
    }

    renderView() {
        const { view, auth } = this.props;
        const modal = { isOpen: this.state.modalIsOpen, setIsOpen: this.setModalIsOpen };
        const action = { current: this.state.currentAction, setCurrent: this.setCurrentAction };

        const Components = {
            panel: Panel,
            video_overlay: VideoOverlay,
            mobile: Mobile,
        };
        const Component = Components[view];

        if (Component) {
            return <Component twitch={this.twitch} auth={auth} modal={modal} action={action} />;
        }

        return null;
    }

    render() {
        const { finishedLoading, isVisible, isAuthorize } = this.state;

        if (finishedLoading && isVisible) {
            return (
                <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'}>
                    {this.renderView()}
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

export default withAuth(App);
