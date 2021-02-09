/**
 * 
 * Companion instance class for the Allen & Heath SQ.
 * Version 1.0.0
 * Author Max Kiusso <max@kiusso.net>
 *
 * Based on allenheath-dlive module by Andrew Broughton
 *
 */

let tcp             = require('../../tcp');
let instance_skel   = require('../../instance_skel');
let actions         = require('./actions');

const level         = require('./level.json');
const MIDI          = 51325;


class instance extends instance_skel {

	constructor(system, id, config) {
		super(system, id, config);

		Object.assign(this, {
			...actions
		});
	}

	actions(system) {

		this.setActions(this.getActions());
	
	}

	setRouting(ch, mix, ac, mc, oMB, oLB) {
        
		let routingCmds = [];
        let MSB;
        let LSB;
        let tmp;
		for (let i = 0; i < mix.length; i++) {
            if (mix[i] == 99) {
                MSB = oMB[0];
                LSB = parseInt(oLB[0]) + parseInt(ch);
            } else {
                tmp = parseInt(ch * mc + oLB[1]) + parseInt(mix[i]);
                MSB = oMB[1] + ((tmp >> 7) & 0x0F);
                LSB = tmp & 0x7F;
            }
			
            //console.log(mix[i] + ':MSB/LSB: ' + MSB + '/' + LSB);
			routingCmds.push(Buffer.from([ 0xB0, 0x63, MSB, 0xB0, 0x62, LSB, 0xB0, 0x06, 0, 0xB0, 0x26, ac ? 1 : 0]));
		}
		
		return routingCmds;
	}
    
    setLevel(ch, mx, ct, lv, oMB, oLB, cnfg = this.config.level) {
        let tmp;
        let MSB;
        let LSB;
        let VC = level[cnfg][lv][1];
        let VF = level[cnfg][lv][2];
        
        if (mx == 99) {
            MSB = oMB[0];
            LSB = parseInt(oLB[0]) + parseInt(ch);
        } else {
            tmp = parseInt(ch * ct + oLB[1]) + parseInt(mx);
            MSB = oMB[1] + ((tmp >> 7) & 0x0F);
            LSB = tmp & 0x7F;
        }
        
        //console.log(ch + ':MSB/LSB/VC/VF: ' + MSB + '/' + LSB + '/' + VC + '/' + VF);
        return [ Buffer.from([ 0xB0, 0x63, MSB, 0xB0, 0x62, LSB, 0xB0, 0x06, VC, 0xB0, 0x26, VF ]) ];
    }

	action(action) {

		let opt     = action.options;
		let channel = parseInt(opt.inputChannel);
		let MSB = 0;
		let LSB = 0;
		let strip   = parseInt(opt.strip);
		let cmd     = {port: MIDI, buffers:[]};

		switch (action.action) {
			
			case 'mute_input':
				MSB = 0;
				LSB = 0;
				break;
				
			case 'mute_lr':
				MSB = 0;
				LSB = 0x44;
				break;
				
			case 'mute_aux':
				MSB = 0;
				LSB = 0x45;
				break;

			case 'mute_group':
				MSB = 0;
				LSB = 0x30;
				break;

			case 'mute_matrix':
				MSB = 0;
				LSB = 0x55;
				break;

			case 'mute_fx_send':
				MSB = 0;
				LSB = 0x51;
				break;
				
			case 'mute_fx_return':
				MSB = 0;
				LSB = 0x3C;
				break;
				
			case 'mute_dca':
				MSB = 0x02;
				LSB = 0;
				break;
				
			case 'mute_mutegroup':
				MSB = 0x04;
				LSB = 0;
				break;
				
			case 'key_soft':
				let softKey = parseInt(opt.softKey);
				let keyValu = (opt.pressedsk == '0' || opt.pressedsk == '1') ? true : false;
				cmd.buffers = [ Buffer.from([ keyValu ? 0x90 : 0x80, 0x30 + softKey, keyValu ? 0x7F : 0 ]) ];
				break;
                
            case 'scene_recall':
                let sceneNumber = parseInt(opt.sceneNumber);
                cmd.buffers = [ Buffer.from([ 0xB0, 0, (sceneNumber >> 7) & 0x0F, 0xC0, sceneNumber & 0x7F ]) ]
                break;
                
            case 'ch_to_mix':
                cmd.buffers = this.setRouting(opt.inputChannel, opt.mixAssign, opt.mixActive, this.mixCount, [0x60,0x60], [0,0x44]);
                break;
                
            case 'ch_to_grp':
                cmd.buffers = this.setRouting(opt.inputChannel, opt.grpAssign, opt.grpActive, this.grpCount, [0,0x66], [0,0x74]);
                break;
                
            case 'grp_to_mix':
                cmd.buffers = this.setRouting(opt.inputGrp, opt.mixAssign, opt.mixActive, this.mixCount, [0x60,0x65], [0x30,0x04]);
                break;
            
            case 'gfxr_to_grp':
                cmd.buffers = this.setRouting(opt.inputFxr, opt.grpAssign, opt.grpActive, this.grpCount, [0,0x6B], [0,0x34]);
                break;
                
            case 'ch_to_fxs':
                cmd.buffers = this.setRouting(opt.inputChannel, opt.fxsAssign, opt.fxsActive, this.fxsCount, [0,0x6C], [0,0x14]);
                break;
            
            case 'grp_to_fxs':
                cmd.buffers = this.setRouting(opt.inputGrp, opt.fxsAssign, opt.fxsActive, this.fxsCount, [0,0x6D], [0,0x54]);
                break;
                
            case 'fxr_to_fxs':
                cmd.buffers = this.setRouting(opt.inputFxr, opt.fxsAssign, opt.fxsActive, this.fxsCount, [0,0x6E], [0,0x04]);
                break;
                
            case 'mix_to_mtx':
                cmd.buffers = this.setRouting(opt.inputMix, opt.mtxAssign, opt.mtxActive, this.mtxCount, [0x6E,0x6E], [0x24,0x27]);
                break;
                
            case 'grp_to_mtx':
                cmd.buffers = this.setRouting(opt.inputGrp, opt.mtxAssign, opt.mtxActive, this.mtxCount, [0,0x6E], [0,0x4B]);
                break;
                
            case 'chlev_to_mix':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mixCount, opt.level, [0x40,0x40], [0,0x44]);
                break;
                
            case 'grplev_to_mix':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mixCount, opt.level, [0x40,0x45], [0x30,0x04]);
                break;
                
            case 'fxrlev_to_mix':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mixCount, opt.level, [0x40,0x46], [0x3C,0x14]);
                break;
                
            case 'fxrlev_to_grp':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.grpCount, opt.level, [0,0x4B], [0,0x34]);
                break;
                
            case 'chlev_to_fxs':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.fxsCount, opt.level, [0,0x4C], [0,0x14]);
                break;
                
            case 'grplev_to_fxs':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.fxsCount, opt.level, [0,0x4D], [0,0x54]);
                break;
                
            case 'fxrlev_to_fxs':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.fxsCount, opt.level, [0,0x4E], [0,0x04]);
                break;
                
            case 'mixlev_to_mtx':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mtxCount, opt.level, [0x4E,0x4E], [0x24,0x27]);
                break;
            
            case 'grplev_to_mtx':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mtxCount, opt.level, [0,0x4E], [0,0x4B]);
                break;
                
            case 'level_to_output':
                cmd.buffers = this.setLevel(opt.input, 99, 0, opt.level, [0x4F,0], [0,0]);
                break;
                
            case 'chpan_to_mix':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mixCount, opt.level, [0x50,0x50], [0,0x44], 'PanBalance');
                break;
                
            case 'grppan_to_mix':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mixCount, opt.level, [0x50,0x55], [0x30,0x04], 'PanBalance');
                break;
                
            case 'fxrpan_to_mix':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mixCount, opt.level, [0x50,0x56], [0x3C,0x14], 'PanBalance');
                break;
                
            case 'fxrpan_to_grp':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.grpCount, opt.level, [0,0x5B], [0,0x34], 'PanBalance');
                break;
                
            case 'mixpan_to_mtx':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mtxCount, opt.level, [0x5E,0x5E], [0x24,0x27], 'PanBalance');
                break;
            
            case 'grppan_to_mtx':
                cmd.buffers = this.setLevel(opt.input, opt.assign, this.mtxCount, opt.level, [0,0x5E], [0,0x4B], 'PanBalance');
                break;
                
            case 'pan_to_output':
                cmd.buffers = this.setLevel(opt.input, 99, 0, opt.level, [0x5F,0], [0,0], 'PanBalance');
                break;
		}

		if (cmd.buffers.length == 0) {
			if (action.action.slice(0 ,4) == 'mute') {
				cmd.buffers = [ Buffer.from([ 0xB0, 0x63, MSB, 0xB0, 0x62, strip + LSB, 0xB0, 0x06, 0x00, 0xB0, 0x26, opt.mute ? 1 : 0 ]) ];
			}
		}

		for (let i = 0; i < cmd.buffers.length; i++) {
			if (cmd.port === MIDI && this.midiSocket !== undefined) {
				this.log('debug', `sending ${cmd.buffers[i].toString('hex')} via MIDI @${this.config.host}`);
				this.midiSocket.write(cmd.buffers[i]);
			}
		}

	}

    
	config_fields() {

		return [
			{
				type:  'text',
				id:    'info',
				width: 12,
				label: 'Information',
				value: 'This module is for the Allen & Heath SQ'
			},
			{
				type:    'textinput',
				id:      'host',
				label:   'Target IP',
				width:   6,
				default: '192.168.0.5',
				regex:   this.REGEX_IP
			},
			{
				type:    'dropdown',
				id:      'model',
				label:   'Console Type',
				width:   6,
				default: 'SQ5',
				choices: [
					{id: 'SQ5', label: 'SQ 5'},
					{id: 'SQ6', label: 'SQ 6'},
					{id: 'SQ7', label: 'SQ 7'}]
			},
            {
                type:    'dropdown',
                id:      'level',
                label:   'NRPN Fader Law',
                width:   6,
                default: 'LinearTaper',
                choices: [
                    {id: 'LinearTaper', label: 'Linear Taper'},
                    {id: 'AudioTaper', label: 'Audio Taper'}]
            }
		]
	}
    
    /*
    getRemoteValue() {
        if (cmd.port === MIDI && this.midiSocket !== undefined) {
            this.midiSocket.write(Buffer.from([ 0xB0, 0x63, MSB, 0xB0, 0x62, LSB, 0xB0, 0x60, 0x7F ]));
        }
    }
    */
    
	destroy() {

		if (this.tcpSocket !== undefined) {
			this.tcpSocket.destroy();
		}

		if (this.midiSocket !== undefined) {
			this.midiSocket.destroy();
		}

		this.log('debug', `destroyed ${this.id}`);
	}

	
	init() {

		this.updateConfig(this.config);

	}

	
	init_tcp() {
		if (this.midiSocket !== undefined) {
			this.midiSocket.destroy();
			delete this.midiSocket;
		}

		if (this.config.host) {
			this.midiSocket = new tcp(this.config.host, MIDI);

			this.midiSocket.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.midiSocket.on('error', (err) => {
				this.log('error', "MIDI error: " + err.message);
			});

			this.midiSocket.on('connect', () => {
				this.log('debug', `MIDI Connected to ${this.config.host}`);
			});
		}
	}

	
	updateConfig(config) {

		this.config = config;
		
		this.actions();
		this.init_tcp();

	}

}

exports = module.exports = instance;
