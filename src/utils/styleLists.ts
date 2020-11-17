import {parseGradient} from './util'

const textKeys = 	['id', ...Object.keys(Object.getPrototypeOf(figma.getLocalTextStyles()[0] 	|| {}	))]
const paintKeys = 	['id', ...Object.keys(Object.getPrototypeOf(figma.getLocalPaintStyles()[0] 	|| {}	))]
const effectKeys = 	['id', ...Object.keys(Object.getPrototypeOf(figma.getLocalEffectStyles()[0] || {}	))]
const gridKeys = 	['id', ...Object.keys(Object.getPrototypeOf(figma.getLocalGridStyles()[0]	|| {}	))]

export function getColorStylesList(){
  
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
  
export async function getTextStylesList(): Promise<any> {
  
	let textStyles = figma.getLocalTextStyles()
	let promises = textStyles.map(x => figma.loadFontAsync(x.fontName))
	return await Promise.all(promises).then(async() => {
	 
	  let mainFrame = figma.currentPage
  
	  let framePromises = textStyles.map(async(style,index) => {
  
		let frame = figma.createFrame()
		mainFrame.appendChild(frame)
		frame.fills = []
		frame.resize(18,18)
		frame.x = 0
		frame.y = index*18
		let node = figma.createText()
		frame.appendChild(node)
		node.x = 0
		node.y = 0
		node.textStyleId = style.id
		node.characters = "Ag"
		let flat  = figma.flatten([node],frame)
		flat.constrainProportions = true
		
		if(flat.width > 18){
		  let ratio = 18 / flat.width
		  flat.resize(18, flat.height * ratio)
		}
		if(flat.height > 18){
		  let ratio = 18 / flat.height
		  flat.resize(flat.width * ratio, 18)
		}
		flat.x = frame.width - flat.width
		flat.y = frame.height - flat.height
		
		let s = {}
		textKeys.forEach(key => {
		  s[key] = style[key]
		})




		s['img'] = await frame.exportAsync({format: "PNG"}).then((buffer) => {
			frame.remove();			
			return "data:image/png;base64," + Buffer.from(buffer).toString('base64');
			
		  
		
		})
  
		return s
	  })
	  const allStyles = await Promise.all(framePromises).then((result) => {return result} )
	  return allStyles
	  })	  
  
	}

	export function getGridStylesList(){
		return figma.getLocalGridStyles().map(grid => {
			let g = {}
			gridKeys.forEach(key =>{
				g[key] = grid[key] 
			})
			return g
		})
	}
	export function getEffectStylesList(){
		return figma.getLocalEffectStyles().map(grid => {
			let g = {}
			effectKeys.forEach(key =>{
				g[key] = grid[key] 
			})
			return g
		})
	}
