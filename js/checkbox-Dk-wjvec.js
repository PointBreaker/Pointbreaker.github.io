import{n as e}from"./chunk-BOhHC3M6.js";import{Nn as t,_n as n,cr as r,in as i,mn as a,rr as o,yn as s}from"../jse/index-index-DFxUuOiR.js";import{B as c,H as l,I as u,L as d,P as f,U as p,W as m,j as h,n as g,z as _}from"./use-theme-DYmMCFiI.js";import{t as v}from"./use-rtl-UMJ7YbC0.js";import{n as y}from"./light-BeGsVN-u.js";import{t as b}from"./misc-BCptJ0qX.js";import{n as x}from"./delegate-BPRWleUh.js";import{t as S}from"./use-memo-BUPguHqY.js";import{t as C}from"./use-merged-state-MUEv9gbJ.js";import{n as w,t as T}from"./icon-switch.cssr-orhniUkG.js";import{o as E,s as D,t as O}from"./use-form-item-BpI6_yZJ.js";import{t as k}from"./light-B7CJy8Yd.js";var A=f(`n-checkbox-group`),j=a({name:`CheckboxGroup`,props:{min:Number,max:Number,size:String,value:Array,defaultValue:{type:Array,default:null},disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onChange:[Function,Array]},setup(e){let{mergedClsPrefixRef:n}=h(e),a=O(e),{mergedSizeRef:s,mergedDisabledRef:c}=a,l=o(e.defaultValue),u=C(i(()=>e.value),l),d=i(()=>{var e;return((e=u.value)==null?void 0:e.length)||0}),f=i(()=>Array.isArray(u.value)?new Set(u.value):new Set);function p(t,n){let{nTriggerFormInput:r,nTriggerFormChange:i}=a,{onChange:o,"onUpdate:value":s,onUpdateValue:c}=e;if(Array.isArray(u.value)){let e=Array.from(u.value),a=e.findIndex(e=>e===n);t?~a||(e.push(n),c&&D(c,e,{actionType:`check`,value:n}),s&&D(s,e,{actionType:`check`,value:n}),r(),i(),l.value=e,o&&D(o,e)):~a&&(e.splice(a,1),c&&D(c,e,{actionType:`uncheck`,value:n}),s&&D(s,e,{actionType:`uncheck`,value:n}),o&&D(o,e),l.value=e,r(),i())}else t?(c&&D(c,[n],{actionType:`check`,value:n}),s&&D(s,[n],{actionType:`check`,value:n}),o&&D(o,[n]),l.value=[n],r(),i()):(c&&D(c,[],{actionType:`uncheck`,value:n}),s&&D(s,[],{actionType:`uncheck`,value:n}),o&&D(o,[]),l.value=[],r(),i())}return t(A,{checkedCountRef:d,maxRef:r(e,`max`),minRef:r(e,`min`),valueSetRef:f,disabledRef:c,mergedSizeRef:s,toggleCheckbox:p}),{mergedClsPrefix:n}},render(){return n(`div`,{class:`${this.mergedClsPrefix}-checkbox-group`,role:`group`},this.$slots)}}),M=()=>n(`svg`,{viewBox:`0 0 64 64`,class:`check-icon`},n(`path`,{d:`M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z`})),N=()=>n(`svg`,{viewBox:`0 0 100 100`,class:`line-icon`},n(`path`,{d:`M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z`})),P=u([d(`checkbox`,`
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `,[c(`show-label`,`line-height: var(--n-label-line-height);`),u(`&:hover`,[d(`checkbox-box`,[_(`border`,`border: var(--n-border-checked);`)])]),u(`&:focus:not(:active)`,[d(`checkbox-box`,[_(`border`,`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),c(`inside-table`,[d(`checkbox-box`,`
 background-color: var(--n-merged-color-table);
 `)]),c(`checked`,[d(`checkbox-box`,`
 background-color: var(--n-color-checked);
 `,[d(`checkbox-icon`,[u(`.check-icon`,`
 opacity: 1;
 transform: scale(1);
 `)])])]),c(`indeterminate`,[d(`checkbox-box`,[d(`checkbox-icon`,[u(`.check-icon`,`
 opacity: 0;
 transform: scale(.5);
 `),u(`.line-icon`,`
 opacity: 1;
 transform: scale(1);
 `)])])]),c(`checked, indeterminate`,[u(`&:focus:not(:active)`,[d(`checkbox-box`,[_(`border`,`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),d(`checkbox-box`,`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[_(`border`,{border:`var(--n-border-checked)`})])]),c(`disabled`,{cursor:`not-allowed`},[c(`checked`,[d(`checkbox-box`,`
 background-color: var(--n-color-disabled-checked);
 `,[_(`border`,{border:`var(--n-border-disabled-checked)`}),d(`checkbox-icon`,[u(`.check-icon, .line-icon`,{fill:`var(--n-check-mark-color-disabled-checked)`})])])]),d(`checkbox-box`,`
 background-color: var(--n-color-disabled);
 `,[_(`border`,`
 border: var(--n-border-disabled);
 `),d(`checkbox-icon`,[u(`.check-icon, .line-icon`,`
 fill: var(--n-check-mark-color-disabled);
 `)])]),_(`label`,`
 color: var(--n-text-color-disabled);
 `)]),d(`checkbox-box-wrapper`,`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),d(`checkbox-box`,`
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `,[_(`border`,`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `),d(`checkbox-icon`,`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[u(`.check-icon, .line-icon`,`
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `),T({left:`1px`,top:`1px`})])]),_(`label`,`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[u(`&:empty`,{display:`none`})])]),p(d(`checkbox`,`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),m(d(`checkbox`,`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),F=a({name:`Checkbox`,props:Object.assign(Object.assign({},g.props),{size:String,checked:{type:[Boolean,String,Number],default:void 0},defaultChecked:{type:[Boolean,String,Number],default:!1},value:[String,Number],disabled:{type:Boolean,default:void 0},indeterminate:Boolean,label:String,focusable:{type:Boolean,default:!0},checkedValue:{type:[Boolean,String,Number],default:!0},uncheckedValue:{type:[Boolean,String,Number],default:!1},"onUpdate:checked":[Function,Array],onUpdateChecked:[Function,Array],privateInsideTable:Boolean,onChange:[Function,Array]}),setup(e){let t=s(A,null),n=o(null),{mergedClsPrefixRef:a,inlineThemeDisabled:c,mergedRtlRef:u,mergedComponentPropsRef:d}=h(e),f=o(e.defaultChecked),p=C(r(e,`checked`),f),m=S(()=>{if(t){let n=t.valueSetRef.value;return n&&e.value!==void 0?n.has(e.value):!1}else return p.value===e.checkedValue}),_=O(e,{mergedSize(n){var r,i;let{size:a}=e;if(a!==void 0)return a;if(t){let{value:e}=t.mergedSizeRef;if(e!==void 0)return e}if(n){let{mergedSize:e}=n;if(e!==void 0)return e.value}return((i=(r=d==null?void 0:d.value)==null?void 0:r.Checkbox)==null?void 0:i.size)||`medium`},mergedDisabled(n){let{disabled:r}=e;if(r!==void 0)return r;if(t){if(t.disabledRef.value)return!0;let{maxRef:{value:e},checkedCountRef:n}=t;if(e!==void 0&&n.value>=e&&!m.value)return!0;let{minRef:{value:r}}=t;if(r!==void 0&&n.value<=r&&m.value)return!0}return n?n.disabled.value:!1}}),{mergedDisabledRef:x,mergedSizeRef:w}=_,T=g(`Checkbox`,`-checkbox`,P,k,e,a);function E(n){if(t&&e.value!==void 0)t.toggleCheckbox(!m.value,e.value);else{let{onChange:t,"onUpdate:checked":r,onUpdateChecked:i}=e,{nTriggerFormInput:a,nTriggerFormChange:o}=_,s=m.value?e.uncheckedValue:e.checkedValue;r&&D(r,s,n),i&&D(i,s,n),t&&D(t,s,n),a(),o(),f.value=s}}function j(e){x.value||E(e)}function M(e){if(!x.value)switch(e.key){case` `:case`Enter`:E(e)}}function N(e){switch(e.key){case` `:e.preventDefault()}}let F={focus:()=>{var e;(e=n.value)==null||e.focus()},blur:()=>{var e;(e=n.value)==null||e.blur()}},I=v(`Checkbox`,u,a),L=i(()=>{let{value:e}=w,{common:{cubicBezierEaseInOut:t},self:{borderRadius:n,color:r,colorChecked:i,colorDisabled:a,colorTableHeader:o,colorTableHeaderModal:s,colorTableHeaderPopover:c,checkMarkColor:u,checkMarkColorDisabled:d,border:f,borderFocus:p,borderDisabled:m,borderChecked:h,boxShadowFocus:g,textColor:_,textColorDisabled:v,checkMarkColorDisabledChecked:y,colorDisabledChecked:b,borderDisabledChecked:x,labelPadding:S,labelLineHeight:C,labelFontWeight:E,[l(`fontSize`,e)]:D,[l(`size`,e)]:O}}=T.value;return{"--n-label-line-height":C,"--n-label-font-weight":E,"--n-size":O,"--n-bezier":t,"--n-border-radius":n,"--n-border":f,"--n-border-checked":h,"--n-border-focus":p,"--n-border-disabled":m,"--n-border-disabled-checked":x,"--n-box-shadow-focus":g,"--n-color":r,"--n-color-checked":i,"--n-color-table":o,"--n-color-table-modal":s,"--n-color-table-popover":c,"--n-color-disabled":a,"--n-color-disabled-checked":b,"--n-text-color":_,"--n-text-color-disabled":v,"--n-check-mark-color":u,"--n-check-mark-color-disabled":d,"--n-check-mark-color-disabled-checked":y,"--n-font-size":D,"--n-label-padding":S}}),R=c?y(`checkbox`,i(()=>w.value[0]),L,e):void 0;return Object.assign(_,F,{rtlEnabled:I,selfRef:n,mergedClsPrefix:a,mergedDisabled:x,renderedChecked:m,mergedTheme:T,labelId:b(),handleClick:j,handleKeyUp:M,handleKeyDown:N,cssVars:c?void 0:L,themeClass:R==null?void 0:R.themeClass,onRender:R==null?void 0:R.onRender})},render(){var e;let{$slots:t,renderedChecked:r,mergedDisabled:i,indeterminate:a,privateInsideTable:o,cssVars:s,labelId:c,label:l,mergedClsPrefix:u,focusable:d,handleKeyUp:f,handleKeyDown:p,handleClick:m}=this;(e=this.onRender)==null||e.call(this);let h=E(t.default,e=>l||e?n(`span`,{class:`${u}-checkbox__label`,id:c},l||e):null);return n(`div`,{ref:`selfRef`,class:[`${u}-checkbox`,this.themeClass,this.rtlEnabled&&`${u}-checkbox--rtl`,r&&`${u}-checkbox--checked`,i&&`${u}-checkbox--disabled`,a&&`${u}-checkbox--indeterminate`,o&&`${u}-checkbox--inside-table`,h&&`${u}-checkbox--show-label`],tabindex:i||!d?void 0:0,role:`checkbox`,"aria-checked":a?`mixed`:r,"aria-labelledby":c,style:s,onKeyup:f,onKeydown:p,onClick:m,onMousedown:()=>{x(`selectstart`,window,e=>{e.preventDefault()},{once:!0})}},n(`div`,{class:`${u}-checkbox-box-wrapper`},`\xA0`,n(`div`,{class:`${u}-checkbox-box`},n(w,null,{default:()=>this.indeterminate?n(`div`,{key:`indeterminate`,class:`${u}-checkbox-icon`},N()):n(`div`,{key:`check`,class:`${u}-checkbox-icon`},M())}),n(`div`,{class:`${u}-checkbox-box__border`}))),h)}}),I=e({NCheckbox:()=>F,NCheckboxGroup:()=>j});export{F as n,I as t};