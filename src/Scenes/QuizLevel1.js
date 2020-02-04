import 'phaser';
import config from '../Config/config';

export default class QuizLevel1 extends Phaser.Scene {
    constructor() {
        super('QuizLevel1');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.clockTime = data.clockTime;
    }

    preload() {
    }

    create() {
        this.choice = undefined;
        this.cameras.main.fadeIn(500);
        this.scoreBoard = this.add.text(600, 40, "FWD$: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
        this.clock = this.plugins.get('rexClock').add(this);
        this.clock.start(this.clockTime);
        this.clockTimer = this.add.text(100, 40, '', { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
        this.endMap = false;
        var self = this;

        this.choice1 = this.add.text(275, config.height / 2 - 170, 'choice1', { fontSize: 24, fontFamily: "arcade_classic" });
        this.choice2 = this.add.text(445, config.height / 2 - 170, 'choice2', { fontSize: 24, fontFamily: "arcade_classic" });
        this.confirm = this.add.text(445, config.height / 2, 'confirm', { fontSize: 24, fontFamily: "arcade_classic" });

        this.choice1.setInteractive();
        this.choice2.setInteractive();

        this.choice1.on('pointerdown', function () {
            this.choice = "choice1";
            this.choice1.setColor("#173028");
            this.choice2.setColor("white");
        }.bind(this));

        this.choice2.on('pointerdown', function () {
            this.choice = "choice2";
            this.choice2.setColor("#173028");
            this.choice1.setColor("white");
        }.bind(this));

        this.confirm.on('pointerdown', function () {
            this.endMap = true;
            this.confirm.removeInteractive();
            console.log('Confirm pressed, choice is ' + self.choice);
            if (self.choice == "choice1") {
                console.log('CORRECT');
                //GO NEXT SCENE ADD MONEY SET SCOREBOARD
            }
        }.bind(this));
    }

    update() {
        if (this.choice !== undefined) {
            var self = this;
            if (this.endMap == false) {
                this.confirm.setInteractive();
            }
        }
        function msConversion(millis) {
            let sec = Math.floor(millis / 1000);
            let hrs = Math.floor(sec / 3600);
            sec -= hrs * 3600;
            let min = Math.floor(sec / 60);
            sec -= min * 60;

            sec = '' + sec;
            sec = ('00' + sec).substring(sec.length);

            if (hrs > 0) {
                min = '' + min;
                min = ('00' + min).substring(min.length);
                return hrs + ":" + min + ":" + sec;
            }
            else {
                return min + ":" + sec;
            }
        }
        this.clockTimer.setText(msConversion(this.clock.now));
    }
};
