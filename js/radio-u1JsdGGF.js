import{n as e}from"./chunk-BOhHC3M6.js";import{Cn as t,Ln as n,cn as r,fr as i,sr as a,vn as o,xn as s}from"../jse/index-index-BAw-JkTf.js";import{B as c,F as l,H as u,L as d,R as f,U as p,V as m,j as h,n as g}from"./use-theme-BFEHYfe_.js";import{t as _}from"./use-rtl-BxYLv7VF.js";import{n as v}from"./light-CkO-oKDR.js";import{t as y}from"./use-memo-CbJnENIF.js";import{t as b}from"./use-merged-state-Cub8xlhi.js";import{o as x,s as S,t as C}from"./use-form-item-B-TFSOGS.js";import{t as w}from"./flatten-Mdwzy8l9.js";import{t as T}from"./get-slot-Dcuup4e2.js";import{t as E}from"./light-w6G3alGx.js";var D=f(`radio`,`
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
`,[m(`checked`,[c(`dot`,`
 background-color: var(--n-color-active);
 `)]),c(`dot-wrapper`,`
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `),f(`radio-input`,`
 position: absolute;
 border: 0;
 width: 0;
 height: 0;
 opacity: 0;
 margin: 0;
 `),c(`dot`,`
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
 `,[d(`&::before`,`
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
 `),m(`checked`,{boxShadow:`var(--n-box-shadow-active)`},[d(`&::before`,`
 opacity: 1;
 transform: scale(1);
 `)])]),c(`label`,`
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `),u(`disabled`,`
 cursor: pointer;
 `,[d(`&:hover`,[c(`dot`,{boxShadow:`var(--n-box-shadow-hover)`})]),m(`focus`,[d(`&:not(:active)`,[c(`dot`,{boxShadow:`var(--n-box-shadow-focus)`})])])]),m(`disabled`,`
 cursor: not-allowed;
 `,[c(`dot`,{boxShadow:`var(--n-box-shadow-disabled)`,backgroundColor:`var(--n-color-disabled)`},[d(`&::before`,{backgroundColor:`var(--n-dot-color-disabled)`}),m(`checked`,`
 opacity: 1;
 `)]),c(`label`,{color:`var(--n-text-color-disabled)`}),f(`radio-input`,`
 cursor: not-allowed;
 `)])]),O={name:String,value:{type:[String,Number,Boolean],default:`on`},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},k=l(`n-radio-group`);function A(e){let n=t(k,null),{mergedClsPrefixRef:r,mergedComponentPropsRef:o}=h(e),s=C(e,{mergedSize(t){var r,i;let{size:a}=e;if(a!==void 0)return a;if(n){let{mergedSizeRef:{value:e}}=n;if(e!==void 0)return e}return t?t.mergedSize.value:((i=(r=o==null?void 0:o.value)==null?void 0:r.Radio)==null?void 0:i.size)||`medium`},mergedDisabled(t){return!!(e.disabled||n!=null&&n.disabledRef.value||t!=null&&t.disabled.value)}}),{mergedSizeRef:c,mergedDisabledRef:l}=s,u=a(null),d=a(null),f=a(e.defaultChecked),p=b(i(e,`checked`),f),m=y(()=>n?n.valueRef.value===e.value:p.value),g=y(()=>{let{name:t}=e;if(t!==void 0)return t;if(n)return n.nameRef.value}),_=a(!1);function v(){if(n){let{doUpdateValue:t}=n,{value:r}=e;S(t,r)}else{let{onUpdateChecked:t,"onUpdate:checked":n}=e,{nTriggerFormInput:r,nTriggerFormChange:i}=s;t&&S(t,!0),n&&S(n,!0),r(),i(),f.value=!0}}function x(){l.value||m.value||v()}function w(){x(),u.value&&(u.value.checked=m.value)}function T(){_.value=!1}function E(){_.value=!0}return{mergedClsPrefix:n?n.mergedClsPrefixRef:r,inputRef:u,labelRef:d,mergedName:g,mergedDisabled:l,renderSafeChecked:m,focus:_,mergedSize:c,handleRadioInputChange:w,handleRadioInputBlur:T,handleRadioInputFocus:E}}var j=o({name:`Radio`,props:Object.assign(Object.assign({},g.props),O),setup(e){let t=A(e),n=g(`Radio`,`-radio`,D,E,e,t.mergedClsPrefix),i=r(()=>{let{mergedSize:{value:e}}=t,{common:{cubicBezierEaseInOut:r},self:{boxShadow:i,boxShadowActive:a,boxShadowDisabled:o,boxShadowFocus:s,boxShadowHover:c,color:l,colorDisabled:u,colorActive:d,textColor:f,textColorDisabled:m,dotColorActive:h,dotColorDisabled:g,labelPadding:_,labelLineHeight:v,labelFontWeight:y,[p(`fontSize`,e)]:b,[p(`radioSize`,e)]:x}}=n.value;return{"--n-bezier":r,"--n-label-line-height":v,"--n-label-font-weight":y,"--n-box-shadow":i,"--n-box-shadow-active":a,"--n-box-shadow-disabled":o,"--n-box-shadow-focus":s,"--n-box-shadow-hover":c,"--n-color":l,"--n-color-active":d,"--n-color-disabled":u,"--n-dot-color-active":h,"--n-dot-color-disabled":g,"--n-font-size":b,"--n-radio-size":x,"--n-text-color":f,"--n-text-color-disabled":m,"--n-label-padding":_}}),{inlineThemeDisabled:a,mergedClsPrefixRef:o,mergedRtlRef:s}=h(e),c=_(`Radio`,s,o),l=a?v(`radio`,r(()=>t.mergedSize.value[0]),i,e):void 0;return Object.assign(t,{rtlEnabled:c,cssVars:a?void 0:i,themeClass:l==null?void 0:l.themeClass,onRender:l==null?void 0:l.onRender})},render(){let{$slots:e,mergedClsPrefix:t,onRender:n,label:r}=this;return n==null||n(),s(`label`,{class:[`${t}-radio`,this.themeClass,this.rtlEnabled&&`${t}-radio--rtl`,this.mergedDisabled&&`${t}-radio--disabled`,this.renderSafeChecked&&`${t}-radio--checked`,this.focus&&`${t}-radio--focus`],style:this.cssVars},s(`div`,{class:`${t}-radio__dot-wrapper`},`\xA0`,s(`div`,{class:[`${t}-radio__dot`,this.renderSafeChecked&&`${t}-radio__dot--checked`]}),s(`input`,{ref:`inputRef`,type:`radio`,class:`${t}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur})),x(e.default,e=>!e&&!r?null:s(`div`,{ref:`labelRef`,class:`${t}-radio__label`},e||r)))}}),M=o({name:`RadioButton`,props:O,setup:A,render(){let{mergedClsPrefix:e}=this;return s(`label`,{class:[`${e}-radio-button`,this.mergedDisabled&&`${e}-radio-button--disabled`,this.renderSafeChecked&&`${e}-radio-button--checked`,this.focus&&[`${e}-radio-button--focus`]]},s(`input`,{ref:`inputRef`,type:`radio`,class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur}),s(`div`,{class:`${e}-radio-button__state-border`}),x(this.$slots.default,t=>!t&&!this.label?null:s(`div`,{ref:`labelRef`,class:`${e}-radio__label`},t||this.label)))}}),N=f(`radio-group`,`
 display: inline-block;
 font-size: var(--n-font-size);
`,[c(`splitor`,`
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `,[m(`checked`,{backgroundColor:`var(--n-button-border-color-active)`}),m(`disabled`,{opacity:`var(--n-opacity-disabled)`})]),m(`button-group`,`
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[f(`radio-button`,{height:`var(--n-height)`,lineHeight:`var(--n-height)`}),c(`splitor`,{height:`var(--n-height)`})]),f(`radio-button`,`
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
 `,[f(`radio-input`,`
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
 `),c(`state-border`,`
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `),d(`&:first-child`,`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `,[c(`state-border`,`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]),d(`&:last-child`,`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `,[c(`state-border`,`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]),u(`disabled`,`
 cursor: pointer;
 `,[d(`&:hover`,[c(`state-border`,`
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `),u(`checked`,{color:`var(--n-button-text-color-hover)`})]),m(`focus`,[d(`&:not(:active)`,[c(`state-border`,{boxShadow:`var(--n-button-box-shadow-focus)`})])])]),m(`checked`,`
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `),m(`disabled`,`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]);function P(e,t,n){var r;let i=[],a=!1;for(let o=0;o<e.length;++o){let c=e[o],l=(r=c.type)==null?void 0:r.name;l===`RadioButton`&&(a=!0);let u=c.props;if(l!==`RadioButton`){i.push(c);continue}if(o===0)i.push(c);else{let e=i[i.length-1].props,r=t===e.value,a=e.disabled,o=t===u.value,l=u.disabled,d=(r?2:0)+ +!a,f=(o?2:0)+ +!l,p={[`${n}-radio-group__splitor--disabled`]:a,[`${n}-radio-group__splitor--checked`]:r},m={[`${n}-radio-group__splitor--disabled`]:l,[`${n}-radio-group__splitor--checked`]:o},h=d<f?m:p;i.push(s(`div`,{class:[`${n}-radio-group__splitor`,h]}),c)}}return{children:i,isButtonGroup:a}}var F=o({name:`RadioGroup`,props:Object.assign(Object.assign({},g.props),{name:String,value:[String,Number,Boolean],defaultValue:{type:[String,Number,Boolean],default:null},size:String,disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),setup(e){let t=a(null),{mergedSizeRef:o,mergedDisabledRef:s,nTriggerFormChange:c,nTriggerFormInput:l,nTriggerFormBlur:u,nTriggerFormFocus:d}=C(e),{mergedClsPrefixRef:f,inlineThemeDisabled:m,mergedRtlRef:y}=h(e),x=g(`Radio`,`-radio-group`,N,E,e,f),w=a(e.defaultValue),T=b(i(e,`value`),w);function D(t){let{onUpdateValue:n,"onUpdate:value":r}=e;n&&S(n,t),r&&S(r,t),w.value=t,c(),l()}function O(e){let{value:n}=t;n&&(n.contains(e.relatedTarget)||d())}function A(e){let{value:n}=t;n&&(n.contains(e.relatedTarget)||u())}n(k,{mergedClsPrefixRef:f,nameRef:i(e,`name`),valueRef:T,disabledRef:s,mergedSizeRef:o,doUpdateValue:D});let j=_(`Radio`,y,f),M=r(()=>{let{value:e}=o,{common:{cubicBezierEaseInOut:t},self:{buttonBorderColor:n,buttonBorderColorActive:r,buttonBorderRadius:i,buttonBoxShadow:a,buttonBoxShadowFocus:s,buttonBoxShadowHover:c,buttonColor:l,buttonColorActive:u,buttonTextColor:d,buttonTextColorActive:f,buttonTextColorHover:m,opacityDisabled:h,[p(`buttonHeight`,e)]:g,[p(`fontSize`,e)]:_}}=x.value;return{"--n-font-size":_,"--n-bezier":t,"--n-button-border-color":n,"--n-button-border-color-active":r,"--n-button-border-radius":i,"--n-button-box-shadow":a,"--n-button-box-shadow-focus":s,"--n-button-box-shadow-hover":c,"--n-button-color":l,"--n-button-color-active":u,"--n-button-text-color":d,"--n-button-text-color-hover":m,"--n-button-text-color-active":f,"--n-height":g,"--n-opacity-disabled":h}}),P=m?v(`radio-group`,r(()=>o.value[0]),M,e):void 0;return{selfElRef:t,rtlEnabled:j,mergedClsPrefix:f,mergedValue:T,handleFocusout:A,handleFocusin:O,cssVars:m?void 0:M,themeClass:P==null?void 0:P.themeClass,onRender:P==null?void 0:P.onRender}},render(){var e;let{mergedValue:t,mergedClsPrefix:n,handleFocusin:r,handleFocusout:i}=this,{children:a,isButtonGroup:o}=P(w(T(this)),t,n);return(e=this.onRender)==null||e.call(this),s(`div`,{onFocusin:r,onFocusout:i,ref:`selfElRef`,class:[`${n}-radio-group`,this.rtlEnabled&&`${n}-radio-group--rtl`,this.themeClass,o&&`${n}-radio-group--button-group`],style:this.cssVars},a)}}),I=e({NRadio:()=>j,NRadioButton:()=>M,NRadioGroup:()=>F});export{F as n,j as r,I as t};