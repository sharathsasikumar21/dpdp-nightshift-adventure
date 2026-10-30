let element=null;
export function showSpeechCaption(clip){
 element?.remove();element=null;if(!clip?.text)return;
 element=document.createElement('aside');element.className='speech-caption';element.setAttribute('aria-live','polite');element.setAttribute('aria-atomic','true');
 const name=document.createElement('strong'),line=document.createElement('p');name.textContent=clip.speaker||'Control';line.textContent=clip.text;element.append(name,line);
 if(typeof element.showPopover==='function'){element.setAttribute('popover','manual');document.body.append(element);element.showPopover();}else (document.querySelector('dialog[open]')||document.body).append(element);
}
