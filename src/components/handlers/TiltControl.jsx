export class TiltControl {

    static hasEnabledTilt = false;
    static hasDisabledTilt = false;

    constructor(scene, callback) {
        this.scene = scene;
        this.callback = callback;
        this.tiltThreshold = 2; // sensitivity
        this.laneChangeCooldown = false;
        this.isTiltSupported = this.checkTiltSupport();
        this.isTiltEnabled = false;
        this.boundHandleMotion = this.handleMotion.bind(this)
    }

    
    checkTiltSupport() {
        const ua = navigator.userAgent.toLowerCase();
        const isMobile = /android|iphone|ipad|ipod/.test(ua);
        const hasMotionSupport = typeof DeviceMotionEvent !== 'undefined';

        const isKnownNoTiltDevice = ua.includes('crkey') || ua.includes('nest hub') || ua.includes('googletv');

        return hasMotionSupport && isMobile && !isKnownNoTiltDevice;
    }

    // ask for permission and turn on tilt controls
    enableTiltControls() {
        if (!this.isTiltSupported) {
            window.addEventListener('devicemotion', this.boundHandleMotion); // why adding listener when tilt isn't supported?
            this.isTiltEnabled = false; // if tilt stops working, change this back to true
            // could i just get rid of two lines above?
            this.scene.isPausedForTilt = false;
            if (!this.scene.isPausedForOrientation) {
                this.scene.scene.resume(); 
            }
            return;
        }

        const prompt = document.createElement('div');
        prompt.innerText = 'Enable tilt controls?';
        prompt.style.position = 'absolute';
        prompt.style.top = '40%';
        prompt.style.left = '25%';
        prompt.style.fontSize = '25px';
        prompt.style.width = 'calc(50% - 1px)';
        prompt.style.height = '70px';
        prompt.style.whiteSpace = 'normal';
        prompt.style.display = 'flex';
        prompt.style.justifyContent = 'center';
        prompt.style.alignItems = 'center';
        prompt.style.textAlign = 'center';
        prompt.style.lineHeight = '1.2';
        prompt.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        prompt.style.color = '#fff';
        prompt.style.border = '2px solid white';
        prompt.style.cursor = 'pointer';
        prompt.style.zIndex = '300';
        document.body.appendChild(prompt);

        const enableTiltButton = document.createElement('button');
        enableTiltButton.innerText = 'YES';
        enableTiltButton.style.position = 'absolute';
        enableTiltButton.style.top = 'calc(40% + 74px)';
        enableTiltButton.style.left = 'calc(50% + 2px)';
        enableTiltButton.style.fontSize = '20px';
        enableTiltButton.style.width = '25%';
        enableTiltButton.style.height = '50px';
        enableTiltButton.style.whiteSpace = 'normal';
        enableTiltButton.style.display = 'flex';
        enableTiltButton.style.justifyContent = 'center';
        enableTiltButton.style.alignItems = 'center';
        enableTiltButton.style.textAlign = 'center';
        enableTiltButton.style.lineHeight = '1.2';
        enableTiltButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        enableTiltButton.style.color = '#fff';
        enableTiltButton.style.border = '2px solid white';
        enableTiltButton.style.cursor = 'pointer';
        enableTiltButton.style.zIndex = '300';
        document.body.appendChild(enableTiltButton);

        const disableTiltButton = document.createElement('button');
        disableTiltButton.innerText = 'NO';
        disableTiltButton.style.position = 'absolute';
        disableTiltButton.style.top = 'calc(40% + 74px)';
        disableTiltButton.style.left = '25%';
        disableTiltButton.style.fontSize = '20px';
        disableTiltButton.style.width = '25%';
        disableTiltButton.style.height = '50px';
        disableTiltButton.style.whiteSpace = 'normal';
        disableTiltButton.style.display = 'flex';
        disableTiltButton.style.justifyContent = 'center';
        disableTiltButton.style.alignItems = 'center';
        disableTiltButton.style.textAlign = 'center';
        disableTiltButton.style.lineHeight = '1.2';
        disableTiltButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        disableTiltButton.style.color = '#fff';
        disableTiltButton.style.border = '2px solid white';
        disableTiltButton.style.cursor = 'pointer';
        disableTiltButton.style.zIndex = '300';
        document.body.appendChild(disableTiltButton);

        enableTiltButton.addEventListener('click', () => {
            // ask permission if needed
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then((response) => {
                        if (response === 'granted') {
                            console.log('Permission granted for tilt controls!');
                            TiltControl.hasEnabledTilt = true;
                            window.addEventListener('devicemotion', this.boundHandleMotion);
                            document.body.removeChild(enableTiltButton);
                            document.body.removeChild(disableTiltButton);
                            document.body.removeChild(prompt);
                            this.scene.isPausedForTilt = false;
                            if (!this.scene.isPausedForOrientation) {
                                this.scene.scene.resume(); 
                            }
                            this.isTiltEnabled = true;
                        } else {
                            console.log('Permission denied for tilt controls.');
                            // alert('Permission denied. Tilt controls are unavailable.');
                            TiltControl.hasDisabledTilt = true;
                            document.body.removeChild(enableTiltButton);
                            document.body.removeChild(disableTiltButton);
                            document.body.removeChild(prompt);
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
                console.log('Tilt controls enabled (no permission required).');
                TiltControl.hasEnabledTilt = true;
                window.addEventListener('devicemotion', this.boundHandleMotion);
                document.body.removeChild(enableTiltButton);
                document.body.removeChild(disableTiltButton);
                document.body.removeChild(prompt);
                this.scene.isPausedForTilt = false;
                if (!this.scene.isPausedForOrientation) {
                    this.scene.scene.resume(); 
                }
                this.isTiltEnabled = true; 

            }
        });

        disableTiltButton.addEventListener('click', () => {
            console.log('Permission denied for tilt controls.');
            TiltControl.hasDisabledTilt = true;
            document.body.removeChild(enableTiltButton);
            document.body.removeChild(disableTiltButton);
            document.body.removeChild(prompt);
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
            window.addEventListener('devicemotion', this.boundHandleMotion);
            this.isTiltEnabled = true;
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

    // cooldown so the player doesn't accidentally change lanes
    // multiple times for one tilt
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
            console.log('Tilt controls have been disabled.');
        }
    }
}
