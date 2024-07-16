#include "pxt.h"
#include "ReceiverIR.h"

#define LOCK()
#define UNLOCK()

#define InRange(x,y)   ((((y) * 0.7) < (x)) && ((x) < ((y) * 1.3)))

/**
 * Constructor.
 *
 * @param rxpin Pin for receive IR signal.
 */
namespace EMIR { 
int ir_code = 0x00;
int ir_addr = 0x00;
int data;

int getPinsValue(int name) {
    // int id = (int)name;
    switch (name) {
        case 0: return uBit.io.P0.getDigitalValue();
        case 1: return uBit.io.P1.getDigitalValue();
        case 2: return uBit.io.P2.getDigitalValue();
        case 3: return uBit.io.P3.getDigitalValue();
        case 4: return uBit.io.P4.getDigitalValue();
        case 5: return uBit.io.P5.getDigitalValue();
        case 6: return uBit.io.P6.getDigitalValue();
        case 7: return uBit.io.P7.getDigitalValue();
        case 8: return uBit.io.P8.getDigitalValue();
        case 9: return uBit.io.P9.getDigitalValue();
        case 10: return uBit.io.P10.getDigitalValue();
        case 11: return uBit.io.P11.getDigitalValue();
        case 12: return uBit.io.P12.getDigitalValue();
        case 13: return uBit.io.P13.getDigitalValue();
        case 14: return uBit.io.P14.getDigitalValue();
        case 15: return uBit.io.P15.getDigitalValue();
        case 16: return uBit.io.P16.getDigitalValue();
        case 19: return uBit.io.P19.getDigitalValue();
        case 20: return uBit.io.P20.getDigitalValue();
        // default: return NULL;
    }
}



int logic_value(int irPin){//判断逻辑值"0"和"1"子函数
    uint32_t lasttime = system_timer_current_time_us();
    uint32_t nowtime;
    while(!getPinsValue(irPin));//低等待
    nowtime = system_timer_current_time_us();
    if((nowtime - lasttime) > 400 && (nowtime - lasttime) < 700){//低电平560us
        while(getPinsValue(irPin));//是高就等待
        lasttime = system_timer_current_time_us();
        if((lasttime - nowtime)>400 && (lasttime - nowtime) < 700){//接着高电平560us
            return 0;
        }else if((lasttime - nowtime)>1500 && (lasttime - nowtime) < 1800){//接着高电平1.7ms
            return 1;
       }
    }
    return -1;
}

void pulse_deal(int irPin){
    int i;
    ir_addr=0x00;//清零
    for(i=0; i<16;i++ )
    {
      if(logic_value(irPin) == 1)
      {
        ir_addr |=(1<<i);
      }
    }
    //解析遥控器编码中的command指令
    ir_code=0x00;//清零
    for(i=0; i<16;i++ )
    {
      if(logic_value(irPin) == 1)
      {
        ir_code |=(1<<i);
      }
    }

}

void remote_decode(int irPin){
    data = 0x00;
    uint32_t lasttime = system_timer_current_time_us();
    uint32_t nowtime;
    while(getPinsValue(irPin)){//高电平等待
        nowtime = system_timer_current_time_us();
        if((nowtime - lasttime) > 100000){//超过100 ms,表明此时没有按键按下
            ir_code = 0xff00;
            return;
        }
    }
    //如果高电平持续时间不超过100ms
    lasttime = system_timer_current_time_us();
    while(!getPinsValue(irPin));//低等待
    nowtime = system_timer_current_time_us();
    if((nowtime - lasttime) < 10000 && (nowtime - lasttime) > 8000){//9ms
        while(getPinsValue(irPin));//高等待
        lasttime = system_timer_current_time_us();
        if((lasttime - nowtime) > 4000 && (lasttime - nowtime) < 5000){//4.5ms,接收到了红外协议头且是新发送的数据。开始解析逻辑0和1
            pulse_deal(irPin);
            //uBit.serial.printf("addr=0x%X,code = 0x%X\r\n",ir_addr,ir_code);
            data = ir_code;
            return;//ir_code;
        }else if((lasttime - nowtime) > 2000 && (lasttime - nowtime) < 2500){//2.25ms,表示发的跟上一个包一致
            while(!getPinsValue(irPin));//低等待
            nowtime = system_timer_current_time_us();
            if((nowtime - lasttime) > 500 && (nowtime - lasttime) < 700){//560us
                //uBit.serial.printf("addr=0x%X,code = 0x%X\r\n",ir_addr,ir_code);
                data = ir_code;
                return;//ir_code;
            }
        }
    }
}

 //% 
    int irCode(int irPin){
    remote_decode(irPin);
    return data;
    }
}

int ReceiverIR::getData(RemoteIR::Format *format, uint8_t *buf, int bitlength) {
    LOCK();
    if (bitlength < data.bitcount) {
        UNLOCK();
        return -1;
    }

    const int nbits = data.bitcount;
    const int nbytes = data.bitcount / 8 + (((data.bitcount % 8) != 0) ? 1 : 0);
    *format = data.format;
    for (int i = 0; i < nbytes; i++) {
        buf[i] = data.buffer[i];
    }

    init_state();

    UNLOCK();
    return nbits;
}

void ReceiverIR::init_state(void) {
    work.c1 = -1;
    work.c2 = -1;
    work.c3 = -1;
    work.d1 = -1;
    work.d2 = -1;
    work.state = Idle;
    data.format = RemoteIR::UNKNOWN;
    data.bitcount = 0;
    timer.stop();
    timer.reset();
    for (int i = 0; i < sizeof(data.buffer); i++) {
        data.buffer[i] = 0;
    }
}

void ReceiverIR::isr_wdt(void) {
    LOCK();
    static int cnt = 0;
    if ((Idle != work.state) || ((0 <= work.c1) || (0 <= work.c2) || (0 <= work.c3) || (0 <= work.d1) || (0 <= work.d2))) {
        cnt++;
        if (cnt > 50) {
#if 0
            printf("# WDT [c1=%d, c2=%d, c3=%d, d1=%d, d2=%d, state=%d, format=%d, bitcount=%d]\n",
                   work.c1,
                   work.c2,
                   work.c3,
                   work.d1,
                   work.d2,
                   work.state,
                   data.format,
                   data.bitcount);
#endif
            init_state();
            cnt = 0;
        }
    } else {
        cnt = 0;
    }
    UNLOCK();
}

void ReceiverIR::isr_fall(void) {
    LOCK();
    switch (work.state) {
        case Idle:
            if (work.c1 < 0) {
                timer.start();
                work.c1 = timer.read_us();
            } else {
                work.c3 = timer.read_us();
                int a = work.c2 - work.c1;
                int b = work.c3 - work.c2;
                if (InRange(a, RemoteIR::TUS_NEC * 16) && InRange(b, RemoteIR::TUS_NEC * 8)) {
                    /*
                     * NEC.
                     */
                    data.format = RemoteIR::NEC;
                    work.state = Receiving;
                    data.bitcount = 0;
                } else if (InRange(a, RemoteIR::TUS_NEC * 16) && InRange(b, RemoteIR::TUS_NEC * 4)) {
                    /*
                     * NEC Repeat.
                     */
                    data.format = RemoteIR::NEC_REPEAT;
                    work.state = Received;
                    data.bitcount = 0;
                    work.c1 = -1;
                    work.c2 = -1;
                    work.c3 = -1;
                    work.d1 = -1;
                    work.d2 = -1;
                } else if (InRange(a, RemoteIR::TUS_AEHA * 8) && InRange(b, RemoteIR::TUS_AEHA * 4)) {
                    /*
                     * AEHA.
                     */
                    data.format = RemoteIR::AEHA;
                    work.state = Receiving;
                    data.bitcount = 0;
                } else if (InRange(a, RemoteIR::TUS_AEHA * 8) && InRange(b, RemoteIR::TUS_AEHA * 8)) {
                    /*
                     * AEHA Repeat.
                     */
                    data.format = RemoteIR::AEHA_REPEAT;
                    work.state = Received;
                    data.bitcount = 0;
                    work.c1 = -1;
                    work.c2 = -1;
                    work.c3 = -1;
                    work.d1 = -1;
                    work.d2 = -1;
                } else {
                    init_state();
                }
            }
            break;
        case Receiving:
            if (RemoteIR::NEC == data.format) {
                work.d2 = timer.read_us();
                int a = work.d2 - work.d1;
                if (InRange(a, RemoteIR::TUS_NEC * 3)) {
                    data.buffer[data.bitcount / 8] |= (1 << (data.bitcount % 8));
                } else if (InRange(a, RemoteIR::TUS_NEC * 1)) {
                    data.buffer[data.bitcount / 8] &= ~(1 << (data.bitcount % 8));
                }
                data.bitcount++;
#if 1
                /*
                 * Length of NEC is always 32 bits.
                 */
                if (32 <= data.bitcount) {
                    work.state = Received;
                    work.c1 = -1;
                    work.c2 = -1;
                    work.c3 = -1;
                    work.d1 = -1;
                    work.d2 = -1;
                }
#else
                /*
                 * Set timeout for tail detection automatically.
                 */
                timeout.detach();
                timeout.attach_us(this, &ReceiverIR::isr_timeout, RemoteIR::TUS_NEC * 5);
#endif
            } else if (RemoteIR::AEHA == data.format) {
                work.d2 = timer.read_us();
                int a = work.d2 - work.d1;
                if (InRange(a, RemoteIR::TUS_AEHA * 3)) {
                    data.buffer[data.bitcount / 8] |= (1 << (data.bitcount % 8));
                } else if (InRange(a, RemoteIR::TUS_AEHA * 1)) {
                    data.buffer[data.bitcount / 8] &= ~(1 << (data.bitcount % 8));
                }
                data.bitcount++;
#if 0
                /*
                 * Typical length of AEHA is 48 bits.
                 * Please check a specification of your remote controller if you find a problem.
                 */
                if (48 <= data.bitcount) {
                    data.state = Received;
                    work.c1 = -1;
                    work.c2 = -1;
                    work.c3 = -1;
                    work.d1 = -1;
                    work.d2 = -1;
                }
#else
                /*
                 * Set timeout for tail detection automatically.
                 */
                timeout.detach();
                timeout.attach_us(this, &ReceiverIR::isr_timeout, RemoteIR::TUS_AEHA * 5);
#endif
            } else if (RemoteIR::SONY == data.format) {
                work.d1 = timer.read_us();
            }
            break;
        case Received:
            break;
        default:
            break;
    }
    UNLOCK();
}

void ReceiverIR::isr_rise(void) {
    LOCK();
    switch (work.state) {
        case Idle:
            if (0 <= work.c1) {
                work.c2 = timer.read_us();
                int a = work.c2 - work.c1;
                if (InRange(a, RemoteIR::TUS_SONY * 4)) {
                    data.format = RemoteIR::SONY;
                    work.state = Receiving;
                    data.bitcount = 0;
                } else {
                    static const int MINIMUM_LEADER_WIDTH = 150;
                    if (a < MINIMUM_LEADER_WIDTH) {
                        init_state();
                    }
                }
            } else {
                init_state();
            }
            break;
        case Receiving:
            if (RemoteIR::NEC == data.format) {
                work.d1 = timer.read_us();
            } else if (RemoteIR::AEHA == data.format) {
                work.d1 = timer.read_us();
            } else if (RemoteIR::SONY == data.format) {
                work.d2 = timer.read_us();
                int a = work.d2 - work.d1;
                if (InRange(a, RemoteIR::TUS_SONY * 2)) {
                    data.buffer[data.bitcount / 8] |= (1 << (data.bitcount % 8));
                } else if (InRange(a, RemoteIR::TUS_SONY * 1)) {
                    data.buffer[data.bitcount / 8] &= ~(1 << (data.bitcount % 8));
                }
                data.bitcount++;
#if 1
                /*
                 * How do I know the correct length? (6bits, 12bits, 15bits, 20bits...)
                 * By a model only?
                 * Please check a specification of your remote controller if you find a problem.
                 */
                if (32 <= data.bitcount) {
                    work.state = Received;
                    work.c1 = -1;
                    work.c2 = -1;
                    work.c3 = -1;
                    work.d1 = -1;
                    work.d2 = -1;
                }
#else
                /*
                 * Set timeout for tail detection automatically.
                 */
                timeout.detach();
                timeout.attach_us(this, &ReceiverIR::isr_timeout, RemoteIR::TUS_SONY * 4);
#endif
            }
            break;
        case Received:
            break;
        default:
            break;
    }
    UNLOCK();
}

void ReceiverIR::isr_timeout(void) {
    LOCK();
#if 0
    printf("# TIMEOUT [c1=%d, c2=%d, c3=%d, d1=%d, d2=%d, state=%d, format=%d, bitcount=%d]\n",
           work.c1,
           work.c2,
           work.c3,
           work.d1,
           work.d2,
           work.state,
           data.format,
           data.bitcount);
#endif
    if (work.state == Receiving) {
        printf("done\r\n");
        work.state = Received;
        work.c1 = -1;
        work.c2 = -1;
        work.c3 = -1;
        work.d1 = -1;
        work.d2 = -1;
    }
    UNLOCK();
}
