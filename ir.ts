enum  IrPins{
    P0=  0,
    P1=  1,
    P2=  2,
    P3=  3,
    P4=  4,
    P5=  5,
    P6=  6,
    P7=  7,
    P8=  8,
    P9=  9,
    P10= 10,
    P11= 11,
    P12= 12,
    P13= 13,
    P14= 14,
    P15= 15,
    P16= 16,
    P19= 19,
    P20= 20
};

enum EM_RemoteButton {
    //% block=A
    EM_A = 0x45,
    //% block=B
    EM_B = 0x46,
    //% block=C
    EM_C = 0x47,
    //% block=D
    EM_D = 0x44,
    //% block=+
    EM_Add = 0x43,
    //% block=-
    EM_Sub = 0x0d,
    //% block=UP
    EM_UP = 0x40,
    //% block=LEFT
    EM_Left = 0x07,
    //% block=OK
    EM_Ok = 0x15,
    //% block=RIGHT
    EM_Right = 0x09,
    //% block=DOWN
    EM_Down = 0x19,
    //% block=0
    EM_NUM0 = 0x16,
    //% block=1
    EM_NUM1 = 0x0c,
    //% block=2
    EM_NUM2 = 0x18,
    //% block=3
    EM_NUM3 = 0x5e,
    //% block=4
    EM_NUM4 = 0x08,
    //% block=5
    EM_NUM5 = 0x1c,
    //% block=6
    EM_NUM6 = 0x5a,
    //% block=7
    EM_NUM7 = 0x42,
    //% block=8
    EM_NUM8 = 0x52,
    //% block=9
    EM_NUM9 = 0x4a
};

//enum RemoteButton {
    //% block=*
    A = 0x16,
    //% block=#
    B = 0x0D,
    //% block=UP
    UP = 0x18,
    //% block=LEFT
    Left = 0x08,
    //% block=OK
    Ok = 0x1C,
    //% block=RIGHT
    Right = 0x5A,
    //% block=DOWN
    Down = 0x52,
    //% block=0
    NUM0 = 0x19,
    //% block=1
    NUM1 = 0x45,
    //% block=2
    NUM2 = 0x46,
    //% block=3
    NUM3 = 0x47,
    //% block=4
    NUM4 = 0x44,
    //% block=5
    NUM5 = 0x40,
    //% block=6
    NUM6 = 0x43,
    //% block=7
    NUM7 = 0x07,
    //% block=8
    NUM8 = 0x15,
    //% block=9
    NUM9 = 0x09
};


/**
 * Custom blocks
 */
//% weight=100 color="#EE6A50" icon="\uf013" block="irRemote"
namespace EM_IR {
    let state: number;
    let data1: number;
    let irstate: number;
    let irData: number = -1;
    let irPin: number;

    /**
     * initialises local variables
     *  @param pin describe parameter here, eg: IrPins.P5 
     */
    //% weight=70
    //% blockId=IrRemote_init 
    //% block="ir remote init port | %pin" 
    export function IrRemote_init(pin: IrPins): void {
        irPin = pin;
        return;
    }

    //% shim=EMIR::irCode
    function em_irCode(irPin1: number): number {
        return 0;
    }

    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% weight=60
    //% block="read IR key value"
    export function EM_IR_read(): number {
        pins.setPull(getPin(), PinPullMode.PullUp)
        return valuotokeyConversion();
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% weight=50
    //% blockId=onPressEvent
    //% block="on IR received"
    //% draggableParameters
    export function OnPressEvent(cb: (message: number) => void) {
        pins.setPull(getPin(), PinPullMode.PullUp)
        state = 1;
        control.onEvent(11, 22, function () {
            cb(data1)

        })
    }

    basic.forever(() => {
        if (state == 1) {
            irstate = em_irCode(irPin);
            if (irstate != 0) {
                data1 = irstate & 0xff;
                control.raiseEvent(11, 22)
            }
        }

        basic.pause(50);
    })

    function valuotokeyConversion(): number {
        //serial.writeValue("x", irCode() )
        let data = em_irCode(irPin);
        if (data == 0) {
        } else {
            irData = data & 0xff;
        }
        return irData;
    }

    function getPin(): number {
        switch (irPin) {
            case 0: return DigitalPin.P0;
            case 1: return DigitalPin.P1;
            case 2: return DigitalPin.P2;
            case 3: return DigitalPin.P3;
            case 4: return DigitalPin.P4;
            case 5: return DigitalPin.P5;
            case 6: return DigitalPin.P6;
            case 7: return DigitalPin.P7;
            case 8: return DigitalPin.P8;
            case 9: return DigitalPin.P9;
            case 10: return DigitalPin.P10;
            case 11: return DigitalPin.P11;
            case 12: return DigitalPin.P12;
            case 13: return DigitalPin.P13;
            case 14: return DigitalPin.P14;
            case 15: return DigitalPin.P15;
            case 16: return DigitalPin.P16;
            case 19: return DigitalPin.P19;
            case 20: return DigitalPin.P20;
            default: return DigitalPin.P0;
        }
    }
}

// MakerBit blocks supporting a Keyestudio Infrared Wireless Module Kit
// (receiver module+remote controller)

const enum IrButton {
	//% block="any"
	Any = -1,
	Power = 0x0,
	Up = 128,
	Left = 32,
	Right = 96,
	Down = 144,
	Light = 64,
	BEEP = 160,
	Plus = 48,
	Minus = 112, 
	TLeft = 16,
	TRight = 80,
	NUM0 = 176,
	NUM1 = 8,
	NUM2 = 136,
	NUM3 = 72,
	NUM4 = 40,
	NUM5 = 168,
	NUM6 = 104,
	NUM7 = 24,
	NUM8 = 152,
	NUM9 = 88
}

const enum IrButtonAction {
  //% block="pressed"
  Pressed = 0,
  //% block="released"
  Released = 1,
}

const enum IrProtocol {
  //% block="Keyestudio"
  Keyestudio = 0,
  //% block="NEC"
  NEC = 1,
}

//% weight=10 color=#008B00 icon="\uf1eb" block="IR_V2"
namespace makerbit {
  let irState: IrState;

  const IR_REPEAT = 256;
  const IR_INCOMPLETE = 257;
  const IR_DATAGRAM = 258;

  const REPEAT_TIMEOUT_MS = 120;

  interface IrState {
    protocol: IrProtocol;
    hasNewDatagram: boolean;
    bitsReceived: uint8;
    addressSectionBits: uint16;
    commandSectionBits: uint16;
    hiword: uint16;
    loword: uint16;
    activeCommand: number;
    repeatTimeout: number;
    onIrButtonPressed: IrButtonHandler[];
    onIrButtonReleased: IrButtonHandler[];
    onIrDatagram: () => void;
  }
  class IrButtonHandler {
    irButton: IrButton;
    onEvent: () => void;

    constructor(
      irButton: IrButton,
      onEvent: () => void
    ) {
      this.irButton = irButton;
      this.onEvent = onEvent;
    }
  }


  function appendBitToDatagram(bit: number): number {
    irState.bitsReceived += 1;

    if (irState.bitsReceived <= 8) {
      irState.hiword = (irState.hiword << 1) + bit;
      if (irState.protocol === IrProtocol.Keyestudio && bit === 1) {
        // recover from missing message bits at the beginning
        // Keyestudio address is 0 and thus missing bits can be detected
        // by checking for the first inverse address bit (which is a 1)
        irState.bitsReceived = 9;
        irState.hiword = 1;
      }
    } else if (irState.bitsReceived <= 16) {
      irState.hiword = (irState.hiword << 1) + bit;
    } else if (irState.bitsReceived <= 32) {
      irState.loword = (irState.loword << 1) + bit;
    }

    if (irState.bitsReceived === 32) {
      irState.addressSectionBits = irState.hiword & 0xffff;
      irState.commandSectionBits = irState.loword & 0xffff;
      return IR_DATAGRAM;
    } else {
      return IR_INCOMPLETE;
    }
  }

  function decode(markAndSpace: number): number {
    if (markAndSpace < 1600) {
      // low bit
      return appendBitToDatagram(0);
    } else if (markAndSpace < 2700) {
      // high bit
      return appendBitToDatagram(1);
    }

    irState.bitsReceived = 0;

    if (markAndSpace < 12500) {
      // Repeat detected
      return IR_REPEAT;
    } else if (markAndSpace < 14500) {
      // Start detected
      return IR_INCOMPLETE;
    } else {
      return IR_INCOMPLETE;
    }
  }

  function enableIrMarkSpaceDetection(pin: DigitalPin) {
    pins.setPull(pin, PinPullMode.PullNone);

    let mark = 0;
    let space = 0;

    pins.onPulsed(pin, PulseValue.Low, () => {
      // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
      mark = pins.pulseDuration();
    });

    pins.onPulsed(pin, PulseValue.High, () => {
      // LOW
      space = pins.pulseDuration();
      const status = decode(mark + space);

      if (status !== IR_INCOMPLETE) {
        handleIrEvent(status);
      }
    });
  }

  function handleIrEvent(irEvent: number) {

    // Refresh repeat timer
    if (irEvent === IR_DATAGRAM || irEvent === IR_REPEAT) {
      irState.repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
    }

    if (irEvent === IR_DATAGRAM) {
      irState.hasNewDatagram = true;

      if (irState.onIrDatagram) {
        background.schedule(irState.onIrDatagram, background.Thread.UserCallback, background.Mode.Once, 0);
      }

      const newCommand = irState.commandSectionBits >> 8;

      // Process a new command
      if (newCommand !== irState.activeCommand) {

        if (irState.activeCommand >= 0) {
          const releasedHandler = irState.onIrButtonReleased.find(h => h.irButton === irState.activeCommand || IrButton.Any === h.irButton);
          if (releasedHandler) {
            background.schedule(releasedHandler.onEvent, background.Thread.UserCallback, background.Mode.Once, 0);
          }
        }

        const pressedHandler = irState.onIrButtonPressed.find(h => h.irButton === newCommand || IrButton.Any === h.irButton);
        if (pressedHandler) {
          background.schedule(pressedHandler.onEvent, background.Thread.UserCallback, background.Mode.Once, 0);
        }

        irState.activeCommand = newCommand;
      }
    }
  }

  function initIrState() {
    if (irState) {
      return;
    }

    irState = {
      protocol: undefined,
      bitsReceived: 0,
      hasNewDatagram: false,
      addressSectionBits: 0,
      commandSectionBits: 0,
      hiword: 0, // TODO replace with uint32
      loword: 0,
      activeCommand: -1,
      repeatTimeout: 0,
      onIrButtonPressed: [],
      onIrButtonReleased: [],
      onIrDatagram: undefined,
    };
  }

  //% blockId="makerbit_infrared_connect_receiver"
  //% block="connect IR receiver at pin %pin"
  //% pin.fieldEditor="gridpicker"
  //% pin.fieldOptions.tooltips="false"
  //% weight=90
  export function connectIrReceiver(
    pin: DigitalPin
  ): void {
    initIrState();

    irState.protocol = IrProtocol.NEC;

    enableIrMarkSpaceDetection(pin);

    background.schedule(notifyIrEvents, background.Thread.Priority, background.Mode.Repeat, REPEAT_TIMEOUT_MS);
  }

  function notifyIrEvents() {
    if (irState.activeCommand === -1) {
      // skip to save CPU cylces
    } else {
      const now = input.runningTime();
      if (now > irState.repeatTimeout) {
        // repeat timed out

        const handler = irState.onIrButtonReleased.find(h => h.irButton === irState.activeCommand || IrButton.Any === h.irButton);
        if (handler) {
          background.schedule(handler.onEvent, background.Thread.UserCallback, background.Mode.Once, 0);
        }

        irState.bitsReceived = 0;
        irState.activeCommand = -1;
      }
    }
  }

  //% blockId=makerbit_infrared_on_ir_button
  //% block="on IR button | %button | %action"
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.tooltips="false"
  //% weight=50
  export function onIrButton(
    button: IrButton,
    action: IrButtonAction,
    handler: () => void
  ) {
    initIrState();
    if (action === IrButtonAction.Pressed) {
      irState.onIrButtonPressed.push(new IrButtonHandler(button, handler));
    }
    else {
      irState.onIrButtonReleased.push(new IrButtonHandler(button, handler));
    }
  }

  /**
   * Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.
  //% blockId=makerbit_infrared_ir_button_pressed
  //% block="IR button"
  //% weight=70
  export function irButton(): number {
    basic.pause(0); // Yield to support background processing when called in tight loops
    if (!irState) {
      return IrButton.Any;
    }
    return irState.commandSectionBits >> 8;
  }
   */

  /**
   * Do something when an IR datagram is received.
   * @param handler body code to run when the event is raised
  //% blockId=makerbit_infrared_on_ir_datagram
  //% block="on IR datagram received"
  //% weight=40
  export function onIrDatagram(handler: () => void) {
    initIrState();
    irState.onIrDatagram = handler;
  }
   */

  /**
   * Returns the IR datagram as 32-bit hexadecimal string.
   * The last received datagram is returned or "0x00000000" if no data has been received yet.
  //% blockId=makerbit_infrared_ir_datagram
  //% block="IR datagram"
  //% weight=30
  export function irDatagram(): string {
    basic.pause(0); // Yield to support background processing when called in tight loops
    initIrState();
    return (
      "0x" +
      ir_rec_to16BitHex(irState.addressSectionBits) +
      ir_rec_to16BitHex(irState.commandSectionBits)
    );
  }
   */

  /**
   * Returns true if any IR data was received since the last call of this function. False otherwise.
  //% blockId=makerbit_infrared_was_any_ir_datagram_received
  //% block="IR data was received"
  //% weight=80
  export function wasIrDataReceived(): boolean {
    basic.pause(0); // Yield to support background processing when called in tight loops
    initIrState();
    if (irState.hasNewDatagram) {
      irState.hasNewDatagram = false;
      return true;
    } else {
      return false;
    }
  }
   */

  /**
   * Returns the command code of a specific IR button.
   * @param button the button
  //% blockId=makerbit_infrared_button_code
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.columns=3
  //% button.fieldOptions.tooltips="false"
  //% block="IR button code %button"
  //% weight=60
  export function irButtonCode(button: IrButton): number {
    basic.pause(0); // Yield to support background processing when called in tight loops
    return button as number;
  }

  function ir_rec_to16BitHex(value: number): string {
    let hex = "";
    for (let pos = 0; pos < 4; pos++) {
      let remainder = value % 16;
      if (remainder < 10) {
        hex = remainder.toString() + hex;
      } else {
        hex = String.fromCharCode(55 + remainder) + hex;
      }
      value = Math.idiv(value, 16);
    }
    return hex;
  }
   */
}

namespace makerbit {
    export namespace background {

        export enum Thread {
            Priority = 0,
            UserCallback = 1,
        }

        export enum Mode {
            Repeat,
            Once,
        }

        class Executor {
            _newJobs: Job[] = undefined;
            _jobsToRemove: number[] = undefined;
            _pause: number = 100;
            _type: Thread;

            constructor(type: Thread) {
                this._type = type;
                this._newJobs = [];
                this._jobsToRemove = [];
                control.runInParallel(() => this.loop());
            }

            push(task: () => void, delay: number, mode: Mode): number {
                if (delay > 0 && delay < this._pause && mode === Mode.Repeat) {
                    this._pause = Math.floor(delay);
                }
                const job = new Job(task, delay, mode);
                this._newJobs.push(job);
                return job.id;
            }

            cancel(jobId: number) {
                this._jobsToRemove.push(jobId);
            }

            loop(): void {
                const _jobs: Job[] = [];

                let previous = control.millis();

                while (true) {
                    const now = control.millis();
                    const delta = now - previous;
                    previous = now;

                    // Add new jobs
                    this._newJobs.forEach(function (job: Job, index: number) {
                        _jobs.push(job);
                    });
                    this._newJobs = [];

                    // Cancel jobs
                    this._jobsToRemove.forEach(function (jobId: number, index: number) {
                        for (let i = _jobs.length - 1; i >= 0; i--) {
                            const job = _jobs[i];
                            if (job.id == jobId) {
                                _jobs.removeAt(i);
                                break;
                            }
                        }
                    });
                    this._jobsToRemove = []


                    // Execute all jobs
                    if (this._type === Thread.Priority) {
                        // newest first
                        for (let i = _jobs.length - 1; i >= 0; i--) {
                            if (_jobs[i].run(delta)) {
                                this._jobsToRemove.push(_jobs[i].id)
                            }
                        }
                    } else {
                        // Execute in order of schedule
                        for (let i = 0; i < _jobs.length; i++) {
                            if (_jobs[i].run(delta)) {
                                this._jobsToRemove.push(_jobs[i].id)
                            }
                        }
                    }

                    basic.pause(this._pause);
                }
            }
        }

        class Job {
            id: number;
            func: () => void;
            delay: number;
            remaining: number;
            mode: Mode;

            constructor(func: () => void, delay: number, mode: Mode) {
                this.id = randint(0, 2147483647)
                this.func = func;
                this.delay = delay;
                this.remaining = delay;
                this.mode = mode;
            }

            run(delta: number): boolean {
                if (delta <= 0) {
                    return false;
                }
                
                this.remaining -= delta;
                if (this.remaining > 0) {
                    return false;
                }

                switch (this.mode) {
                    case Mode.Once:
                        this.func();
                        basic.pause(0);
                        return true;
                    case Mode.Repeat:
                        this.func();
                        this.remaining = this.delay;
                        basic.pause(0);
                        return false;
                }
            }
        }

        const queues: Executor[] = [];

        export function schedule(
            func: () => void,
            type: Thread,
            mode: Mode,
            delay: number,
        ): number {
            if (!func || delay < 0) return 0;

            if (!queues[type]) {
                queues[type] = new Executor(type);
            }

            return queues[type].push(func, delay, mode);
        }

        export function remove(type: Thread, jobId: number): void {
            if (queues[type]) {
                queues[type].cancel(jobId);
            }
        }
    }
}
