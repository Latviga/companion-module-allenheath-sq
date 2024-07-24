import { describe, expect, test } from '@jest/globals'
import {
	addLabelOptionToConfig,
	addModelOptionToConfig,
	configIsMissingLabel,
	configIsMissingModel,
	type SQInstanceConfig,
} from './config.js'

describe('config upgrade to specify a missing model', () => {
	test('config without model', () => {
		const configMissingModel = {
			host: '127.0.0.1',
			level: 'LinearTaper',
			talkback: 0,
			midich: 0,
			status: 'full',
			label: 'SQ',
			verbose: false,
		} as SQInstanceConfig

		expect(configIsMissingModel(configMissingModel)).toBe(true)

		addModelOptionToConfig(configMissingModel)

		expect(configIsMissingModel(configMissingModel)).toBe(false)
		expect(configMissingModel.model).toBe('SQ5')
	})

	test("config with model='SQ5'", () => {
		const configWithModelSQ5: SQInstanceConfig = {
			host: '127.0.0.1',
			model: 'SQ5',
			level: 'LinearTaper',
			talkback: 0,
			midich: 0,
			status: 'full',
			label: 'SQ',
			verbose: false,
		}

		expect(configIsMissingModel(configWithModelSQ5)).toBe(false)
		expect(configWithModelSQ5.model).toBe('SQ5')
	})

	test("config with model='SQ7'", () => {
		const configWithModelSQ5: SQInstanceConfig = {
			host: '127.0.0.1',
			model: 'SQ7',
			level: 'LinearTaper',
			talkback: 0,
			midich: 0,
			status: 'full',
			label: 'SQ',
			verbose: false,
		}

		expect(configIsMissingModel(configWithModelSQ5)).toBe(false)
		expect(configWithModelSQ5.model).toBe('SQ7')
	})
})

describe('config upgrade to specify a missing label', () => {
	test('config without label', () => {
		const configMissingLabel = {
			host: '127.0.0.1',
			model: 'SQ5',
			level: 'LinearTaper',
			talkback: 0,
			midich: 0,
			status: 'full',
			verbose: false,
		} as SQInstanceConfig

		expect(configIsMissingLabel(configMissingLabel)).toBe(true)

		addLabelOptionToConfig(configMissingLabel)

		expect(configIsMissingLabel(configMissingLabel)).toBe(false)
		expect(configMissingLabel.label).toBe('SQ')
	})

	test("config with label='sq5'", () => {
		const configWithLabelSQ5: SQInstanceConfig = {
			host: '127.0.0.1',
			model: 'SQ5',
			level: 'LinearTaper',
			talkback: 0,
			midich: 0,
			status: 'full',
			label: 'sq5',
			verbose: false,
		}

		expect(configIsMissingLabel(configWithLabelSQ5)).toBe(false)
		expect(configWithLabelSQ5.label).toBe('sq5')
	})
})
