export class TiltControl {
    constructor(scene, callback) {
        this.scene = scene;
        this.callback = callback;
        this.tiltThreshold = 1; // sensitivity
        this.laneChangeCooldown = false;
        this.isTiltSupported = this.checkTiltSupport();
        this.isTiltEnabled = false;
    }

    checkTiltSupport() {
        return (
            typeof DeviceMotionEvent !== 'undefined' &&
            (navigator.userAgent.toLowerCase().includes('android') || navigator.userAgent.toLowerCase().includes('iphone'))
        );
    }

    enableTiltControls() {
        if (!this.isTiltSupported) {
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
            this.isTilTEnabled = true;
            this.scene.scene.resume(); 
            return;
        }

        const enableTiltButton = document.createElement('button');
        enableTiltButton.innerText = 'Enable Tilt Controls';
        enableTiltButton.style.position = 'absolute';
        enableTiltButton.style.top = '50%';
        enableTiltButton.style.left = '50%';
        enableTiltButton.style.transform = 'translate(-50%, -50%)';
        enableTiltButton.style.fontSize = '20px';
        enableTiltButton.style.padding = '10px 20px';
        enableTiltButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        enableTiltButton.style.color = '#fff';
        enableTiltButton.style.border = 'none';
        enableTiltButton.style.cursor = 'pointer';

        document.body.appendChild(enableTiltButton);

        enableTiltButton.addEventListener('click', () => {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then((response) => {
                        if (response === 'granted') {
                            console.log('Permission granted for tilt controls!');
                            window.addEventListener('devicemotion', this.handleMotion.bind(this));
                            document.body.removeChild(enableTiltButton);
                            this.scene.scene.resume();
                            this.isTiltEnabled = true; // Mark tilt controls as enabled
                            onTiltEnabledCallback(); // ✅ Call the callback to resume scen
                        } else {
                            console.error('Permission denied for tilt controls.');
                            alert('Permission denied. Tilt controls are unavailable.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error requesting permission:', error);
                        alert('Unable to enable tilt controls. ' + error);
                    });
            } else {
                console.log('Tilt controls enabled (no permission required).');
                window.addEventListener('devicemotion', this.handleMotion.bind(this));
                document.body.removeChild(enableTiltButton);
                this.scene.scene.resume();
                this.isTiltEnabled = true; // Mark tilt controls as enabled
                onTiltEnabledCallback(); // ✅ Call the callback to resume scene

            }
        });
    }

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
            if (tilt > this.tiltThreshold) {
                this.callback(1); // move right
                this.startCooldown();
            } else if (tilt < -this.tiltThreshold) {
                this.callback(-1); // move left
                this.startCooldown();
            }
        }
    }

    startCooldown() {
        this.laneChangeCooldown = true;
        this.scene.time.delayedCall(300, () => {
            this.laneChangeCooldown = false;
        });
    }

    disableTiltControls() {
        if (this.isTiltEnabled) {
            window.removeEventListener('devicemotion', this.handleMotion.bind(this));
            this.isTiltEnabled = false;
            console.log('Tilt controls have been disabled.');
        }
    }
}
