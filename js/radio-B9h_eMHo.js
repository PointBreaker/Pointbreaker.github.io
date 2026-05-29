import{Cn as e,Ln as t,cn as n,fr as r,sr as i,vn as a,xn as o}from"../jse/index-index-jN-t5_md.js";import{B as s,H as c,I as l,L as u,P as d,V as f,j as p,n as m,z as h}from"./use-theme-DLQNGgsw.js";import{t as g}from"./use-rtl-DmLOB8yh.js";import{n as _}from"./light-BEgX6Sgz.js";import{t as v}from"./use-memo-DmtRaem4.js";import{t as y}from"./use-merged-state-DJUpMjRi.js";import{o as b,s as x,t as S}from"./use-form-item-C_qxd2Qt.js";import{t as C}from"./flatten-DaUbXSB2.js";import{t as w}from"./get-slot-D_wS2qGh.js";import{t as T}from"./light-C9OGlpw3.js";var E=u(`radio`,`
 line-height: var(--n-label-line-height);
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 align-items: flex-start;
 flex-wrap: nowrap;
 font-size: var(--n-font-size);
 word-break: break-word;
`,[s(`checked`,[h(`dot`,`
 background-color: var(--n-color-active);
 `)]),h(`dot-wrapper`,`
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `),u(`radio-input`,`
 position: absolute;
 border: 0;
 width: 0;
 height: 0;
 opacity: 0;
 margin: 0;
 `),h(`dot`,`
 position: absolute;
 top: 50%;
 left: 0;
 transform: translateY(-50%);
 height: var(--n-radio-size);
 width: var(--n-radio-size);
 background: var(--n-color);
 box-shadow: var(--n-box-shadow);
 border-radius: 50%;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `,[l(`&::before`,`
 content: "";
 opacity: 0;
 position: absolute;
 left: 4px;
 top: 4px;
 height: calc(100% - 8px);
 width: calc(100% - 8px);
 border-radius: 50%;
 transform: scale(.8);
 background: var(--n-dot-color-active);
 transition: 
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),s(`checked`,{boxShadow:`var(--n-box-shadow-active)`},[l(`&::before`,`
 opacity: 1;
 transform: scale(1);
 `)])]),h(`label`,`
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `),f(`disabled`,`
 cursor: pointer;
 `,[l(`&:hover`,[h(`dot`,{boxShadow:`var(--n-box-shadow-hover)`})]),s(`focus`,[l(`&:not(:active)`,[h(`dot`,{boxShadow:`var(--n-box-shadow-focus)`})])])]),s(`disabled`,`
 cursor: not-allowed;
 `,[h(`dot`,{boxShadow:`var(--n-box-shadow-disabled)`,backgroundColor:`var(--n-color-disabled)`},[l(`&::before`,{backgroundColor:`var(--n-dot-color-disabled)`}),s(`checked`,`
 opacity: 1;
 `)]),h(`label`,{color:`var(--n-text-color-disabled)`}),u(`radio-input`,`
 cursor: not-allowed;
 `)])]),D={name:String,value:{type:[String,Number,Boolean],default:`on`},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},O=d(`n-radio-group`);function k(t){let n=e(O,null),{mergedClsPrefixRef:a,mergedComponentPropsRef:o}=p(t),s=S(t,{mergedSize(e){var r,i;let{size:a}=t;if(a!==void 0)return a;if(n){let{mergedSizeRef:{value:e}}=n;if(e!==void 0)return e}return e?e.mergedSize.value:((i=(r=o==null?void 0:o.value)==null?void 0:r.Radio)==null?void 0:i.size)||`medium`},mergedDisabled(e){return!!(t.disabled||n!=null&&n.disabledRef.value||e!=null&&e.disabled.value)}}),{mergedSizeRef:c,mergedDisabledRef:l}=s,u=i(null),d=i(null),f=i(t.defaultChecked),m=y(r(t,`checked`),f),h=v(()=>n?n.valueRef.value===t.value:m.value),g=v(()=>{let{name:e}=t;if(e!==void 0)return e;if(n)return n.nameRef.value}),_=i(!1);function b(){if(n){let{doUpdateValue:e}=n,{value:r}=t;x(e,r)}else{let{onUpdateChecked:e,"onUpdate:checked":n}=t,{nTriggerFormInput:r,nTriggerFormChange:i}=s;e&&x(e,!0),n&&x(n,!0),r(),i(),f.value=!0}}function C(){l.value||h.value||b()}function w(){C(),u.value&&(u.value.checked=h.value)}function T(){_.value=!1}function E(){_.value=!0}return{mergedClsPrefix:n?n.mergedClsPrefixRef:a,inputRef:u,labelRef:d,mergedName:g,mergedDisabled:l,renderSafeChecked:h,focus:_,mergedSize:c,handleRadioInputChange:w,handleRadioInputBlur:T,handleRadioInputFocus:E}}var A=a({name:`Radio`,props:Object.assign(Object.assign({},m.props),D),setup(e){let t=k(e),r=m(`Radio`,`-radio`,E,T,e,t.mergedClsPrefix),i=n(()=>{let{mergedSize:{value:e}}=t,{common:{cubicBezierEaseInOut:n},self:{boxShadow:i,boxShadowActive:a,boxShadowDisabled:o,boxShadowFocus:s,boxShadowHover:l,color:u,colorDisabled:d,colorActive:f,textColor:p,textColorDisabled:m,dotColorActive:h,dotColorDisabled:g,labelPadding:_,labelLineHeight:v,labelFontWeight:y,[c(`fontSize`,e)]:b,[c(`radioSize`,e)]:x}}=r.value;return{"--n-bezier":n,"--n-label-line-height":v,"--n-label-font-weight":y,"--n-box-shadow":i,"--n-box-shadow-active":a,"--n-box-shadow-disabled":o,"--n-box-shadow-focus":s,"--n-box-shadow-hover":l,"--n-color":u,"--n-color-active":f,"--n-color-disabled":d,"--n-dot-color-active":h,"--n-dot-color-disabled":g,"--n-font-size":b,"--n-radio-size":x,"--n-text-color":p,"--n-text-color-disabled":m,"--n-label-padding":_}}),{inlineThemeDisabled:a,mergedClsPrefixRef:o,mergedRtlRef:s}=p(e),l=g(`Radio`,s,o),u=a?_(`radio`,n(()=>t.mergedSize.value[0]),i,e):void 0;return Object.assign(t,{rtlEnabled:l,cssVars:a?void 0:i,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender})},render(){let{$slots:e,mergedClsPrefix:t,onRender:n,label:r}=this;return n==null||n(),o(`label`,{class:[`${t}-radio`,this.themeClass,this.rtlEnabled&&`${t}-radio--rtl`,this.mergedDisabled&&`${t}-radio--disabled`,this.renderSafeChecked&&`${t}-radio--checked`,this.focus&&`${t}-radio--focus`],style:this.cssVars},o(`div`,{class:`${t}-radio__dot-wrapper`},`\xA0`,o(`div`,{class:[`${t}-radio__dot`,this.renderSafeChecked&&`${t}-radio__dot--checked`]}),o(`input`,{ref:`inputRef`,type:`radio`,class:`${t}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur})),b(e.default,e=>!e&&!r?null:o(`div`,{ref:`labelRef`,class:`${t}-radio__label`},e||r)))}}),j=a({name:`RadioButton`,props:D,setup:k,render(){let{mergedClsPrefix:e}=this;return o(`label`,{class:[`${e}-radio-button`,this.mergedDisabled&&`${e}-radio-button--disabled`,this.renderSafeChecked&&`${e}-radio-button--checked`,this.focus&&[`${e}-radio-button--focus`]]},o(`input`,{ref:`inputRef`,type:`radio`,class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur}),o(`div`,{class:`${e}-radio-button__state-border`}),b(this.$slots.default,t=>!t&&!this.label?null:o(`div`,{ref:`labelRef`,class:`${e}-radio__label`},t||this.label)))}}),M=u(`radio-group`,`
 display: inline-block;
 font-size: var(--n-font-size);
`,[h(`splitor`,`
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `,[s(`checked`,{backgroundColor:`var(--n-button-border-color-active)`}),s(`disabled`,{opacity:`var(--n-opacity-disabled)`})]),s(`button-group`,`
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[u(`radio-button`,{height:`var(--n-height)`,lineHeight:`var(--n-height)`}),h(`splitor`,{height:`var(--n-height)`})]),u(`radio-button`,`
 vertical-align: bottom;
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-block;
 box-sizing: border-box;
 padding-left: 14px;
 padding-right: 14px;
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background: var(--n-button-color);
 color: var(--n-button-text-color);
 border-top: 1px solid var(--n-button-border-color);
 border-bottom: 1px solid var(--n-button-border-color);
 `,[u(`radio-input`,`
 pointer-events: none;
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 `),h(`state-border`,`
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `),l(`&:first-child`,`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `,[h(`state-border`,`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]),l(`&:last-child`,`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `,[h(`state-border`,`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]),f(`disabled`,`
 cursor: pointer;
 `,[l(`&:hover`,[h(`state-border`,`
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `),f(`checked`,{color:`var(--n-button-text-color-hover)`})]),s(`focus`,[l(`&:not(:active)`,[h(`state-border`,{boxShadow:`var(--n-button-box-shadow-focus)`})])])]),s(`checked`,`
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `),s(`disabled`,`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]);function N(e,t,n){var r;let i=[],a=!1;for(let s=0;s<e.length;++s){let c=e[s],l=(r=c.type)==null?void 0:r.name;l===`RadioButton`&&(a=!0);let u=c.props;if(l!==`RadioButton`){i.push(c);continue}if(s===0)i.push(c);else{let e=i[i.length-1].props,r=t===e.value,a=e.disabled,s=t===u.value,l=u.disabled,d=(r?2:0)+ +!a,f=(s?2:0)+ +!l,p={[`${n}-radio-group__splitor--disabled`]:a,[`${n}-radio-group__splitor--checked`]:r},m={[`${n}-radio-group__splitor--disabled`]:l,[`${n}-radio-group__splitor--checked`]:s},h=d<f?m:p;i.push(o(`div`,{class:[`${n}-radio-group__splitor`,h]}),c)}}return{children:i,isButtonGroup:a}}var P=a({name:`RadioGroup`,props:Object.assign(Object.assign({},m.props),{name:String,value:[String,Number,Boolean],defaultValue:{type:[String,Number,Boolean],default:null},size:String,disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),setup(e){let a=i(null),{mergedSizeRef:o,mergedDisabledRef:s,nTriggerFormChange:l,nTriggerFormInput:u,nTriggerFormBlur:d,nTriggerFormFocus:f}=S(e),{mergedClsPrefixRef:h,inlineThemeDisabled:v,mergedRtlRef:b}=p(e),C=m(`Radio`,`-radio-group`,M,T,e,h),w=i(e.defaultValue),E=y(r(e,`value`),w);function D(t){let{onUpdateValue:n,"onUpdate:value":r}=e;n&&x(n,t),r&&x(r,t),w.value=t,l(),u()}function k(e){let{value:t}=a;t&&(t.contains(e.relatedTarget)||f())}function A(e){let{value:t}=a;t&&(t.contains(e.relatedTarget)||d())}t(O,{mergedClsPrefixRef:h,nameRef:r(e,`name`),valueRef:E,disabledRef:s,mergedSizeRef:o,doUpdateValue:D});let j=g(`Radio`,b,h),N=n(()=>{let{value:e}=o,{common:{cubicBezierEaseInOut:t},self:{buttonBorderColor:n,buttonBorderColorActive:r,buttonBorderRadius:i,buttonBoxShadow:a,buttonBoxShadowFocus:s,buttonBoxShadowHover:l,buttonColor:u,buttonColorActive:d,buttonTextColor:f,buttonTextColorActive:p,buttonTextColorHover:m,opacityDisabled:h,[c(`buttonHeight`,e)]:g,[c(`fontSize`,e)]:_}}=C.value;return{"--n-font-size":_,"--n-bezier":t,"--n-button-border-color":n,"--n-button-border-color-active":r,"--n-button-border-radius":i,"--n-button-box-shadow":a,"--n-button-box-shadow-focus":s,"--n-button-box-shadow-hover":l,"--n-button-color":u,"--n-button-color-active":d,"--n-button-text-color":f,"--n-button-text-color-hover":m,"--n-button-text-color-active":p,"--n-height":g,"--n-opacity-disabled":h}}),P=v?_(`radio-group`,n(()=>o.value[0]),N,e):void 0;return{selfElRef:a,rtlEnabled:j,mergedClsPrefix:h,mergedValue:E,handleFocusout:A,handleFocusin:k,cssVars:v?void 0:N,themeClass:P==null?void 0:P.themeClass,onRender:P==null?void 0:P.onRender}},render(){var e;let{mergedValue:t,mergedClsPrefix:n,handleFocusin:r,handleFocusout:i}=this,{children:a,isButtonGroup:s}=N(C(w(this)),t,n);return(e=this.onRender)==null||e.call(this),o(`div`,{onFocusin:r,onFocusout:i,ref:`selfElRef`,class:[`${n}-radio-group`,this.rtlEnabled&&`${n}-radio-group--rtl`,this.themeClass,s&&`${n}-radio-group--button-group`],style:this.cssVars},a)}});export{A as NRadio,j as NRadioButton,P as NRadioGroup};