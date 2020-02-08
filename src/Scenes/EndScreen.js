import 'phaser';
import config from '../Config/config';

export default class EndScreen extends Phaser.Scene {
    constructor() {
        super('EndScreen');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.clockTime = data.clockTime;
    }

    preload() {
    }

    create() {
        this.cameras.main.fadeIn(500);
        var self = this;
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
        this.clockTime = (msConversion(this.clockTime));
        this.genderText = this.add.text(200, config.height / 2 - 100, "Gender: " + this.gender, { fontSize: 24, fontFamily: "arcade_classic" });
        this.fwdText = this.add.text(200, config.height / 2, "FWD$: " + this.moneyBags, { fontSize: 24, fontFamily: "arcade_classic" });
        this.timePlayedText = this.add.text(200, config.height / 2 + 100, "Time played: " + this.clockTime, { fontSize: 24, fontFamily: "arcade_classic" });
        this.submitScores = this.add.text(200, config.height / 2 + 200, "SUBMIT SCORES", { fontSize: 24, fontFamily: "arcade_classic" });
        this.submitScores.setInteractive();
        this.scoresSubmitted = false;
        if (this.scoresSubmitted == false) {
            this.submitScores.on('pointerdown', function () {
                this.scoresSubmitted = true;
                //text pop ask for email, name and SEND button
                    //On SEND button AJAX POST email, name, GENDER, FWD$, TIMEPLAYED//
            });
        }
    }

    update() {

    }
};
