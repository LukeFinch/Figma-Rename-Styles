import { dispatch, handleEvent } from './codeMessageHandler';
import { rgbaString, parseGradient } from './util'
 figma.showUI(__html__, {width: 600, height: 400});

handleEvent('requestColors', () => {
	console.log('Colors requested from app')
	let colorNames = getColorList();

	dispatch('listColors', colorNames)
})

// The following shows how messages from the UI code can be handled in the main code.
handleEvent('createNode', () => {
	const node = figma.createRectangle();
	node.name = node.id;

	// This shows how the main code can send messages to the UI code.
	dispatch('nodeCreated', node.id);
});
handleEvent('rename', (data) => {
	data.forEach(item => {
		let p = figma.getLocalPaintStyles().find(paint => paint.id == item.id)
		p != undefined ? p.name = item.name : null
	})
	figma.notify(`Renamed ${data.length} styles`)
	let colorNames = getColorList();
 	dispatch('listColors', colorNames)
})

function getColorList(){
  
	let paints: Array<PaintStyle> = figma.getLocalPaintStyles()
	let colors: Array<Object> = []
  
	paints.forEach(paint => {
	
  
  
	  let style = []
  
	  let c = {'name':'','id':'','style': [],'alpha': 1}
  
	  paint.paints.forEach(p => {
		switch(p.type) {
		  case 'SOLID':
			if(p.visible){
			  style.push({background: `rgba(${p.color.r * 255},${p.color.g * 255},${p.color.b * 255},${p.opacity})`, opacity: 1, type: 'solid'})
			  }
		break;
		  case 'IMAGE':
		  break;
			default:
  			style.push({background: parseGradient(p), opacity: p.opacity, type: 'gradient'})
			break;
			}
	  })
	  if(paint.paints.length == 1){
		c.alpha = paint.paints[0].opacity
	  }
	  c.style = style
	  c.name = paint.name
	  c.id = paint.id
	  
	  colors.push(c)
	})
	
	return colors
  }
  
  