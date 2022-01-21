import React from 'react';
import jsonwebtoken from 'jsonwebtoken';

import Panel from './Views/Panel';
import VideoOverlay from './Views/VideoOverlay';
import Mobile from './Views/Mobile';

import auth from '../utils/auth';

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
        };
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((authorized) => {
                if (authorized) {
                    if (authorized.token) {
                        // Request permission and reload extension if user accept
                        this.requestTwitchUserIdShare(authorized.token);
                    }
                    // Set user auth
                    auth.setUserAuth(authorized);
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

            this.twitch.configuration.onChanged(() => {
                if (this.twitch.configuration.broadcaster) {
                    try {
                        // Parsing the array saved in broadcaster content
                        const config = JSON.parse(this.twitch.configuration.broadcaster.content);

                        if (typeof config === 'object' && typeof config.host === 'string') {
                            // Add the server host in order to send the actions
                            auth.setHost(config.host);
                            // ⚠️ Extensions need to have re-rendered to be taken into account
                        }
                    } catch (err) {
                        console.log('Invalid config', err);
                    }
                }
            });
        }
    }

    requestTwitchUserIdShare(jwt) {
        const payload = jsonwebtoken.decode(jwt);
        if (
            (!payload || !payload.user_id || payload.user_id.length === 0) &&
            this.twitch?.actions
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

        const Components = {
            panel: Panel,
            video_overlay: VideoOverlay,
            mobile: Mobile,
        };
        const Component = Components[view];

        if (Component) {
            return (
                <Component twitch={this.twitch} auth={auth} view={view} theme={this.state.theme} />
            );
        }

        return null;
    }

    render() {
        const { finishedLoading, isVisible } = this.state;

        if (finishedLoading && isVisible) {
            return this.renderView();
        } else {
            return <div></div>;
        }
    }
}

export default App;
