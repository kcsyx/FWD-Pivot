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
        // load images
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "instructions2");
        this.background.setOrigin(0, 0);
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
        this.endText = this.add.text(180, config.height / 2 - 250, "YOU  HAVE  COMPLETED  THE  GAME!", { fontSize: 36, fontFamily: "arcade_classic" });
        this.genderText = this.add.text(config.width / 2 - 200, config.height / 2 - 50, "Gender: " + this.gender, { fontSize: 24, fontFamily: "arcade_classic" });
        this.fwdText = this.add.text(config.width / 2 - 200, config.height / 2, "FWD$: " + this.moneyBags, { fontSize: 24, fontFamily: "arcade_classic" });
        this.timePlayedText = this.add.text(config.width / 2 - 200, config.height / 2 + 50, "Time played: " + this.clockTime, { fontSize: 24, fontFamily: "arcade_classic" });
        this.submitScores = this.add.text(config.width / 2 + 100, config.height / 2 + 200, "SUBMIT SCORES", { fontSize: 24, fontFamily: "arcade_classic" });
        this.submitScores.setInteractive();
        this.scoresSubmitted = false;
        this.name = "";
        this.email = "";
        this.finalScore = {
            name: self.name,
            email: self.email,
            gender: self.gender,
            moneyBags: self.moneyBags,
            timePlayed: self.clockTime
        }
        if (this.scoresSubmitted == false) {
            this.submitScores.on('pointerdown', function () {
                self.scoresSubmitted = true;
                self.submitScores.disableInteractive();

                const GetValue = Phaser.Utils.Objects.GetValue;
                var CreateLoginDialog = function (scene, config, onSubmit) {
                    var username = GetValue(config, 'username', '');
                    var email = GetValue(config, 'email', '');
                    var title = GetValue(config, 'title', 'Welcome');
                    var x = GetValue(config, 'x', 0);
                    var y = GetValue(config, 'y', 0);
                    var width = GetValue(config, 'width', undefined);
                    var height = GetValue(config, 'height', undefined);

                    var background = self.rexUI.add.roundRectangle(0, 0, 10, 10, 10, '0x4e342e');
                    var titleField = self.add.text(0, 0, title);
                    var userNameField = self.rexUI.add.label({
                        orientation: 'x',
                        background: self.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, '0x7b5e57'),
                        text: self.rexUI.add.BBCodeText(0, 0, username, { fixedWidth: 150, fixedHeight: 36, valign: 'center' }),
                        space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
                    })
                        .setInteractive()
                        .on('pointerdown', function () {
                            var config = {
                                onTextChanged: function (textObject, text) {
                                    username = text;
                                    textObject.text = text;
                                }
                            }
                            self.rexUI.edit(userNameField.getElement('text'), config);
                        });

                    var emailField = self.rexUI.add.label({
                        orientation: 'x',
                        background: self.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, '0x7b5e57'),
                        text: self.rexUI.add.BBCodeText(0, 0, email, { fixedWidth: 150, fixedHeight: 36, valign: 'center' }),
                        space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
                    })
                        .setInteractive()
                        .on('pointerdown', function () {
                            var config = {
                                onTextChanged: function (textObject, text) {
                                    email = text;
                                    textObject.text = text;
                                }
                            };
                            self.rexUI.edit(emailField.getElement('text'), config);
                        });

                    var loginButton = self.rexUI.add.label({
                        orientation: 'x',
                        background: self.rexUI.add.roundRectangle(0, 0, 10, 10, 10, '0x7b5e57'),
                        text: self.add.text(0, 0, 'Send'),
                        space: { top: 8, bottom: 8, left: 8, right: 8 }
                    })
                        .setInteractive()
                        .on('pointerdown', function () {
                            loginDialog.emit('login', username, email);
                        });

                    var loginDialog = self.rexUI.add.sizer({
                        orientation: 'y',
                        x: x,
                        y: y,
                        width: width,
                        height: height,
                    })
                        .addBackground(background)
                        .add(titleField, 0, 'center', { top: 10, bottom: 10, left: 10, right: 10 }, false)
                        .add(userNameField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
                        .add(emailField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
                        .add(loginButton, 0, 'center', { bottom: 10, left: 10, right: 10 }, false)
                        .layout();
                    return loginDialog;
                };
                var loginDialog = CreateLoginDialog(this, {
                    x: 400,
                    y: 300,
                    title: 'Welcome',
                    username: 'Kevin',
                    email: '123@gmail.com',
                })
                    .on('login', function (username, email) {
                        loginDialog.destroy();
                        self.finalScore.name = username;
                        self.finalScore.email = email;
                        //POST data to placeholder api, update api to real one on deployment//
                        fetch('https://jsonplaceholder.typicode.com/posts', {
                            method: 'POST',
                            body: JSON.stringify(self.finalScore),
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                            .then(response => response.json())
                            .then(json => console.log(json))
                    })
                    .popUp(500);
            });
        }
    }

    update() {

    }
};
