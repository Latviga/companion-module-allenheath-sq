import { describe, test } from '@jest/globals'
import { TestMidiTokenizing } from './midi-tokenizing.js'
import { SysRTContinue, SysExMessage, SysExEnd } from './bytes.js'
import {
	ExpectNextMessageNotReady,
	ExpectChannelMessage,
	ExpectSystemExclusiveMessage,
	ExpectSystemRealTimeMessage,
	MixerReply,
} from './interactions.js'

describe('parse status byte', () => {
	test('data bytes before channel status byte', async () => {
		return TestMidiTokenizing([
			MixerReply([0x12, 0x34, 0x56, 0xb0, 0x00]),
			ExpectNextMessageNotReady(),
			MixerReply([0x0f]),
			ExpectNextMessageNotReady(),
			ExpectChannelMessage([0xb0, 0x00, 0x0f]),
		])
	})
	test('data bytes before system status byte', async () => {
		return TestMidiTokenizing([
			MixerReply([0x12, 0x34, 0x56, ...SysExMessage.slice(0, 2)]),
			ExpectNextMessageNotReady(),
			MixerReply(SysExMessage.slice(2)),
			MixerReply([0xc5, 0x17]),
			ExpectSystemExclusiveMessage(SysExMessage),
			ExpectChannelMessage([0xc5, 0x17]),
			ExpectNextMessageNotReady(),
		])
	})
	test('data bytes before system status byte', async () => {
		return TestMidiTokenizing([
			MixerReply([0x12, 0x34, 0x56, ...SysExMessage.slice(0, 2)]),
			ExpectNextMessageNotReady(),
			MixerReply([0xc5]), // terminate sysex
			ExpectSystemExclusiveMessage([...SysExMessage.slice(0, 2), SysExEnd]),
			MixerReply([0xc5, 0x17]),
			ExpectChannelMessage([0xc5, 0x17]),
		])
	})

	test('data bytes before system real time', async () => {
		return TestMidiTokenizing([
			MixerReply([0x12, 0x34, 0x56]),
			ExpectNextMessageNotReady(),
			MixerReply([SysRTContinue]),
			ExpectSystemRealTimeMessage(SysRTContinue),
			MixerReply(SysExMessage),
			MixerReply([0xc5, 0x17]),
			ExpectSystemExclusiveMessage(SysExMessage),
			ExpectChannelMessage([0xc5, 0x17]),
		])
	})
})
