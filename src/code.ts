import { dispatch, handleEvent } from './utils/codeMessageHandler';

import {getColorStylesList, getTextStylesList, getEffectStylesList, getGridStylesList, getTextStylesIcons} from './utils/styleLists'

figma.showUI(__html__, {width: 600, height: 400});

handleEvent('requestStyles', async (type) => {
	console.log('request from the plugin:',type)
	let list
	switch(type){
		case 'paint':
			list = getColorStylesList()
			break;
		case 'text':
			list = getTextStylesList()
			break;
		case 'effect':
			list = getEffectStylesList()
			break
		case 'grid':
			list = getGridStylesList()
			break;
		default: list = getColorStylesList()
	}
	dispatch('styleList', {type:type,list:list})
})

handleEvent('requestTextIcons', async() => {
	const icons = await getTextStylesIcons();
	dispatch('textIcons', icons)
})

// The following shows how messages from the UI code can be handled in the main code.

handleEvent('rename', (data) => {
	data.forEach(item => {
		let style = figma.getStyleById(item.id)
		//let p = figma.getLocalPaintStyles().find(paint => paint.id == item.id)
		style != undefined ? style.name = item.name : null
	})
	figma.notify(`Renamed ${data.length} styles`)

	//TODO dispatch new list of type based on previous type (store in figma preferences ?)
	// let colorNames = getColorList();
	 // dispatch('listColors', colorNames)
	 dispatch('renamed')
})