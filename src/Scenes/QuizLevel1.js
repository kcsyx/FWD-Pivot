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
        this.scoreBoard = this.add.text(600, 40, "FWD$: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0).setDepth(2);
        this.clock = this.plugins.get('rexClock').add(this);
        this.clock.start(this.clockTime);
        this.clockTimer = this.add.text(100, 40, '', { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0).setDepth(2);
        this.endMap = false;
        var self = this;

        this.question = this.add.text(100, config.height / 2 - 180, 'Motorcycle  insurance  ONLY  covers  breakdowns', { fontSize: 36, fontFamily: "arcade_classic", wordWrap: { width: 740, useAdvancedWrap: false } });
        this.choice1 = this.add.text(275, config.height / 2 - 10, 'TRUE', { fontSize: 24, fontFamily: "arcade_classic" });
        this.choice2 = this.add.text(445, config.height / 2 - 10, 'FALSE', { fontSize: 24, fontFamily: "arcade_classic" });
        this.confirm = this.add.text(445, config.height / 2 + 100, 'CONFIRM', { fontSize: 24, fontFamily: "arcade_classic" });
        this.choice1.setColor("#00ff4a");
        this.choice2.setColor("#fb0909");
        this.choice1.setInteractive();
        this.choice2.setInteractive();

        this.choice1.on('pointerdown', function () {
            this.choice = "choice1";
            this.choice1.setStroke("#FFF", 8);
            this.choice2.setStroke(0);
        }.bind(this));

        this.choice2.on('pointerdown', function () {
            this.choice = "choice2";
            this.choice2.setStroke("#FFF", 8);
            this.choice1.setStroke(0);
        }.bind(this));

        this.confirm.on('pointerdown', function () {
            this.endMap = true;
            this.choice1.removeInteractive();
            this.choice2.removeInteractive();
            this.confirm.removeInteractive();
            if (self.choice == "choice2") {
                self.moneyBags += 350;
                self.moneyChange = self.add.text(600, 60, "+ 350", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                self.tweens.add({
                    targets: self.moneyChange,
                    alpha: { from: 1, to: 0 },
                    duration: 4000,
                    ease: 'Power2'
                });
                self.scoreBoard.setText("FWD$: " + self.moneyBags);
                self.confirm.setText("CORRECT!");
                self.confirm.setColor("#00ff4a");
                self.goNext = this.add.text(445, config.height / 2 + 130, 'NEXT', { fontSize: 24, fontFamily: "arcade_classic" });
                self.goNext.setInteractive();
                self.goNext.on('pointerdown', function () {
                    self.scene.start('QuizLevel2', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now });
                });
            } else if (self.choice == "choice1") {
                self.moneyBags = self.moneyBags;
                self.moneyChange = self.add.text(600, 60, "+ 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                self.tweens.add({
                    targets: self.moneyChange,
                    alpha: { from: 1, to: 0 },
                    duration: 4000,
                    ease: 'Power2'
                });
                self.confirm.setText("WRONG!");
                self.confirm.setColor("#fb0909");
                self.goNext = this.add.text(445, config.height / 2 + 130, 'NEXT', { fontSize: 24, fontFamily: "arcade_classic" });
                self.goNext.setInteractive();
                self.goNext.on('pointerdown', function () {
                    self.scene.start('QuizLevel2', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now });
                });
            }
        }.bind(this));
    }

    update() {
        if (this.choice !== undefined) {
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
