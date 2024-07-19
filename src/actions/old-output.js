import { OutputActionId } from './output.js'
import { getFadeTimeSeconds } from './fading.js'
import { SinkLevelInOutputBase } from '../mixer/parameters.js'

/**
 *
 * @param {import('../instance-interface.js').SQInstanceInterface} self
 * @param {import('../mixer/mixer.js').Mixer} mixer
 * @param {import('@companion-module/base').CompanionOptionValues} options
 * @param {import('../mixer/parameters.js').SinkLevelInOutputType} type
 */
function fadeLevelToSpecificOutputAction(self, mixer, options, type) {
	const fadeTimeSeconds = getFadeTimeSeconds(self, options)
	if (fadeTimeSeconds === null) {
		return
	}

	const { MSB, LSB } = SinkLevelInOutputBase[type]
	const commands = self.fadeLevel(fadeTimeSeconds, options.input, 99, 0, options.leveldb, [MSB, 0], [LSB, 0])
	mixer.midi.sendCommands(commands)
}

/**
 *
 * @param {import('../instance-interface.js').SQInstanceInterface} self
 * @param {import('../mixer/mixer.js').Mixer} mixer
 * @param {import('./to-source-or-sink.js').OptionValue} options
 */
function panBalanceToOutputAction(self, mixer, options) {
	const { input: fader, leveldb: panBalance } = options
	mixer.setOutputPanBalance(fader, panBalance)
}

/**
 * Generate action definitions for adjusting the levels or pan/balance of
 * various mixer sinks when they're assigned to mixer outputs.
 *
 * @param {import('../instance-interface.js').SQInstanceInterface} self
 *   The instance for which actions are being generated.
 * @param {import('../mixer/mixer.js').Mixer} mixer
 *   The mixer object to use when executing the actions.
 * @param {import('../choices.js').Choices} choices
 *   Option choices for use in the actions.
 * @param {import('@companion-module/base').CompanionInputFieldDropdown} levelOption
 *   An action option specifying all levels an output can be set to.
 * @param {import('@companion-module/base').CompanionInputFieldDropdown} fadingOption
 *   An action option specifying various fade times over which the set to level
 *   should take place.
 * @param {import('@companion-module/base').CompanionInputFieldDropdown} panLevelOption
 *   An action option specifying pan amounts for the output.
 * @param {string} connectionLabel
 *   The label of the SQ instance.
 * @returns {import('./actionid.js').ActionDefinitions<import('./output.js').OutputActionId>}
 *   The set of all output-adjustment action definitions.
 */
export function oldOutputActions(self, mixer, choices, levelOption, fadingOption, panLevelOption, connectionLabel) {
	return {
		[OutputActionId.LRLevelOutput]: {
			name: 'LR fader level to output',
			options: [
				// There's only one LR, so don't include an input option.
				levelOption,
				fadingOption,
			],
			callback: async ({ options }) => {
				options.input = 0 // XXX hack to select the 0th 'lr' sink
				fadeLevelToSpecificOutputAction(self, mixer, options, 'lr')
			},
		},

		[OutputActionId.MixLevelOutput]: {
			name: 'Mix fader level to output',
			options: [
				{
					type: 'dropdown',
					label: 'Fader',
					id: 'input',
					default: 0,
					choices: choices.mixes,
					minChoicesForSearch: 0,
				},
				levelOption,
				fadingOption,
			],
			callback: async ({ options }) => {
				fadeLevelToSpecificOutputAction(self, mixer, options, 'mix')
			},
		},

		[OutputActionId.FXSendLevelOutput]: {
			name: 'FX Send fader level to output',
			options: [
				{
					type: 'dropdown',
					label: 'Fader',
					id: 'input',
					default: 0,
					choices: choices.fxSends,
					minChoicesForSearch: 0,
				},
				levelOption,
				fadingOption,
			],
			callback: async ({ options }) => {
				fadeLevelToSpecificOutputAction(self, mixer, options, 'fxSend')
			},
		},

		[OutputActionId.MatrixLevelOutput]: {
			name: 'Matrix fader level to output',
			options: [
				{
					type: 'dropdown',
					label: 'Fader',
					id: 'input',
					default: 0,
					choices: choices.matrixes,
					minChoicesForSearch: 0,
				},
				levelOption,
				fadingOption,
			],
			callback: async ({ options }) => {
				fadeLevelToSpecificOutputAction(self, mixer, options, 'matrix')
			},
		},

		[OutputActionId.DCALevelOutput]: {
			name: 'DCA fader level to output',
			options: [
				{
					type: 'dropdown',
					label: 'Fader',
					id: 'input',
					default: 0,
					choices: choices.dcas,
					minChoicesForSearch: 0,
				},
				levelOption,
				fadingOption,
			],
			callback: async ({ options }) => {
				fadeLevelToSpecificOutputAction(self, mixer, options, 'dca')
			},
		},

		[OutputActionId.OutputPanBalance]: {
			name: 'Pan/Bal level to output',
			options: [
				{
					type: 'dropdown',
					label: 'Fader',
					id: 'input',
					default: 0,
					choices: choices.panBalanceFaders,
					minChoicesForSearch: 0,
				},
				panLevelOption,
				{
					type: 'textinput',
					label: 'Variable to show level (click config button to refresh)',
					id: 'showvar',
					default: '',
				},
			],
			subscribe: async (action) => {
				let opt = action.options
				let val = self.getLevel(opt.input, 99, 0, [0x5f, 0], [0, 0])
				mixer.midi.send(val.commands[0])
				opt.showvar = `$(${connectionLabel}:pan_${val.channel[0]}.${val.channel[1]})`
			},
			callback: async ({ options }) => {
				panBalanceToOutputAction(self, mixer, options)
			},
		},
	}
}
