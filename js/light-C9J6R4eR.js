import{fr as e,hn as t,vn as n,xn as r}from"../jse/index-index-jN-t5_md.js";import{B as i,I as a,L as o,V as s,t as c}from"./use-theme-DLQNGgsw.js";import{o as l,s as u}from"./Scrollbar-Ch5qQ9yl.js";import{o as d,t as f}from"./light-BEgX6Sgz.js";import{t as p}from"./light-BpXTM6vE.js";import{n as m}from"./Loading-BX9Cot5T.js";function h(e,...n){return typeof e==`function`?e(...n):typeof e==`string`?t(e):typeof e==`number`?t(String(e)):null}var g=l(`close`,()=>r(`svg`,{viewBox:`0 0 12 12`,version:`1.1`,xmlns:`http://www.w3.org/2000/svg`,"aria-hidden":!0},r(`g`,{stroke:`none`,"stroke-width":`1`,fill:`none`,"fill-rule":`evenodd`},r(`g`,{fill:`currentColor`,"fill-rule":`nonzero`},r(`path`,{d:`M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z`}))))),_=o(`base-close`,`
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`,[i(`absolute`,`
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `),a(`&::before`,`
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `),s(`disabled`,[a(`&:hover`,`
 color: var(--n-close-icon-color-hover);
 `),a(`&:hover::before`,`
 background-color: var(--n-close-color-hover);
 `),a(`&:focus::before`,`
 background-color: var(--n-close-color-hover);
 `),a(`&:active`,`
 color: var(--n-close-icon-color-pressed);
 `),a(`&:active::before`,`
 background-color: var(--n-close-color-pressed);
 `)]),i(`disabled`,`
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `),i(`round`,[a(`&::before`,`
 border-radius: 50%;
 `)])]),v=n({name:`BaseClose`,props:{isButtonTag:{type:Boolean,default:!0},clsPrefix:{type:String,required:!0},disabled:{type:Boolean,default:void 0},focusable:{type:Boolean,default:!0},round:Boolean,onClick:Function,absolute:Boolean},setup(t){return m(`-base-close`,_,e(t,`clsPrefix`)),()=>{let{clsPrefix:e,disabled:n,absolute:i,round:a,isButtonTag:o}=t;return r(o?`button`:`div`,{type:o?`button`:void 0,tabindex:n||!t.focusable?-1:0,"aria-disabled":n,"aria-label":`close`,role:o?void 0:`button`,disabled:n,class:[`${e}-base-close`,i&&`${e}-base-close--absolute`,n&&`${e}-base-close--disabled`,a&&`${e}-base-close--round`],onMousedown:e=>{t.focusable||e.preventDefault()},onClick:t.onClick},r(u,{clsPrefix:e},{default:()=>r(g,null)}))}}}),y={iconSizeTiny:`28px`,iconSizeSmall:`34px`,iconSizeMedium:`40px`,iconSizeLarge:`46px`,iconSizeHuge:`52px`};function b(e){let{textColorDisabled:t,iconColor:n,textColor2:r,fontSizeTiny:i,fontSizeSmall:a,fontSizeMedium:o,fontSizeLarge:s,fontSizeHuge:c}=e;return Object.assign(Object.assign({},y),{fontSizeTiny:i,fontSizeSmall:a,fontSizeMedium:o,fontSizeLarge:s,fontSizeHuge:c,textColor:t,iconColor:n,extraTextColor:r})}var x={name:`Empty`,common:f,self:b},S={closeIconSizeTiny:`12px`,closeIconSizeSmall:`12px`,closeIconSizeMedium:`14px`,closeIconSizeLarge:`14px`,closeSizeTiny:`16px`,closeSizeSmall:`16px`,closeSizeMedium:`18px`,closeSizeLarge:`18px`,padding:`0 7px`,closeMargin:`0 0 0 4px`};function C(e){let{textColor2:t,primaryColorHover:n,primaryColorPressed:r,primaryColor:i,infoColor:a,successColor:o,warningColor:s,errorColor:c,baseColor:l,borderColor:u,opacityDisabled:f,tagColor:p,closeIconColor:m,closeIconColorHover:h,closeIconColorPressed:g,borderRadiusSmall:_,fontSizeMini:v,fontSizeTiny:y,fontSizeSmall:b,fontSizeMedium:x,heightMini:C,heightTiny:w,heightSmall:T,heightMedium:E,closeColorHover:D,closeColorPressed:O,buttonColor2Hover:k,buttonColor2Pressed:A,fontWeightStrong:j}=e;return Object.assign(Object.assign({},S),{closeBorderRadius:_,heightTiny:C,heightSmall:w,heightMedium:T,heightLarge:E,borderRadius:_,opacityDisabled:f,fontSizeTiny:v,fontSizeSmall:y,fontSizeMedium:b,fontSizeLarge:x,fontWeightStrong:j,textColorCheckable:t,textColorHoverCheckable:t,textColorPressedCheckable:t,textColorChecked:l,colorCheckable:`#0000`,colorHoverCheckable:k,colorPressedCheckable:A,colorChecked:i,colorCheckedHover:n,colorCheckedPressed:r,border:`1px solid ${u}`,textColor:t,color:p,colorBordered:`rgb(250, 250, 252)`,closeIconColor:m,closeIconColorHover:h,closeIconColorPressed:g,closeColorHover:D,closeColorPressed:O,borderPrimary:`1px solid ${d(i,{alpha:.3})}`,textColorPrimary:i,colorPrimary:d(i,{alpha:.12}),colorBorderedPrimary:d(i,{alpha:.1}),closeIconColorPrimary:i,closeIconColorHoverPrimary:i,closeIconColorPressedPrimary:i,closeColorHoverPrimary:d(i,{alpha:.12}),closeColorPressedPrimary:d(i,{alpha:.18}),borderInfo:`1px solid ${d(a,{alpha:.3})}`,textColorInfo:a,colorInfo:d(a,{alpha:.12}),colorBorderedInfo:d(a,{alpha:.1}),closeIconColorInfo:a,closeIconColorHoverInfo:a,closeIconColorPressedInfo:a,closeColorHoverInfo:d(a,{alpha:.12}),closeColorPressedInfo:d(a,{alpha:.18}),borderSuccess:`1px solid ${d(o,{alpha:.3})}`,textColorSuccess:o,colorSuccess:d(o,{alpha:.12}),colorBorderedSuccess:d(o,{alpha:.1}),closeIconColorSuccess:o,closeIconColorHoverSuccess:o,closeIconColorPressedSuccess:o,closeColorHoverSuccess:d(o,{alpha:.12}),closeColorPressedSuccess:d(o,{alpha:.18}),borderWarning:`1px solid ${d(s,{alpha:.35})}`,textColorWarning:s,colorWarning:d(s,{alpha:.15}),colorBorderedWarning:d(s,{alpha:.12}),closeIconColorWarning:s,closeIconColorHoverWarning:s,closeIconColorPressedWarning:s,closeColorHoverWarning:d(s,{alpha:.12}),closeColorPressedWarning:d(s,{alpha:.18}),borderError:`1px solid ${d(c,{alpha:.23})}`,textColorError:c,colorError:d(c,{alpha:.1}),colorBorderedError:d(c,{alpha:.08}),closeIconColorError:c,closeIconColorHoverError:c,closeIconColorPressedError:c,closeColorHoverError:d(c,{alpha:.12}),closeColorPressedError:d(c,{alpha:.18})})}var w={name:`Tag`,common:f,self:C},T={paddingSingle:`0 26px 0 12px`,paddingMultiple:`3px 26px 0 12px`,clearSize:`16px`,arrowSize:`16px`};function E(e){let{borderRadius:t,textColor2:n,textColorDisabled:r,inputColor:i,inputColorDisabled:a,primaryColor:o,primaryColorHover:s,warningColor:c,warningColorHover:l,errorColor:u,errorColorHover:f,borderColor:p,iconColor:m,iconColorDisabled:h,clearColor:g,clearColorHover:_,clearColorPressed:v,placeholderColor:y,placeholderColorDisabled:b,fontSizeTiny:x,fontSizeSmall:S,fontSizeMedium:C,fontSizeLarge:w,heightTiny:E,heightSmall:D,heightMedium:O,heightLarge:k,fontWeight:A}=e;return Object.assign(Object.assign({},T),{fontSizeTiny:x,fontSizeSmall:S,fontSizeMedium:C,fontSizeLarge:w,heightTiny:E,heightSmall:D,heightMedium:O,heightLarge:k,borderRadius:t,fontWeight:A,textColor:n,textColorDisabled:r,placeholderColor:y,placeholderColorDisabled:b,color:i,colorDisabled:a,colorActive:i,border:`1px solid ${p}`,borderHover:`1px solid ${s}`,borderActive:`1px solid ${o}`,borderFocus:`1px solid ${s}`,boxShadowHover:`none`,boxShadowActive:`0 0 0 2px ${d(o,{alpha:.2})}`,boxShadowFocus:`0 0 0 2px ${d(o,{alpha:.2})}`,caretColor:o,arrowColor:m,arrowColorDisabled:h,loadingColor:o,borderWarning:`1px solid ${c}`,borderHoverWarning:`1px solid ${l}`,borderActiveWarning:`1px solid ${c}`,borderFocusWarning:`1px solid ${l}`,boxShadowHoverWarning:`none`,boxShadowActiveWarning:`0 0 0 2px ${d(c,{alpha:.2})}`,boxShadowFocusWarning:`0 0 0 2px ${d(c,{alpha:.2})}`,colorActiveWarning:i,caretColorWarning:c,borderError:`1px solid ${u}`,borderHoverError:`1px solid ${f}`,borderActiveError:`1px solid ${u}`,borderFocusError:`1px solid ${f}`,boxShadowHoverError:`none`,boxShadowActiveError:`0 0 0 2px ${d(u,{alpha:.2})}`,boxShadowFocusError:`0 0 0 2px ${d(u,{alpha:.2})}`,colorActiveError:i,caretColorError:u,clearColor:g,clearColorHover:_,clearColorPressed:v})}var D=c({name:`InternalSelection`,common:f,peers:{Popover:p},self:E});export{x as a,h as c,S as i,T as n,b as o,w as r,v as s,D as t};