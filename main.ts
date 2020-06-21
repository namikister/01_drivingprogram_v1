/**
 * 01_DrivingProgram_v1
 * 
 * マイコンロボット(クローラータイプ)向け　基本走行用プログラム
 * 
 * This is the basic program for the Tamiya Microcomputer Robot (Crawler Type).
 */
// 無線でコントローラーから送られたデータをもとに動作を決定する
// Uses data received from remote controller to define movement.
//     
function RC () {
    // 受信データ　：　0(指令無し)
    // ギア状態　　：　0(前後進無し)　なら
    // If received data is 0 (no command) ,
    // and gear is 0 (no forward/reverse movement)...
    //             
    // 受信データ　：　555(前進指令)　なら
    // If received data is 555 (forward command)...
    //             
    // 受信データ　：　666(後進指令)　なら
    // If received data is 666 (reverse command)...
    //             
    // 受信データ　：　-180~180(旋回指令)　なら
    // If received data is between -180 and 180...
    //             
    // 受信データ　：　999(受信無し)
    // ギア状態　　：　0(前後進無し)　なら
    // If received data is 999 (no signal) and gear is 0 (no forward/reverse movement)...
    //             
    if (RadioData == 0 && gear == 0) {
        // モーターをブレーキする
        // Brakes the motors.
        //             
        STOP()
    } else if (RadioData == 555) {
        // ギア状態　　：　0(前後進無し)　なら
        // If gear is 0 (no forward/reverse movement)...
        //                 
        // ギア状態　　：　1(低速前進中) なら
        // If gear is 1 (moving slowly forward)...
        //                 
        // ギア状態　　：　-1または-2(後進中) なら
        // If gear is -1 or -2 (moving in reverse)...
        //                 
        if (gear == 0) {
            // ブレーキを解除する
            // Releases brakes.
            //                 
            MOVE()
            // 低速で前進する
            // Moves robot slowly forward.
            //                     
            speed = 895
            // ギアを1に設定する
            // Changes gear to 1.
            //                         
            gear = 1
        } else if (gear == 1) {
            // ブレーキを解除する
            // Releases brakes.
            //                 
            MOVE()
            // 最大速度で前進する
            // Moves robot forward at maximum speed.
            //                     
            speed = 1023
            // ギアを2に設定する
            // Changes gear to 2.
            //                         
            gear = 2
        } else if (gear < 0) {
            // モーターをブレーキする
            // Brakes the motors.
            //                 
            STOP()
            // ギアを0にリセットする
            // Resets gear to 0.
            //                     
            gear = 0
        }
    } else if (RadioData == 666) {
        // ギア状態　　：　0(前後進無し)　なら
        // If gear is 0 (no forward/reverse movement)...
        //                 
        // ギア状態　　：　-1(低速後進中)　なら
        // If gear is -1 (moving slowly in reverse)...
        //                 
        // ギア状態　　：　1または2(前進中)　なら
        // If gear is 1 or 2 (moving forward)...
        //                 
        if (gear == 0) {
            // ブレーキを解除する
            // Releases brakes.
            //                 
            MOVE()
            // 低速で後進する
            // Moves robot slowly in reverse.
            //                     
            speed = 127
            // ギアを-1に設定する
            // Changes gear to -1.
            //                         
            gear = -1
        } else if (gear == -1) {
            // ブレーキを解除する
            // Releases brakes.
            //                 
            MOVE()
            // 最大速度で後進する
            // Moves robot in reverse at maximum speed.
            //                     
            speed = 0
            // ギアを-2に設定する
            // Changes gear to -2.
            //                         
            gear = -2
        } else if (gear > 0) {
            // モーターをブレーキする
            // Brakes the motors.
            //                 
            STOP()
            // ギアを0にリセットする
            // Resets gear to 0.
            //                     
            gear = 0
        }
    } else if (-180 <= RadioData && RadioData <= 180) {
        // ブレーキを解除する
        // Releases brakes.
        //             
        MOVE()
        // ギア状態　　：　0(前後進無し)
        // 　　　　　　　　1または2(前進中)　なら
        // If gear is 0 (no forward/reverse movement), or 1/2 (moving forward)...
        //                     
        if (gear >= 0) {
            // そのまま旋回する
            // Turns the robot.
            //                     
            turn = RadioData * 10
        } else {
            // 反対方向に旋回する
            // Turns the robot in the other direction.
            //                     
            turn = RadioData * -10
        }
    } else if (RadioData == 999 && gear == 0) {
        // 1秒以上受信できていないなら
        // If no signal is received for 1 second...
        //                 
        if (1000 < input.runningTime() - RunTime) {
            // モーターをブレーキする
            // Brakes the motors.
            //                 
            STOP()
        }
    }
    // 待機時間を指定する
    // (単位はミリ秒)
    // Defines waiting time (unit = milliseconds)
    //             
    wait = 0
    // 受信データを999にリセットする
    // Resets received data to 999.
    //                 
    RadioData = 999
}
// 無線でコントローラーから送られたデータを保存する
// Saves data received from remote controller.
//     
radio.onReceivedNumberDeprecated(function (receivedNumber) {
    // 受信データを保存する
    // Saves data.
    //         
    RadioData = receivedNumber
    // 受信した時刻を保存する
    // Records time of reception.
    //             
    RunTime = input.runningTime()
})
input.onButtonPressed(Button.A, function () {
    // 動作モードが選択されていないなら
    // If mode is unselected...
    //             
    if (mode == "NoSelect") {
        // 動作モードをAに設定する
        // Sets Mode to A.
        //             
        mode = "A"
        music.playTone(262, music.beat(BeatFraction.Quarter))
        music.playTone(330, music.beat(BeatFraction.Half))
    }
})
// モーターをブレーキする
// Applies brake to motors.
//     
function STOP () {
    // 右モーターをブレーキする
    // Applies brake to right motor.
    //         
    pins.digitalWritePin(DigitalPin.P15, 1)
    // 左モーターをブレーキする
    // Applies brake to left motor.
    //             
    pins.digitalWritePin(DigitalPin.P16, 1)
    // 前後進しない
    // No forward or reverse movement.
    //                 
    speed = 511
    // 旋回しない
    // No turning.
    //                     
    turn = 0
}
// 音を鳴らす
// Emits a sound.
//     
function SOUND () {
    // 音を選択する
    // Selects sound.
    //         
    if (sound == 1) {
        music.playTone(784, music.beat(BeatFraction.Half))
    }
    // 音の指定をリセットする
    // Resets defined sound.
    //             
    sound = 0
}
// ブレーキを解除する
// Releases brake.
//     
function MOVE () {
    // 右モーターのブレーキを解除する
    // Unbrakes right motor.
    //         
    pins.digitalWritePin(DigitalPin.P15, 0)
    // 左モーターのブレーキを解除する
    // Unbrakes left motor.
    //             
    pins.digitalWritePin(DigitalPin.P16, 0)
}
input.onButtonPressed(Button.B, function () {
    // 動作モードが選択されていないなら
    // If mode is unselected...
    //             
    if (mode == "NoSelect") {
        // 動作モードをBに設定する
        // Sets Mode to B.
        //             
        mode = "B"
        music.playTone(440, music.beat(BeatFraction.Quarter))
        music.playTone(349, music.beat(BeatFraction.Half))
    }
})
// 超音波センサーを使う
// (超音波の反射時間から障害物までの距離を計算する)
// Uses Ultrasonic Sensor
// (calculates distance to obstacle from time taken for signal to reflect.)
//     
function ULTRASONIC1 () {
    // 超音波センサーを選択する
    // Selects Ultrasonic Sensor.
    //         
    address = 44
    // センサー回路と通信する
    // Communicates with sensor circuit.
    //             
    I2C()
    // 超音波センサーのデータを補正する
    // Revises Ultrasonic Sensor data
    //                 
    // 超音波センサーのデータが0~1000mmなら
    // If Ultrasonic Sensor data is between 0 and 1,000mm
    //                     
    if (0 <= length && length <= 1000) {
        // 超音波センサーのデータを四捨五入する
        // Rounds up/down Ultrasonic Sensor data.
        //                     
        RangeL = Math.round(length)
    } else {
        // 超音波センサーのデータを0にリセットする
        // Resets Ultrasonic Sensor data to 0.
        //                     
        RangeL = 0
    }
}
// センサー回路と通信する
// Communicates with sensor circuit.
//     
function I2C () {
    // データをリセットする
    // Resets data.
    //         
    DataL = 0
    // データをリセットする
    // Resets data.
    //             
    DataH = 0
    // 通信開始時刻を保存する
    // Records data start time.
    //                 
    SonicTime = input.runningTime()
    // データを取得する　または　50ミリ秒以上経過するまで
    // 通信を繰り返す
    // Keeps communication open while data is received or until 50 milliseconds have passed.
    //                     
    while (DataH == 0 && DataL == 0 && input.runningTime() - SonicTime < 50) {
        // 超音波センサーに使用開始の指示を出す
        // Sends start command to Ultrasonic Sensor.
        //                         
        pins.i2cWriteNumber(
        address,
        51,
        NumberFormat.UInt8BE,
        false
        )
        // 応答データを取得する
        // Receives data response.
        //                             
        buff = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false)
        // 応答データが1なら
        // If data response is 1...
        //                                     
        if (buff == 1) {
            basic.pause(6)
            // 確認用データを送るように指示を出す
            // Requests confirmation data.
            //                                         
            pins.i2cWriteNumber(
            address,
            16,
            NumberFormat.UInt8BE,
            false
            )
            // 確認用データを取得する
            // Receives confirmation data.
            //                                             
            buff = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false)
            basic.pause(1)
            // 反射時間(上位桁)を送るように指示を出す
            // Requests time taken (top section of the value) for signal to reflect.
            //                                                     
            pins.i2cWriteNumber(
            address,
            15,
            NumberFormat.UInt8BE,
            false
            )
            // 反射時間(上位桁)を取得する
            // Receives data on time taken for signal to reflect.
            //                                                         
            DataH = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false)
            basic.pause(1)
            // 反射時間(下位桁)を送るように指示を出す
            // Requests time taken (bottom section of the value) for signal to reflect.
            //                                                                 
            pins.i2cWriteNumber(
            address,
            14,
            NumberFormat.UInt8BE,
            false
            )
            // 反射時間(下位桁)を取得する
            // Receives data on time taken for signal to reflect.
            //                                                                     
            DataL = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false)
            // 取得したデータが間違っているなら
            // If received data is false...
            //                                                                             
            if (buff != Math.constrain(DataH + DataL, 0, 255)) {
                // データをリセットする
                // Resets data.
                //                                                                             
                DataH = 0
                // データをリセットする
                // Resets data.
                //                                                                                 
                DataL = 0
            }
        }
    }
    // 反射時間から反射距離を計算する
    // Calculates distance to obstacle from time taken for signal to reflect.
    //                         
    length = (DataH * 256 + DataL - 160) / 2 * 0.315
}
// プログラムが動き出したときに一度だけ行う
// Runs once when the program starts.
//     
let buff = 0
let SonicTime = 0
let DataH = 0
let DataL = 0
let RangeL = 0
let length = 0
let address = 0
let sound = 0
let wait = 0
let RunTime = 0
let turn = 0
let speed = 0
let RadioData = 0
let gear = 0
let mode = ""
// モーターをブレーキする
// Brakes the motors.
//         
STOP()
// 音の初期設定
// Initial sound setting
//             
pins.analogSetPitchPin(AnalogPin.P8)
music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
basic.showIcon(IconNames.SmallSquare)
basic.showIcon(IconNames.Square)
basic.pause(100)
basic.clearScreen()
// 動作モードを未選択状態に設定する
// Leaves mode undefined.
//                                     
mode = "NoSelect"
// P01を表示する(プログラムNo.1)
// Shows P01 (Program no.1)
//                                         
basic.showString("P01")
// モーターを停止する
// Stops the motors.
//                                             
pins.analogWritePin(AnalogPin.P13, 511)
// モーターを停止する
// Stops the motors.
//                                                 
pins.analogWritePin(AnalogPin.P14, 511)
// モーターに送る信号の初期設定
// Resets signal sent to motor.
//                                                     
pins.analogSetPeriod(AnalogPin.P13, 1000)
// モーターに送る信号の初期設定
// Resets signal sent to motor.
//                                                         
pins.analogSetPeriod(AnalogPin.P14, 1000)
// グループ37のBBC micro:bit同士で通信するように設定する
// Allows communication between BBC micro:bits assigned to group 37.
//                                                             
radio.setGroup(37)
// ギアを0に設定する
// Sets gear to 0.
//                                                                 
gear = 0
// 動作モードを設定するまで　または　
// 10秒経過するまで　待機する
// Waits until Mode is set or 10 seconds have passed.
//                                                                     
while (mode == "NoSelect") {
    basic.showArrow(ArrowNames.West)
    basic.showArrow(ArrowNames.East)
    // 10秒経過したなら
    // Performed if 10 seconds pass
    //                                                                                     
    if (10000 < input.runningTime()) {
        // 動作モードをAに設定する
        // Sets Mode to A.
        //                                                                                     
        mode = "A"
        music.playTone(262, music.beat(BeatFraction.Quarter))
        music.playTone(330, music.beat(BeatFraction.Half))
    }
}
// 動作モードを表示する
// Displays Mode.
//                                                                         
basic.showString(mode)
basic.pause(500)
basic.clearScreen()
// 繰り返し行う
// Block repeats continuously.
//     
basic.forever(function () {
    // 超音波センサーを使う
    // Runs Ultrasonic Sensor.
    //         
    ULTRASONIC1()
    // 障害物までの距離が0~150mmなら
    // If obstacle is identified between 0 and 150mm away...
    //                 
    // 動作モードがBなら
    // If the robot is in Mode B...
    //                 
    if (0 < RangeL && RangeL < 150) {
        // ブレーキを解除する
        // Releases brake.
        //                 
        MOVE()
        // 前後進しない
        // No forward or reverse movement.
        //                     
        speed = 511
        // 旋回方向をランダムに選択する
        // Chooses turning direction at random.
        //                         
        if (Math.randomBoolean()) {
            // 右方向に旋回する
            // Turn to the right.
            //                             
            turn = 511
        } else {
            // 左方向に旋回する
            // Turn to the left.
            //                             
            turn = -511
        }
        // 待機時間を指定する
        // (単位はミリ秒)
        // Defines waiting time (unit = milliseconds)
        //                             
        wait = 1500
        // ギアを0に設定する
        // Sets gear to 0.
        //                                 
        gear = 0
        // 鳴らす音の番号を指定する
        // Defines number of sound to be emitted.
        //                                     
        sound = 1
    } else if (mode == "B") {
        // 無線でコントローラーから送られたデータをもとに動作を決定する
        // Waits for movement commands from remote controller.
        //                 
        RC()
    } else {
        // ブレーキを解除する
        // Releases brakes.
        //                 
        MOVE()
        // 最大速度で前進する
        // Moves forward at maximum speed.
        //                     
        speed = 1023
        // 旋回しない
        // No turning.
        //                         
        turn = 0
        // 待機時間を指定する
        // (単位はミリ秒)
        // Defines waiting time (unit = milliseconds)
        //                             
        wait = 0
    }
    // 右モーターを回す
    // Runs right motor.
    //                 
    pins.analogWritePin(AnalogPin.P13, Math.constrain(speed - turn, 0, 1023))
    // 左モーターを回す
    // Runs left motor.
    //                     
    pins.analogWritePin(AnalogPin.P14, Math.constrain(speed + turn, 0, 1023))
    // 音を鳴らす
    // Emits sound.
    //                         
    SOUND()
    // 指定された時間だけ待機する
    // Pauses for the specified time.
    //                             
    basic.pause(wait)
})
