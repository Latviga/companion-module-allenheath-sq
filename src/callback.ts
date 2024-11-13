export type CallbackInfoType = {
	mute: {
		readonly [key: `${number}:${number}`]: readonly [string, number]
	}
}

export const CallbackInfo = {
	mute: {
		'0:0': ['mute_input', 0],
		'0:1': ['mute_input', 1],
		'0:2': ['mute_input', 2],
		'0:3': ['mute_input', 3],
		'0:4': ['mute_input', 4],
		'0:5': ['mute_input', 5],
		'0:6': ['mute_input', 6],
		'0:7': ['mute_input', 7],
		'0:8': ['mute_input', 8],
		'0:9': ['mute_input', 9],
		'0:10': ['mute_input', 10],
		'0:11': ['mute_input', 11],
		'0:12': ['mute_input', 12],
		'0:13': ['mute_input', 13],
		'0:14': ['mute_input', 14],
		'0:15': ['mute_input', 15],
		'0:16': ['mute_input', 16],
		'0:17': ['mute_input', 17],
		'0:18': ['mute_input', 18],
		'0:19': ['mute_input', 19],
		'0:20': ['mute_input', 20],
		'0:21': ['mute_input', 21],
		'0:22': ['mute_input', 22],
		'0:23': ['mute_input', 23],
		'0:24': ['mute_input', 24],
		'0:25': ['mute_input', 25],
		'0:26': ['mute_input', 26],
		'0:27': ['mute_input', 27],
		'0:28': ['mute_input', 28],
		'0:29': ['mute_input', 29],
		'0:30': ['mute_input', 30],
		'0:31': ['mute_input', 31],
		'0:32': ['mute_input', 32],
		'0:33': ['mute_input', 33],
		'0:34': ['mute_input', 34],
		'0:35': ['mute_input', 35],
		'0:36': ['mute_input', 36],
		'0:37': ['mute_input', 37],
		'0:38': ['mute_input', 38],
		'0:39': ['mute_input', 39],
		'0:40': ['mute_input', 40],
		'0:41': ['mute_input', 41],
		'0:42': ['mute_input', 42],
		'0:43': ['mute_input', 43],
		'0:44': ['mute_input', 44],
		'0:45': ['mute_input', 45],
		'0:46': ['mute_input', 46],
		'0:47': ['mute_input', 47],
		'0:48': ['mute_group', 0],
		'0:49': ['mute_group', 1],
		'0:50': ['mute_group', 2],
		'0:51': ['mute_group', 3],
		'0:52': ['mute_group', 4],
		'0:53': ['mute_group', 5],
		'0:54': ['mute_group', 6],
		'0:55': ['mute_group', 7],
		'0:56': ['mute_group', 8],
		'0:57': ['mute_group', 9],
		'0:58': ['mute_group', 10],
		'0:59': ['mute_group', 11],
		'0:60': ['mute_fx_return', 0],
		'0:61': ['mute_fx_return', 1],
		'0:62': ['mute_fx_return', 2],
		'0:63': ['mute_fx_return', 3],
		'0:64': ['mute_fx_return', 4],
		'0:65': ['mute_fx_return', 5],
		'0:66': ['mute_fx_return', 6],
		'0:67': ['mute_fx_return', 7],
		'0:68': ['mute_lr', 0],
		'0:69': ['mute_aux', 0],
		'0:70': ['mute_aux', 1],
		'0:71': ['mute_aux', 2],
		'0:72': ['mute_aux', 3],
		'0:73': ['mute_aux', 4],
		'0:74': ['mute_aux', 5],
		'0:75': ['mute_aux', 6],
		'0:76': ['mute_aux', 7],
		'0:77': ['mute_aux', 8],
		'0:78': ['mute_aux', 9],
		'0:79': ['mute_aux', 10],
		'0:80': ['mute_aux', 11],
		'0:81': ['mute_fx_send', 0],
		'0:82': ['mute_fx_send', 1],
		'0:83': ['mute_fx_send', 2],
		'0:84': ['mute_fx_send', 3],
		'0:85': ['mute_matrix', 0],
		'0:86': ['mute_matrix', 1],
		'0:87': ['mute_matrix', 2],
		'2:0': ['mute_dca', 0],
		'2:1': ['mute_dca', 1],
		'2:2': ['mute_dca', 2],
		'2:3': ['mute_dca', 3],
		'2:4': ['mute_dca', 4],
		'2:5': ['mute_dca', 5],
		'2:6': ['mute_dca', 6],
		'2:7': ['mute_dca', 7],
		'4:0': ['mute_mutegroup', 0],
		'4:1': ['mute_mutegroup', 1],
		'4:2': ['mute_mutegroup', 2],
		'4:3': ['mute_mutegroup', 3],
		'4:4': ['mute_mutegroup', 4],
		'4:5': ['mute_mutegroup', 5],
		'4:6': ['mute_mutegroup', 6],
		'4:7': ['mute_mutegroup', 7],
	},
} satisfies CallbackInfoType
