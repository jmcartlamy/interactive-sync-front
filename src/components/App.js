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

        // If the extension is running on twitch or dev rig,
        // set the shorthand here, otherwise set to null
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: 'light',
            isVisible: true,
            isAuthorize: false,
        };
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                if (auth) {
                    if (auth.token) {
                        // Request permission and reload extension if user accept
                        this.requestTwitchUserIdShare(auth.token);
                        // TODO userSelfHandler
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

    renderView() {
        const { view } = this.props;
        if (view === 'panel') {
            return <Panel twitch={this.twitch} />;
        }
        if (view === 'video_overlay') {
            return <VideoOverlay twitch={this.twitch} />;
        }
        if (view === 'mobile') {
            return <Mobile twitch={this.twitch} />;
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
