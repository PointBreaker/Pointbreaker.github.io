import{n as e}from"./chunk-BOhHC3M6.js";import{Cn as t,Ln as n,cn as r,fr as i,sr as a,vn as o,xn as s}from"../jse/index-index-Bxv-eWs7.js";import{B as c,F as l,G as u,L as d,R as f,U as p,V as m,W as h,j as g,n as _}from"./use-theme-C7bjhrpo.js";import{t as v}from"./use-rtl-_vbowe8A.js";import{n as y}from"./light-DiRXLxWN.js";import{t as b}from"./misc-C2Kz1t3h.js";import{n as x}from"./delegate-BGl2Y-ma.js";import{t as S}from"./use-memo-CVqugZ9v.js";import{t as C}from"./use-merged-state-C6Ybaeo1.js";import{n as w,t as T}from"./icon-switch.cssr-BEH0NCSv.js";import{o as E,s as D,t as O}from"./use-form-item-DUTz32PX.js";import{t as k}from"./light-B04nJcXt.js";var A=l(`n-checkbox-group`),j=o({name:`CheckboxGroup`,props:{min:Number,max:Number,size:String,value:Array,defaultValue:{type:Array,default:null},disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onChange:[Function,Array]},setup(e){let{mergedClsPrefixRef:t}=g(e),o=O(e),{mergedSizeRef:s,mergedDisabledRef:c}=o,l=a(e.defaultValue),u=C(r(()=>e.value),l),d=r(()=>{var e;return((e=u.value)==null?void 0:e.length)||0}),f=r(()=>Array.isArray(u.value)?new Set(u.value):new Set);function p(t,n){let{nTriggerFormInput:r,nTriggerFormChange:i}=o,{onChange:a,"onUpdate:value":s,onUpdateValue:c}=e;if(Array.isArray(u.value)){let e=Array.from(u.value),o=e.findIndex(e=>e===n);t?~o||(e.push(n),c&&D(c,e,{actionType:`check`,value:n}),s&&D(s,e,{actionType:`check`,value:n}),r(),i(),l.value=e,a&&D(a,e)):~o&&(e.splice(o,1),c&&D(c,e,{actionType:`uncheck`,value:n}),s&&D(s,e,{actionType:`uncheck`,value:n}),a&&D(a,e),l.value=e,r(),i())}else t?(c&&D(c,[n],{actionType:`check`,value:n}),s&&D(s,[n],{actionType:`check`,value:n}),a&&D(a,[n]),l.value=[n],r(),i()):(c&&D(c,[],{actionType:`uncheck`,value:n}),s&&D(s,[],{actionType:`uncheck`,value:n}),a&&D(a,[]),l.value=[],r(),i())}return n(A,{checkedCountRef:d,maxRef:i(e,`max`),minRef:i(e,`min`),valueSetRef:f,disabledRef:c,mergedSizeRef:s,toggleCheckbox:p}),{mergedClsPrefix:t}},render(){return s(`div`,{class:`${this.mergedClsPrefix}-checkbox-group`,role:`group`},this.$slots)}}),M=()=>s(`svg`,{viewBox:`0 0 64 64`,class:`check-icon`},s(`path`,{d:`M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z`})),N=()=>s(`svg`,{viewBox:`0 0 100 100`,class:`line-icon`},s(`path`,{d:`M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z`})),P=d([f(`checkbox`,`
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `,[m(`show-label`,`line-height: var(--n-label-line-height);`),d(`&:hover`,[f(`checkbox-box`,[c(`border`,`border: var(--n-border-checked);`)])]),d(`&:focus:not(:active)`,[f(`checkbox-box`,[c(`border`,`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),m(`inside-table`,[f(`checkbox-box`,`
 background-color: var(--n-merged-color-table);
 `)]),m(`checked`,[f(`checkbox-box`,`
 background-color: var(--n-color-checked);
 `,[f(`checkbox-icon`,[d(`.check-icon`,`
 opacity: 1;
 transform: scale(1);
 `)])])]),m(`indeterminate`,[f(`checkbox-box`,[f(`checkbox-icon`,[d(`.check-icon`,`
 opacity: 0;
 transform: scale(.5);
 `),d(`.line-icon`,`
 opacity: 1;
 transform: scale(1);
 `)])])]),m(`checked, indeterminate`,[d(`&:focus:not(:active)`,[f(`checkbox-box`,[c(`border`,`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),f(`checkbox-box`,`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[c(`border`,{border:`var(--n-border-checked)`})])]),m(`disabled`,{cursor:`not-allowed`},[m(`checked`,[f(`checkbox-box`,`
 background-color: var(--n-color-disabled-checked);
 `,[c(`border`,{border:`var(--n-border-disabled-checked)`}),f(`checkbox-icon`,[d(`.check-icon, .line-icon`,{fill:`var(--n-check-mark-color-disabled-checked)`})])])]),f(`checkbox-box`,`
 background-color: var(--n-color-disabled);
 `,[c(`border`,`
 border: var(--n-border-disabled);
 `),f(`checkbox-icon`,[d(`.check-icon, .line-icon`,`
 fill: var(--n-check-mark-color-disabled);
 `)])]),c(`label`,`
 color: var(--n-text-color-disabled);
 `)]),f(`checkbox-box-wrapper`,`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),f(`checkbox-box`,`
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
 `,[c(`border`,`
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
 `),f(`checkbox-icon`,`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[d(`.check-icon, .line-icon`,`
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
 `),T({left:`1px`,top:`1px`})])]),c(`label`,`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[d(`&:empty`,{display:`none`})])]),h(f(`checkbox`,`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),u(f(`checkbox`,`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),F=o({name:`Checkbox`,props:Object.assign(Object.assign({},_.props),{size:String,checked:{type:[Boolean,String,Number],default:void 0},defaultChecked:{type:[Boolean,String,Number],default:!1},value:[String,Number],disabled:{type:Boolean,default:void 0},indeterminate:Boolean,label:String,focusable:{type:Boolean,default:!0},checkedValue:{type:[Boolean,String,Number],default:!0},uncheckedValue:{type:[Boolean,String,Number],default:!1},"onUpdate:checked":[Function,Array],onUpdateChecked:[Function,Array],privateInsideTable:Boolean,onChange:[Function,Array]}),setup(e){let n=t(A,null),o=a(null),{mergedClsPrefixRef:s,inlineThemeDisabled:c,mergedRtlRef:l,mergedComponentPropsRef:u}=g(e),d=a(e.defaultChecked),f=C(i(e,`checked`),d),m=S(()=>{if(n){let t=n.valueSetRef.value;return t&&e.value!==void 0?t.has(e.value):!1}else return f.value===e.checkedValue}),h=O(e,{mergedSize(t){var r,i;let{size:a}=e;if(a!==void 0)return a;if(n){let{value:e}=n.mergedSizeRef;if(e!==void 0)return e}if(t){let{mergedSize:e}=t;if(e!==void 0)return e.value}return((i=(r=u==null?void 0:u.value)==null?void 0:r.Checkbox)==null?void 0:i.size)||`medium`},mergedDisabled(t){let{disabled:r}=e;if(r!==void 0)return r;if(n){if(n.disabledRef.value)return!0;let{maxRef:{value:e},checkedCountRef:t}=n;if(e!==void 0&&t.value>=e&&!m.value)return!0;let{minRef:{value:r}}=n;if(r!==void 0&&t.value<=r&&m.value)return!0}return t?t.disabled.value:!1}}),{mergedDisabledRef:x,mergedSizeRef:w}=h,T=_(`Checkbox`,`-checkbox`,P,k,e,s);function E(t){if(n&&e.value!==void 0)n.toggleCheckbox(!m.value,e.value);else{let{onChange:n,"onUpdate:checked":r,onUpdateChecked:i}=e,{nTriggerFormInput:a,nTriggerFormChange:o}=h,s=m.value?e.uncheckedValue:e.checkedValue;r&&D(r,s,t),i&&D(i,s,t),n&&D(n,s,t),a(),o(),d.value=s}}function j(e){x.value||E(e)}function M(e){if(!x.value)switch(e.key){case` `:case`Enter`:E(e)}}function N(e){switch(e.key){case` `:e.preventDefault()}}let F={focus:()=>{var e;(e=o.value)==null||e.focus()},blur:()=>{var e;(e=o.value)==null||e.blur()}},I=v(`Checkbox`,l,s),L=r(()=>{let{value:e}=w,{common:{cubicBezierEaseInOut:t},self:{borderRadius:n,color:r,colorChecked:i,colorDisabled:a,colorTableHeader:o,colorTableHeaderModal:s,colorTableHeaderPopover:c,checkMarkColor:l,checkMarkColorDisabled:u,border:d,borderFocus:f,borderDisabled:m,borderChecked:h,boxShadowFocus:g,textColor:_,textColorDisabled:v,checkMarkColorDisabledChecked:y,colorDisabledChecked:b,borderDisabledChecked:x,labelPadding:S,labelLineHeight:C,labelFontWeight:E,[p(`fontSize`,e)]:D,[p(`size`,e)]:O}}=T.value;return{"--n-label-line-height":C,"--n-label-font-weight":E,"--n-size":O,"--n-bezier":t,"--n-border-radius":n,"--n-border":d,"--n-border-checked":h,"--n-border-focus":f,"--n-border-disabled":m,"--n-border-disabled-checked":x,"--n-box-shadow-focus":g,"--n-color":r,"--n-color-checked":i,"--n-color-table":o,"--n-color-table-modal":s,"--n-color-table-popover":c,"--n-color-disabled":a,"--n-color-disabled-checked":b,"--n-text-color":_,"--n-text-color-disabled":v,"--n-check-mark-color":l,"--n-check-mark-color-disabled":u,"--n-check-mark-color-disabled-checked":y,"--n-font-size":D,"--n-label-padding":S}}),R=c?y(`checkbox`,r(()=>w.value[0]),L,e):void 0;return Object.assign(h,F,{rtlEnabled:I,selfRef:o,mergedClsPrefix:s,mergedDisabled:x,renderedChecked:m,mergedTheme:T,labelId:b(),handleClick:j,handleKeyUp:M,handleKeyDown:N,cssVars:c?void 0:L,themeClass:R==null?void 0:R.themeClass,onRender:R==null?void 0:R.onRender})},render(){var e;let{$slots:t,renderedChecked:n,mergedDisabled:r,indeterminate:i,privateInsideTable:a,cssVars:o,labelId:c,label:l,mergedClsPrefix:u,focusable:d,handleKeyUp:f,handleKeyDown:p,handleClick:m}=this;(e=this.onRender)==null||e.call(this);let h=E(t.default,e=>l||e?s(`span`,{class:`${u}-checkbox__label`,id:c},l||e):null);return s(`div`,{ref:`selfRef`,class:[`${u}-checkbox`,this.themeClass,this.rtlEnabled&&`${u}-checkbox--rtl`,n&&`${u}-checkbox--checked`,r&&`${u}-checkbox--disabled`,i&&`${u}-checkbox--indeterminate`,a&&`${u}-checkbox--inside-table`,h&&`${u}-checkbox--show-label`],tabindex:r||!d?void 0:0,role:`checkbox`,"aria-checked":i?`mixed`:n,"aria-labelledby":c,style:o,onKeyup:f,onKeydown:p,onClick:m,onMousedown:()=>{x(`selectstart`,window,e=>{e.preventDefault()},{once:!0})}},s(`div`,{class:`${u}-checkbox-box-wrapper`},`\xA0`,s(`div`,{class:`${u}-checkbox-box`},s(w,null,{default:()=>this.indeterminate?s(`div`,{key:`indeterminate`,class:`${u}-checkbox-icon`},N()):s(`div`,{key:`check`,class:`${u}-checkbox-icon`},M())}),s(`div`,{class:`${u}-checkbox-box__border`}))),h)}}),I=e({NCheckbox:()=>F,NCheckboxGroup:()=>j});export{F as n,j as r,I as t};