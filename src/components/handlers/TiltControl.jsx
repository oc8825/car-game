export class TiltControl {

    // save user's perference so don't need to ask again
    static hasEnabledTilt = false;
    static hasDisabledTilt = false;

    constructor(scene, callback) {
        this.scene = scene;
        this.callback = callback;
        this.tiltThreshold = 2; // sensitivity (lower = more sensitive)
        this.laneChangeCooldown = false;
        this.isTiltSupported = this.checkTiltSupport();
        this.isTiltEnabled = false;
        this.boundHandleMotion = this.handleMotion.bind(this)
    }

    checkTiltSupport() {
        const ua = navigator.userAgent.toLowerCase();
        const isMobile = /android|iphone|ipad|ipod/.test(ua);
        const hasMotionSupport = typeof DeviceMotionEvent !== 'undefined';

        // exclude devices that would pass these checks but don't allow tilting
        const isKnownNoTiltDevice = ua.includes('crkey') || ua.includes('nest hub') || ua.includes('googletv');

        return hasMotionSupport && isMobile && !isKnownNoTiltDevice;
    }

    // ask for permission and turn on tilt controls if enabled
    enableTiltControls() {
        // tilt not allowed, don't bother asking permission from device
        if (!this.isTiltSupported) {
            this.scene.isPausedForTilt = false;
            if (!this.scene.isPausedForOrientation) {
                this.scene.scene.resume(); 
            }
            return;
        }

        // display text asking user if they want to enable tilt
        this.prompt = document.createElement('div');
        this.prompt.innerText = 'Enable tilt controls?';
        this.prompt.style.position = 'absolute';
        this.prompt.style.top = '40%';
        this.prompt.style.left = '25%';
        this.prompt.style.fontSize = '25px';
        this.prompt.style.width = 'calc(50% - 2px)';
        this.prompt.style.height = '70px';
        this.prompt.style.whiteSpace = 'normal';
        this.prompt.style.display = 'flex';
        this.prompt.style.justifyContent = 'center';
        this.prompt.style.alignItems = 'center';
        this.prompt.style.textAlign = 'center';
        this.prompt.style.lineHeight = '1.2';
        this.prompt.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.prompt.style.color = '#fff';
        this.prompt.style.border = '2px solid white';
        this.prompt.style.cursor = 'pointer';
        this.prompt.style.zIndex = '300';
        document.body.appendChild(this.prompt);

        // YES (enable tilt) button
        this.enableTiltButton = document.createElement('button');
        this.enableTiltButton.innerText = 'YES';
        this.enableTiltButton.style.position = 'absolute';
        this.enableTiltButton.style.top = 'calc(40% + 75px)';
        this.enableTiltButton.style.left = 'calc(50% + 2px)';
        this.enableTiltButton.style.fontSize = '20px';
        this.enableTiltButton.style.width = '25%';
        this.enableTiltButton.style.height = '50px';
        this.enableTiltButton.style.whiteSpace = 'normal';
        this.enableTiltButton.style.display = 'flex';
        this.enableTiltButton.style.justifyContent = 'center';
        this.enableTiltButton.style.alignItems = 'center';
        this.enableTiltButton.style.textAlign = 'center';
        this.enableTiltButton.style.lineHeight = '1.2';
        this.enableTiltButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.enableTiltButton.style.color = '#fff';
        this.enableTiltButton.style.border = '2px solid white';
        this.enableTiltButton.style.cursor = 'pointer';
        this.enableTiltButton.style.zIndex = '300';
        document.body.appendChild(this.enableTiltButton);

        // NO (disable tilt) button
        this.disableTiltButton = document.createElement('button');
        this.disableTiltButton.innerText = 'NO';
        this.disableTiltButton.style.position = 'absolute';
        this.disableTiltButton.style.top = 'calc(40% + 75px)';
        this.disableTiltButton.style.left = '25%';
        this.disableTiltButton.style.fontSize = '20px';
        this.disableTiltButton.style.width = '25%';
        this.disableTiltButton.style.height = '50px';
        this.disableTiltButton.style.whiteSpace = 'normal';
        this.disableTiltButton.style.display = 'flex';
        this.disableTiltButton.style.justifyContent = 'center';
        this.disableTiltButton.style.alignItems = 'center';
        this.disableTiltButton.style.textAlign = 'center';
        this.disableTiltButton.style.lineHeight = '1.2';
        this.disableTiltButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.disableTiltButton.style.color = '#fff';
        this.disableTiltButton.style.border = '2px solid white';
        this.disableTiltButton.style.cursor = 'pointer';
        this.disableTiltButton.style.zIndex = '300';
        document.body.appendChild(this.disableTiltButton);

        // user wants to enable tilt, ask permission from device
        this.enableTiltButton.addEventListener('click', () => {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then((response) => {
                        if (response === 'granted') {
                            // tilt permissions granted
                            TiltControl.hasEnabledTilt = true;
                            window.addEventListener('devicemotion', this.boundHandleMotion);
                            document.body.removeChild(this.enableTiltButton);
                            document.body.removeChild(this.disableTiltButton);
                            document.body.removeChild(this.prompt);
                            this.scene.isPausedForTilt = false;
                            if (!this.scene.isPausedForOrientation) {
                                this.scene.scene.resume(); 
                            }
                            this.isTiltEnabled = true;
                        } else {
                            // tilt permissions denied
                            TiltControl.hasDisabledTilt = true;
                            document.body.removeChild(this.enableTiltButton);
                            document.body.removeChild(this.disableTiltButton);
                            document.body.removeChild(this.prompt);
                            this.scene.isPausedForTilt = false;
                            if (!this.scene.isPausedForOrientation) {
                                this.scene.scene.resume(); 
                            }
                            this.isTiltEnabled = false;
                        }
                    })
                    .catch((error) => {
                        console.error('Error requesting permission:', error);
                        alert('Unable to enable tilt controls. ' + error);
                    });
            } 
            // turn on automatically if don't need permission
            else {
                TiltControl.hasEnabledTilt = true;
                window.addEventListener('devicemotion', this.boundHandleMotion);
                document.body.removeChild(this.enableTiltButton);
                document.body.removeChild(this.disableTiltButton);
                document.body.removeChild(this.prompt);
                this.scene.isPausedForTilt = false;
                if (!this.scene.isPausedForOrientation) {
                    this.scene.scene.resume(); 
                }
                this.isTiltEnabled = true;
            }
        });

        // user doesn't want to enable tilt, don't bother asking permission from device
        this.disableTiltButton.addEventListener('click', () => {
            TiltControl.hasDisabledTilt = true;
            document.body.removeChild(this.enableTiltButton);
            document.body.removeChild(this.disableTiltButton);
            document.body.removeChild(this.prompt);
            this.scene.isPausedForTilt = false;
            if (!this.scene.isPausedForOrientation) {
                this.scene.scene.resume(); 
            }
            this.isTiltEnabled = false;
        });

    }

    // use player's previous answer of enabling/disabling tilt to set up
    // tilt for subsequent levels
    enableTiltControlsIfPreviouslyEnabled() {
        if (!this.isTiltSupported || TiltControl.hasDisabledTilt) {
            this.scene.isPausedForTilt = false;
            if (!this.scene.isPausedForOrientation) {
                this.scene.scene.resume(); 
            } 
            return;
        }
        
        if (TiltControl.hasEnabledTilt) {
            window.addEventListener('devicemotion', this.boundHandleMotion);
            this.isTiltEnabled = true;
            this.scene.isPausedForTilt = false;
            if (!this.scene.isPausedForOrientation) {
                this.scene.scene.resume(); 
            }
        }
    }

    // change lanes depending on tilt direction
    handleMotion(event) {
        let tilt;
        const angle = screen.orientation.angle;

        if (angle === 90) {
            tilt = -event.accelerationIncludingGravity.y;
        } else if (angle === -90 || angle === 270) {
            tilt = event.accelerationIncludingGravity.y;
        } else {
            tilt = event.accelerationIncludingGravity.x;
        }

        if (!this.laneChangeCooldown) {
            if (!this.scene.levelCompleted && !this.scene.isRestarting) {
                if (tilt > this.tiltThreshold) {
                    this.callback(1); // move right
                    this.startCooldown();
                }
                else if (tilt < -this.tiltThreshold) {
                    this.callback(-1); // move left
                    this.startCooldown();
                }
            }
        }
    }

    // cooldown so the player doesn't accidentally change lanes multiple times for one tilt
    startCooldown() {
        this.laneChangeCooldown = true;
        this.scene.time.delayedCall(300, () => {
            this.laneChangeCooldown = false;
        });
    }

    disableTiltControls() {
        if (this.isTiltEnabled) {
            window.removeEventListener('devicemotion', this.boundHandleMotion);
            this.isTiltEnabled = false;
        }
    }
}
