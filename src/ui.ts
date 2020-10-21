import './reset.css'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import './ui.css'



var chkboxes
let checkValArray = []

    onmessage = (event) => {
     
        if(event.data.pluginMessage.type == "update-list") {
                

        

var lastChecked = null


var mainCheck = document.getElementsByName('mainCheckbox')[0] as unknown as HTMLInputElement

      
        
        const tableBody = document.getElementById('tableBody')
        tableBody.innerHTML = ""
      
        console.log('data array',event.data.pluginMessage.dataArr)
        //let colors = JSON.parse(event.data.pluginMessage.dataStr)
            let colors = event.data.pluginMessage.dataArr
        
        

        //Add each color to the UI
        //TODO: use vue and a v-for maybe? 
        colors.forEach((color,index) => {
    
          let tr = document.createElement('tr')
          tr.className = "table-row"
          let th = document.createElement('th')
          th.scope = "row"
          let inp = document.createElement('input')
          inp.type = "checkbox"
          inp.id = color.id
          inp.value = color.name
          inp.className = "checkRow"
          if(checkValArray.find(el => el.id === color.id)){
                inp.checked = true
                tr.classList.add('table-primary')
            } else {
                inp.checked = false
                tr.classList.remove('table-primary')
            };
          let swatch = document.createElement('span')
          swatch.className = 'swatch'
            if(color.alpha == 1 && color.style.length > 1){
               swatch.style.backgroundImage = "url(data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A)"
            }
          color.style.forEach(style => {

              let layer = document.createElement('div')
              layer.className = "swatchLayer"
              layer.style.opacity = style.opacity;
              console.log(style)
              if(style.type === "solid"){layer.style.background = style.background}
              if(style.type === "gradient"){layer.style.backgroundImage = style.background}
              
              swatch.appendChild(layer)
          })
          if(color.alpha !== 1){
              let checker = document.createElement('div')
              checker.className = "swatchTransparencyChecker"
        
              checker.style.opacity = `${1 - color.alpha}`
              swatch.appendChild(checker);
            }

      
          tableBody.appendChild(tr)
          //tr.appendChild(th)
          let label = document.createElement('label')
          label.htmlFor = color.id
          label.innerHTML = color.name
          label.className = "type type--small full-width-label"
    
          tr.appendChild(label)
          label.insertBefore(swatch, label.childNodes[0])
          label.appendChild(inp)
      
          
          })
        //add functionality to the checkboxes
    
      
        chkboxes = Array.from(document.getElementsByClassName('checkRow')) 
        chkboxes.forEach(function (el) {
            let checkbox = el as unknown as HTMLInputElement
    
            checkbox.addEventListener('change', function (e){
        
            })
        
            checkbox.addEventListener('click', function (e) {
        
                checkValArray = []
        
        
                if (!lastChecked) {
                    lastChecked = this
                }
        
        
                if (e.shiftKey) {
                    var start = chkboxes.indexOf(this)
                    var end = chkboxes.indexOf(lastChecked)
        
                    var selectedChecks = chkboxes.slice(Math.min(start, end), Math.max(start, end))
                    selectedChecks.forEach(function (el) {
                        let selectedCheckbox = el as HTMLInputElement
                        selectedCheckbox.checked = lastChecked.checked
                    })
                }
        
                var checkBoxStatus = false;
        
                chkboxes.forEach(function (el) {
                    checkbox = el as unknown as HTMLInputElement
                    if (checkbox.checked) {
                        parents(checkbox).find(node => node.tagName == "TR").classList.add('table-primary')
                    } else {
                        parents(checkbox).find(node => node.tagName == "TR").classList.remove('table-primary')
                    }
        
                    if (checkbox.checked) {
                        checkValArray.push(checkbox)
                    }
                    if (!checkbox.checked) {
                        checkBoxStatus = false
                    }
                })
        
                if (checkBoxStatus) {
                    mainCheck.checked = true
                } else {
                    mainCheck.checked = false
                }
                lastChecked = this
            });
        
        
        
        });
        //When the main checkbox is selected
        mainCheck.addEventListener("click", function (e) {
                //reset the array to be blank
                checkValArray = []
        
                //Set all checkboxes to same state as the main checkbox
                chkboxes.forEach(function (el) {
                    let checkbox = el as unknown as HTMLInputElement
                    checkbox.checked = mainCheck.checked
                })
                //If the main checkbox is selected
                if (mainCheck.checked) {
                   document.getElementById('mainCheckboxLabel').innerHTML = "Select None"
                    chkboxes.forEach(function (el) {
                        let checkbox = el as unknown as HTMLInputElement
                           if (checkbox.checked) {
                            checkValArray.push(el)
                        }
                    })
                } else {
                    document.getElementById('mainCheckboxLabel').innerHTML = "Select All"
                    checkValArray = []
                }
        
                chkboxes.forEach(function (el) {
                    let checkbox = el as unknown as HTMLInputElement
                    if (checkbox.checked) {
                        parents(checkbox).find(node => node.tagName == "TR").classList.add('table-primary')
                    } else {
                        parents(checkbox).find(node => node.tagName == "TR").classList.remove('table-primary')
                    }
        
                })
                //console.log(checkValArray)
            })
       
        
         }
        }


        //Update the list of styles
        //We have to do this because the list is cached.
        document.getElementById('refresh').onclick = () => {
            refreshList()
          }
          
          function refreshList() {
            parent.postMessage({pluginMessage: {type: 'refresh-list'}}, '*')
          }
          
        //Do the renaming
          document.getElementById('rename').onclick = () => {
        
          checkValArray.forEach((val,index) => {
           
            
            let findStr = (document.getElementById('findString') as HTMLInputElement).value
            let repStr = (document.getElementById('replaceString') as HTMLInputElement).value
          
            let name = val.value.replace(new RegExp(findStr, 'g'), repStr)
          
            let data = JSON.stringify({'name':name,'id': val.id})
            // console.log(data)
          
            parent.postMessage({pluginMessage: {type: 'rename-color', data } }, '*')
          })
        }
        document.getElementById('cancel').onclick = () => {
            parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
            }


// document.getElementById('create').onclick = () => {
//   const textbox = document.getElementById('count') as HTMLInputElement
//   const count = parseInt(textbox.value, 10)
//   parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
// }

// document.getElementById('cancel').onclick = () => {
//   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
// }

// //$(':checkbox').change(function() { console.log(checkValArray) })


//Get the parents of an element as list.
function parents(node) {
    let current = node;
    let list = [];
    while (current.parentNode != null && current.parentNode != document.documentElement) {
        list.push(current.parentNode);
        current = current.parentNode;
    }
    return list
    }

