'use client';
import {useEffect,useState,useRef} from 'react';
import {ArrowRight,Check,RotateCcw,Lightbulb,CheckCircle2} from 'lucide-react';

function MathText({text}:{text:string}){return <>{text.split(/(∥|\/\/|(?<![A-Z△∠])[A-Z]{2}(?![A-Z]))/g).map((part,i)=>part==='∥'||part==='//'?<span key={i} className="parallel-symbol" aria-label="평행"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 18L10 2M10 18L18 2"/></svg><span className="math-sr-only">∥</span></span>:/^[A-Z]{2}$/.test(part)&&part[0]!==part[1]?<span key={i} className="segment-name">{part}</span>:<span key={i}>{part}</span>)}</>}

type Step={label:string;title:string;source:string;target:string;choices:string[];question:string;reasons:string[];reason:number;hint:string;explain:string;worksheet?:string};
const areaSteps:Step[]=[
 {
  "label": "① 공통인 밑변",
  "title": "① 공통인 밑변",
  "source": "ACE",
  "target": "AE",
  "choices": [
   "AE",
   "AC"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "두 삼각형 모두 변 AE를 밑변으로 잡을 수 있어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "두 삼각형의 꼭짓점 이름에서 공통인 두 점을 찾으세요.",
  "explain": "△ACE와 △ABE에서 밑변 AE는 공통이다.",
  "worksheet": "△ACE와 △ABE에서 밑변 □는 공통이다."
 },
 {
  "label": "① 높이가 같은 이유",
  "title": "① 높이가 같은 이유",
  "source": "ABE",
  "target": "AE ∥ CB",
  "choices": [
   "AE ∥ CB",
   "AE ⟂ CB"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "C와 B가 밑변 AE와 평행한 같은 직선 위에 있어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "정사각형 ACDE의 AE와 AC는 수직이고, BC와 AC도 수직이에요.",
  "explain": "AE ∥ CB이므로 두 삼각형의 높이가 같다.",
  "worksheet": "□이므로 두 삼각형의 높이가 같다."
 },
 {
  "label": "② 같은 두 변",
  "title": "② 같은 두 변",
  "source": "ABE",
  "target": "AE = AC, AB = AF",
  "choices": [
   "AE = AC, AB = AF",
   "AE = AB, AC = AF"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "각 정사각형의 변의 길이는 모두 같아요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "정사각형 ACDE와 AFGB를 각각 보세요.",
  "explain": "△ABE와 △AFC에서 AE = AC, AB = AF이다.",
  "worksheet": "△ABE와 △AFC에서 □이다."
 },
 {
  "label": "② 끼인각 비교",
  "title": "② 끼인각 비교",
  "source": "AFC",
  "target": "∠EAB = ∠CAF = 90° + ∠CAB",
  "choices": [
   "∠EAB = ∠CAF = 90° + ∠CAB",
   "∠EAB = ∠CAF = ∠CAB"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "두 각은 모두 직각과 ∠CAB를 더한 각이에요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "AE ⟂ AC, AB ⟂ AF임을 이용하세요.",
  "explain": "∠EAB = ∠CAF = 90° + ∠CAB이다.",
  "worksheet": "□이다."
 },
 {
  "label": "② 합동 조건",
  "title": "② 합동 조건",
  "source": "AFC",
  "target": "SAS",
  "choices": [
   "SAS",
   "AAA"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "대응하는 두 변의 길이와 그 끼인각의 크기가 각각 같아요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "변 두 개와 그 사이의 각을 확인했어요.",
  "explain": "△ABE ≡ △AFC (SAS 합동)",
  "worksheet": "△ABE ≡ △AFC (□ 합동)"
 },
 {
  "label": "③ 공통인 밑변",
  "title": "③ 공통인 밑변",
  "source": "AFC",
  "target": "AF",
  "choices": [
   "AF",
   "AC"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "두 삼각형 모두 변 AF를 밑변으로 잡을 수 있어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "이 단계에서는 세로 방향의 변을 밑변으로 잡아요.",
  "explain": "△AFC와 △AFL에서 밑변 AF는 공통이다.",
  "worksheet": "△AFC와 △AFL에서 밑변 □는 공통이다."
 },
 {
  "label": "③ 높이가 같은 이유",
  "title": "③ 높이가 같은 이유",
  "source": "AFL",
  "target": "AF ∥ CM",
  "choices": [
   "AF ∥ CM",
   "AF ⟂ CM"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "C와 L은 AF와 평행한 직선 CM 위에 있어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "AF에 대한 높이는 가로 방향의 거리예요.",
  "explain": "AF ∥ CM이므로 두 삼각형의 높이가 같다.",
  "worksheet": "□이므로 두 삼각형의 높이가 같다."
 },
 {
  "label": "같은 넓이 연결",
  "title": "같은 넓이 연결",
  "source": "ACE",
  "target": "AFL",
  "choices": [
   "AFL",
   "ABC"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "△ACE → △ABE → △AFC → △AFL 순서로 넓이가 같아요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "앞에서 확인한 세 관계를 차례로 연결하세요.",
  "explain": "①, ②, ③에 의해 △ACE와 △AFL의 넓이가 같다.",
  "worksheet": "①, ②, ③에 의해 △ACE와 △□의 넓이가 같다."
 },
 {
  "label": "직사각형의 대각선",
  "title": "직사각형의 대각선",
  "source": "AFL",
  "target": "MFL",
  "choices": [
   "MFL",
   "ABL"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "직사각형의 대각선은 직사각형을 합동인 두 삼각형으로 나눠요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "LF의 반대쪽 삼각형을 찾아보세요.",
  "explain": "LF는 직사각형 AFML의 대각선이므로 △AFL과 △MFL의 넓이가 같다.",
  "worksheet": "LF는 직사각형 AFML의 대각선이므로 △AFL과 △□의 넓이가 같다."
 },
 {
  "label": "정사각형과 직사각형",
  "title": "정사각형과 직사각형",
  "source": "ACDE",
  "target": "AFML, LBGM",
  "choices": [
   "AFML, LBGM",
   "AFGB, AFML"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "각 사각형의 절반인 삼각형들의 넓이가 같으므로 전체 넓이도 같아요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "왼쪽 정사각형은 왼쪽 직사각형, 오른쪽 정사각형은 오른쪽 직사각형과 연결돼요.",
  "explain": "정사각형 ACDE = 직사각형 AFML / 정사각형 BHIC = 직사각형 LBGM",
  "worksheet": "정사각형 ACDE = 직사각형 □ / 정사각형 BHIC = 직사각형 □"
 },
 {
  "label": "두 넓이의 합",
  "title": "두 넓이의 합",
  "source": "SQUARE_SUM",
  "target": "직사각형 AFML + 직사각형 LBGM",
  "choices": [
   "직사각형 AFML + 직사각형 LBGM",
   "직사각형 AFML + 직사각형 AFML"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "큰 정사각형 AFGB는 두 직사각형 AFML과 LBGM으로 나뉘어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "L과 M을 잇는 선이 큰 정사각형을 둘로 나눠요.",
  "explain": "정사각형 AFGB = 직사각형 AFML + 직사각형 LBGM = 정사각형 ACDE + 정사각형 BHIC",
  "worksheet": "정사각형 AFGB = □ = 정사각형 ACDE + 정사각형 BHIC"
 },
 {
  "label": "피타고라스 정리 완성",
  "title": "피타고라스 정리 완성",
  "source": "SQUARE_SUM",
  "target": "c² = a² + b²",
  "choices": [
   "c² = a² + b²",
   "c = a + b"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "세 정사각형의 넓이는 각각 c², a², b²이에요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "변의 길이가 아니라 정사각형의 넓이를 더하세요.",
  "explain": "따라서 c² = a² + b²이다.",
  "worksheet": "따라서 □이다."
 }
];
const P:Record<string,[number,number]>={A:[0,0],B:[5,0],C:[1.8,2.4],D:[-.6,4.2],E:[-2.4,1.8],F:[0,-5],G:[5,-5],L:[1.8,0],M:[1.8,-5],H:[7.4,3.2],I:[4.2,5.6]};
const names:Record<string,string>={ACDE:'정사각형 ACDE',AFGB:'정사각형 AFGB',BHIC:'정사각형 BHIC',ICBH:'정사각형 BHIC',SQUARE_SUM:'두 작은 정사각형의 넓이의 합',RECTANGLE_SUM:'직사각형 AFML + 직사각형 LBGM',LEFT_TWICE:'직사각형 AFML + 직사각형 AFML',RIGHT_TWICE:'직사각형 LBGM + 직사각형 LBGM',TRIANGLE_SUM:'△ABC + △AFL',AFML:'직사각형 AFML',LBGM:'직사각형 LBGM'};
function shapeName(s:string){return names[s]??(/^[A-Z]{3}$/.test(s)?'△'+s:s)}
type FlashSelection={value:string;id:number;mode:Mode;index:number};
function GeometryFlash({points,selection}:{points:Record<string,[number,number]>;selection:FlashSelection|null}){
 if(!selection)return null;
 const items:{kind:'line'|'polygon'|'angle';vertices:string}[]=[];
 for(const match of selection.value.matchAll(/∠([A-Z]{3})|△([A-Z]{3})|(?<![A-Z])([A-Z]{2,4})(?![A-Z])/g)){
  const vertices=match[1]||match[2]||match[3];
  if([...vertices].every(k=>points[k]))items.push({kind:match[1]?'angle':vertices.length===2?'line':'polygon',vertices});
 }
 if(!items.length){
  const fallback=selection.mode==='application'?['AD','DE','AB','AB','AB','∠BAC ∠EAD','∠BAE','BAE','BAE'][selection.index]:selection.mode==='area'?(selection.index===4?'ABE AFC':'ACDE BHIC'):selection.index<=5?'ACD':selection.index<=9?'CBD':'ABC';
  for(const token of fallback.split(' ')){const vertices=token.replace('∠','');if([...vertices].every(k=>points[k]))items.push({kind:token.startsWith('∠')?'angle':vertices.length===2?'line':'polygon',vertices});}
 }
 return <g key={selection.id} className="selection-flash" aria-label="선택한 답의 도형 강조">{items.map(({kind,vertices},i)=>{
 const xy=[...vertices].map(k=>points[k]),pt=xy.map(p=>p.join(',')).join(' ');
 return kind==='polygon'?<polygon key={i} points={pt} className="flash-region"/>:kind==='angle'?<polyline key={i} points={pt} className="flash-line"/>:<line key={i} x1={xy[0][0]} y1={xy[0][1]} x2={xy[1][0]} y2={xy[1][1]} className="flash-line"/>;
 })}</g>
}
function Geometry({source,target,complete=false,selection=null}:{source:string;target:string;complete?:boolean;selection?:FlashSelection|null}){
 const q=(k:string):[number,number]=>[105+(P[k][0]+2.4)*33,245-P[k][1]*33];
 const pts=(s:string)=>[...s].map(q).map(v=>v.join(',')).join(' ');
 const valid=(s:string)=>s.length>=3&&[...s].every(k=>P[k]);
 const off:Record<string,[number,number]>={A:[-17,4],B:[9,7],C:[0,-12],D:[-6,-12],E:[-20,4],F:[-18,17],G:[8,17],L:[7,19],M:[-5,20],H:[10,5],I:[-3,-13]};
 return <svg viewBox="60 22 410 427" className="geometry" role="img" aria-label={'보조선과 정사각형 세 개가 있는 직각삼각형. 기준 '+shapeName(source)+(target?'와 선택 '+shapeName(target):'')}>
 <defs><pattern id="source-hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#a47800" strokeOpacity=".25" strokeWidth="1.5"/></pattern></defs>
 {valid(source)&&<polygon points={pts(source)} fill="#ffd75a" fillOpacity=".65"/>}
 {valid(source)&&<polygon points={pts(source)} fill="url(#source-hatch)"/>}
 {target&&valid(target)&&<polygon points={pts(target)} fill="#729ad9" fillOpacity=".5"/>}
 {(complete||source==='SQUARE_SUM')&&<><polygon points={pts('ACDE')} fill="#729ad9" fillOpacity=".55"/><polygon points={pts('ICBH')} fill="#ef8794" fillOpacity=".55"/></>}
 {(complete||target==='RECTANGLE_SUM')&&<><polygon points={pts('AFML')} fill="#729ad9" fillOpacity=".4"/><polygon points={pts('LBGM')} fill="#ef8794" fillOpacity=".4"/></>}
 {['ACDE','AFGB','ABC','BHIC'].map(s=><polygon key={s} points={pts(s)} fill="none" stroke="#364c59" strokeWidth="1.4" strokeLinejoin="round"/>)}
 {['CM','EC','EB','FC','FL',...(source==='ICBH'?['CH','AH','GC','GL']:[])].map(s=><line key={s} x1={q(s[0])[0]} y1={q(s[0])[1]} x2={q(s[1])[0]} y2={q(s[1])[1]} stroke="#84969d" strokeWidth="1"/>)}
 {valid(source)&&<polygon points={pts(source)} fill="none" stroke="#a47800" strokeWidth="2.6" strokeLinejoin="round"/>}
 {target&&valid(target)&&<polygon points={pts(target)} fill="none" stroke="#123f85" strokeWidth="2.8" strokeLinejoin="round"/>}
 <GeometryFlash points={Object.fromEntries(Object.keys(P).map(k=>[k,q(k)]))} selection={selection}/>
 {Object.keys(P).map(k=><text key={k} x={q(k)[0]+off[k][0]} y={q(k)[1]+off[k][1]}>{k}</text>)}
 <path d={`M ${q('C')[0]-5.4} ${q('C')[1]+7.2} l 7.2 5.4 5.4 -7.2`} fill="none" stroke="#364c59" strokeWidth="1.1"/>
 <text className="side-label" x="199" y="196">b</text><text className="side-label" x="292" y="213">a</text><text className="side-label" x="277" y="265">c</text>
 </svg>
}
const similaritySteps:Step[]=[
 {
  "label": "같은 두 직각",
  "title": "같은 두 직각",
  "source": "ABC",
  "target": "∠ACB = ∠ADC = 90°",
  "choices": [
   "∠ACB = ∠ADC = 90°",
   "∠ABC = ∠ACD = 90°"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "∠C는 주어진 직각이고 CD는 AB에 내린 수선이에요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "직각 표시가 있는 두 꼭짓점을 찾으세요.",
  "explain": "△ABC와 △ACD에서 ∠ACB = ∠ADC = 90°이다.",
  "worksheet": "△ABC와 △ACD에서 □이다."
 },
 {
  "label": "공통인 각",
  "title": "공통인 각",
  "source": "ACD",
  "target": "∠BAC = ∠CAD",
  "choices": [
   "∠BAC = ∠CAD",
   "∠ABC = ∠CAD"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "D가 AB 위에 있으므로 반직선 AB와 AD의 방향이 같아요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "꼭짓점 A의 각을 두 삼각형에서 살펴보세요.",
  "explain": "∠BAC = ∠CAD이다. (공통각)",
  "worksheet": "□이다. (공통각)"
 },
 {
  "label": "첫 번째 닮음",
  "title": "첫 번째 닮음",
  "source": "ABC",
  "target": "△ABC ∽ △ACD (AA 닮음)",
  "choices": [
   "△ABC ∽ △ACD (AA 닮음)",
   "△ABC ∽ △ADC (AA 닮음)"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "A ↔ A, B ↔ C, C ↔ D로 두 쌍의 대응각이 같아요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "직각 C와 D가 같은 순서에 와야 해요.",
  "explain": "따라서 △ABC ∽ △ACD (AA 닮음)이다.",
  "worksheet": "따라서 □이다."
 },
 {
  "label": "첫 번째 대응변",
  "title": "첫 번째 대응변",
  "source": "ACD",
  "target": "AD, AC",
  "choices": [
   "AD, AC",
   "AC, AD"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "닮음의 대응 순서에 따라 AC ↔ AD, AB ↔ AC예요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "ABC 아래에 ACD를 나란히 적어 보세요.",
  "explain": "AC : AD = AB : AC",
  "worksheet": "AC : □ = AB : □"
 },
 {
  "label": "문자로 비례식 쓰기",
  "title": "문자로 비례식 쓰기",
  "source": "ACD",
  "target": "b : p = c : b",
  "choices": [
   "b : p = c : b",
   "b : q = c : a"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "AC = b, AD = p, AB = c를 대입해요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "선분 이름을 도형에 쓰인 길이 문자로 바꾸세요.",
  "explain": "그러므로 b : p = c : b이다.",
  "worksheet": "그러므로 □이다."
 },
 {
  "label": "① b의 제곱",
  "title": "① b의 제곱",
  "source": "ACD",
  "target": "pc",
  "choices": [
   "pc",
   "qc"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "비례식의 외항의 곱과 내항의 곱은 같으므로 b × b = p × c예요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "b : p = c : b에서 내항 p와 c를 곱하세요.",
  "explain": "즉, b² = pc …… ①",
  "worksheet": "즉, b² = □ …… ①"
 },
 {
  "label": "두 번째 닮음",
  "title": "두 번째 닮음",
  "source": "ABC",
  "target": "△ABC ∽ △CBD (AA 닮음)",
  "choices": [
   "△ABC ∽ △CBD (AA 닮음)",
   "△ABC ∽ △BCD (AA 닮음)"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "B의 각은 같고 C와 D는 직각이므로 A ↔ C, B ↔ B, C ↔ D예요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "이번에는 꼭짓점 B를 공유하는 작은 삼각형을 보세요.",
  "explain": "같은 방법으로 △ABC ∽ △CBD (AA 닮음)이다.",
  "worksheet": "같은 방법으로 □이다."
 },
 {
  "label": "두 번째 대응변",
  "title": "두 번째 대응변",
  "source": "CBD",
  "target": "BD, CB",
  "choices": [
   "BD, CB",
   "CD, BD"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "BC ↔ BD, BA ↔ BC이며 CB와 BC는 같은 선분이에요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "ABC 아래에 CBD를 나란히 적어 보세요.",
  "explain": "BC : BD = BA : CB",
  "worksheet": "BC : □ = BA : □"
 },
 {
  "label": "두 번째 비례식",
  "title": "두 번째 비례식",
  "source": "CBD",
  "target": "a : q = c : a",
  "choices": [
   "a : q = c : a",
   "a : p = c : b"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "BC = a, BD = q, BA = c를 대입해요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "앞에서 고른 대응변을 길이 문자로 바꾸세요.",
  "explain": "그러므로 a : q = c : a이다.",
  "worksheet": "그러므로 □이다."
 },
 {
  "label": "② a의 제곱",
  "title": "② a의 제곱",
  "source": "CBD",
  "target": "qc",
  "choices": [
   "qc",
   "pc"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "비례식의 외항의 곱과 내항의 곱이 같으므로 a × a = q × c예요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "내항 q와 c를 곱하세요.",
  "explain": "즉, a² = qc …… ②",
  "worksheet": "즉, a² = □ …… ②"
 },
 {
  "label": "①과 ② 더하기",
  "title": "①과 ② 더하기",
  "source": "ABC",
  "target": "pc + qc",
  "choices": [
   "pc + qc",
   "pc − qc"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "a² = qc, b² = pc를 대입하고 덧셈의 순서를 바꿀 수 있어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "두 식을 더한 뒤 순서를 바꿔도 같은 식이에요.",
  "explain": "①, ②에서 a² + b² = pc + qc",
  "worksheet": "①, ②에서 a² + b² = □"
 },
 {
  "label": "공통 인수로 묶기",
  "title": "공통 인수로 묶기",
  "source": "ABC",
  "target": "(p + q)c",
  "choices": [
   "(p + q)c",
   "(p − q)c"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "분배법칙을 거꾸로 사용하여 공통인 c를 묶어요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "두 항에 공통으로 들어 있는 c를 찾으세요.",
  "explain": "a² + b² = pc + qc = (p + q)c",
  "worksheet": "a² + b² = pc + qc = □"
 },
 {
  "label": "빗변의 제곱",
  "title": "빗변의 제곱",
  "source": "ABC",
  "target": "c²",
  "choices": [
   "c²",
   "2c"
  ],
  "question": "학교 유인물의 빈칸에 들어갈 내용을 고르세요.",
  "reasons": [
   "p + q = c를 대입하면 (p + q)c = c × c = c²이에요.",
   "그림에서 비슷하게 보이므로 조건을 확인하지 않아도 돼요."
  ],
  "reason": 0,
  "hint": "AD + DB = AB를 이용하세요.",
  "explain": "p + q = c이므로 a² + b² = c²",
  "worksheet": "p + q = c이므로 a² + b² = □"
 }
];
function AnswerSlot({expected,value}:{expected:string;value:string}){return <span className={value?'proof-slot filled':'proof-slot'}><span className="slot-measure" aria-hidden="true"><MathText text={expected}/></span><span className="slot-content">{value?<MathText text={value}/>: '?'}</span></span>}
function WorksheetBlank({line,answer,expected}:{line:string;answer:string;expected:string}){const multiple=line.split('□').length>2,values=multiple?answer.split(', '):[answer],expectedValues=multiple?expected.split(', '):[expected];return <div className="proof-blank" aria-label="학교 유인물 빈칸"><div>{line.split('□').map((part,i)=><span key={i}>{i>0&&<AnswerSlot expected={expectedValues[i-1]} value={answer?values[i-1]:''}/>}<MathText text={part}/></span>)}</div></div>}
const applicationSteps:Step[]=[
{"label": "대응변 하나씩", "title": "BC에 대응하는 변의 길이는?", "source": "ABC", "target": "4", "choices": ["4", "6"], "question": "△ABC ≡ △EAD에서 B ↔ A, C ↔ D예요. BC에 대응하는 변 AD의 길이는 얼마일까요?", "reasons": ["합동인 두 삼각형에서 대응하는 변의 길이는 같아요.", "같은 도형 안의 모든 변의 길이는 같아요."], "reason": 0, "hint": "BC의 두 끝점 B, C를 각각 A, D로 바꾸면 AD예요.", "explain": "BC ↔ AD이고 BC = 4이므로 AD = 4입니다."},
{"label": "두 번째 대응변", "title": "CA에 대응하는 변의 길이는?", "source": "ABC", "target": "6", "choices": ["6", "4"], "question": "이번에는 C ↔ D, A ↔ E예요. CA에 대응하는 변 DE의 길이는 얼마일까요?", "reasons": ["CA와 DE는 서로 대응하는 변이므로 길이가 같아요.", "4와 6을 더하면 DE의 길이가 돼요."], "reason": 0, "hint": "CA의 두 끝점 C, A를 각각 D, E로 바꾸세요.", "explain": "CA ↔ DE이고 CA = 6이므로 DE = 6입니다."},
{"label": "두 빗변의 관계", "title": "AE와 길이가 같은 변은?", "source": "ABC", "target": "AB", "choices": ["AB", "BC"], "question": "A ↔ E, B ↔ A이므로 AB와 EA가 서로 대응하는 변이에요. AE와 길이가 같은 변을 고르세요.", "reasons": ["합동인 두 삼각형에서 대응하는 빗변의 길이는 같아요.", "빗변은 항상 다른 변보다 길이가 짧아요."], "reason": 0, "hint": "EA와 AE는 같은 선분이에요.", "explain": "AB ↔ EA이므로 AB = AE입니다. 나중에 넓이를 구할 때 사용합니다."},
{"label": "빗변 찾기", "title": "직각의 맞은편 변은?", "source": "ABC", "target": "AB", "choices": ["AB", "BC", "CA"], "question": "노란 삼각형에서 ∠C가 직각이에요. C에 닿지 않는 맞은편 변, 즉 빗변을 찾아보세요.", "reasons": ["직각의 맞은편에 있는 변이 빗변이에요.", "세로로 그린 변이 언제나 빗변이에요."], "reason": 0, "hint": "C에 닿는 BC와 CA를 제외하면 어느 변이 남나요?", "explain": "직각 C의 맞은편 변 AB가 빗변입니다. 따라서 AB² = BC² + CA²입니다."},
{"label": "제곱 계산", "title": "16과 36을 더해 볼까요?", "source": "ABC", "target": "52", "choices": ["52", "20"], "question": "빗변 AB의 제곱은 4² + 6²이에요. 4² = 16, 6² = 36이므로 빈칸을 채우세요.", "reasons": ["빗변의 제곱은 직각을 끼는 두 변의 제곱을 더해요.", "빗변의 제곱은 두 변의 제곱을 빼요."], "reason": 0, "hint": "16 + 36을 계산하세요. 아직 AB 자체의 길이는 구하지 않아도 돼요.", "explain": "AB² = 4² + 6² = 16 + 36 = 52입니다."},
{"label": "두 예각의 합", "title": "같은 각으로 바꾸어 생각해요", "source": "ABC", "target": "90°", "choices": ["90°", "180°"], "question": "직각삼각형에서 ∠BAC + ∠ABC = 90°예요. 합동이므로 ∠ABC = ∠EAD입니다. ∠ABC를 ∠EAD로 바꾸면 합은 얼마일까요?", "reasons": ["같은 크기의 각으로 바꾸어도 합은 그대로예요.", "각의 이름이 바뀌면 합은 두 배가 돼요."], "reason": 0, "hint": "∠ABC와 ∠EAD는 크기가 같으므로 서로 바꿔 넣을 수 있어요.", "explain": "∠BAC + ∠EAD = 90°입니다."},
{"label": "가운데 각", "title": "일직선의 180°에서 빼요", "source": "BAE", "target": "90°", "choices": ["90°", "45°"], "question": "C·A·D는 한 직선이므로 A 위쪽의 세 각의 합은 180°예요. 양옆 두 각의 합이 90°라면 가운데 ∠BAE는 얼마일까요?", "reasons": ["가운데 각은 180°에서 양옆 두 각의 합을 빼요.", "가운데 각은 양옆 두 각의 합을 2로 나눠요."], "reason": 0, "hint": "180° − 90°를 계산하세요.", "explain": "∠BAE = 180° − (∠BAC + ∠EAD) = 180° − 90° = 90°입니다."},
{"label": "밑변과 높이", "title": "직각을 이루는 두 변을 곱해요", "source": "BAE", "target": "½ × AB × AE", "choices": ["½ × AB × AE", "½ × BC × CA"], "question": "이제 ∠BAE가 직각임을 알았어요. △ABE에서 직각을 끼는 AB와 AE를 이용해 넓이 식을 고르세요.", "reasons": ["삼각형의 넓이는 밑변 × 높이 ÷ 2예요.", "삼각형의 넓이는 밑변과 높이를 더해요."], "reason": 0, "hint": "노란 △ABE의 직각은 A에 있고, AB와 AE가 서로 수직이에요.", "explain": "AB와 AE를 밑변과 높이로 잡으면 △ABE의 넓이는 ½ × AB × AE입니다."},
{"label": "마지막 계산", "title": "같은 길이를 제곱으로 바꿔요", "source": "BAE", "target": "26", "choices": ["26", "52"], "question": "AB = AE이므로 AB × AE = AB²이에요. 앞에서 AB² = 52를 구했지요. 52의 절반은 얼마일까요?", "reasons": ["52를 2로 나누면 삼각형의 넓이가 돼요.", "52가 그대로 삼각형의 넓이예요."], "reason": 0, "hint": "½ × 52 = 52 ÷ 2를 계산하세요.", "explain": "△ABE의 넓이 = ½ × AB × AE = ½ × AB² = ½ × 52 = 26입니다."},
];
const applicationLines=["AD = □", "DE = □", "AE = □", "△ABC의 빗변은 □", "AB² = 4² + 6² = 16 + 36 = □", "∠BAC + ∠EAD = □", "∠BAE = 180° − 90° = □", "△ABE의 넓이 = □", "△ABE의 넓이 = ½ × 52 = □"];
for (const list of [areaSteps,similaritySteps,applicationSteps]) list.forEach((step,i)=>{const n=(i+1)%step.choices.length,r=(i*3+1)%step.reasons.length;step.choices=[...step.choices.slice(n),...step.choices.slice(0,n)];step.reasons=[...step.reasons.slice(r),...step.reasons.slice(0,r)];step.reason=(step.reason-r+step.reasons.length)%step.reasons.length;});
const modeNames={area:'① 넓이로 증명',similarity:'② 닮음으로 증명',application:'③ 넓이 구하기'};
type Mode=keyof typeof modeNames;
function OtherGeometry({mode,source,target,guideIndex=-1,selection=null}:{mode:Mode;source:string;target:string;guideIndex?:number;selection?:FlashSelection|null}){
 const points:Record<string,[number,number]>=mode==='similarity'?{A:[45,270],B:[345,270],C:[153,126],D:[153,270]}:{C:[50,300],B:[50,180],A:[230,300],D:[350,300],E:[350,120]};
 const pt=(s:string)=>[...s].map(k=>points[k]?.join(',')).join(' ');
 const good=(s:string)=>/^[A-Z]{3}$/.test(s)&&[...s].every(k=>points[k]);
 const offsets:Record<string,[number,number]>=mode==='similarity'?{A:[-17,7],B:[8,7],C:[-3,-13],D:[-4,22]}:{A:[-5,21],B:[-18,-3],C:[-17,17],D:[6,16],E:[3,-10]};
 return <svg viewBox="15 75 380 280" className="geometry other-geometry" role="img" aria-label={mode==='similarity'?'직각삼각형 ABC와 높이 CD':'합동 직각삼각형 ABC와 EAD로 만든 사다리꼴'}>
 {good(source)&&<polygon points={pt(source)} fill="#ffd75a" fillOpacity=".65" stroke="#a47800" strokeWidth="2"/>}
 {good(target)&&<polygon points={pt(target)} fill="#729ad9" fillOpacity=".5" stroke="#123f85" strokeWidth="2"/>}
 {mode==='similarity'?<><polygon points={pt('ABC')} fill="none" stroke="#364c59" strokeWidth="1.6"/><path d="M153 126V270m0-10h10v10" fill="none" stroke="#84969d" strokeWidth="1.2"/><path d="M147.6 133.2l7.2 5.4 5.4-7.2" fill="none" stroke="#364c59" strokeWidth="1.1"/><text x="84" y="195">b</text><text x="260" y="195">a</text><text x="100" y="295">p</text><text x="260" y="295">q</text><text x="203" y="329">c</text><path d="M45 313H345" stroke="#a1ada6" strokeDasharray="3 4"/><text x="73" y="262">○</text><text x="315" y="262">×</text><text x="134" y="165">×</text><text x="161" y="165">○</text></>:<><polygon points={pt('CDEB')} fill="none" stroke="#364c59" strokeWidth="1.6"/><path d="M50 180L230 300L350 120M50 290h10v10m280 0v-10h10" fill="none" stroke="#364c59" strokeWidth="1.3"/><text x="28" y="247">4</text><text x="135" y="325">6</text></>}
 {mode==='application'&&guideIndex>=0&&<>{guideIndex<3&&<polygon points={pt('EAD')} fill='#729ad9' fillOpacity='.45'/>}{guideIndex>=1&&<text x='283' y='325'>4</text>}{guideIndex>=2&&<text x='360' y='217'>6</text>}{guideIndex>=3&&guideIndex<=4&&<line x1='50' y1='180' x2='230' y2='300' stroke='#d7192d' strokeWidth='4'/>}{guideIndex>=5&&guideIndex<=6&&<><path d='M200 280Q195 290 195 300' fill='none' stroke='#d7192d' strokeWidth='3'/><path d='M246 275Q256 284 260 300' fill='none' stroke='#123f85' strokeWidth='3'/></>}{guideIndex>=7&&<path d='M50 180L230 300L350 120M215 290l10-15 15 10' fill='none' stroke='#d7192d' strokeWidth='3'/>}</>}
 <GeometryFlash points={points} selection={selection}/>
 {Object.keys(points).map(k=><text key={k} x={points[k][0]+offsets[k][0]} y={points[k][1]+offsets[k][1]}>{k}</text>)}
 </svg>
}
function SimilarityComparison({index,revealed}:{index:number;revealed:boolean}){
 const left=index<3,aligned=revealed||index%3!==0;
 const base=145,smallBase=left?87:116;
 const big:[[number,number],[number,number],[number,number]]=[[22,140],[167,140],[74.2,70.4]];
 const small:[[number,number],[number,number],[number,number]]=aligned?[[212,140],[212+smallBase,140],[212+smallBase*.36,140-smallBase*.48]]:left?[[212,140],[264.2,70.4],[264.2,140]]:[[212,70.4],[304.8,140],[212,140]];
 const labels=left?['A','C','D']:['C','B','D'];
 const poly=(points:[number,number][])=>points.map(p=>p.join(',')).join(' ');
 function rightMark(points:[number,number][],at:number){const v=points[at],others=points.filter((_,i)=>i!==at);const u=others.map(p=>{const d=Math.hypot(p[0]-v[0],p[1]-v[1]);return [(p[0]-v[0])/d*6,(p[1]-v[1])/d*6]});return <path d={`M${v[0]+u[0][0]},${v[1]+u[0][1]}l${u[1][0]},${u[1][1]}l${-u[0][0]},${-u[0][1]}`} fill="none" stroke="#123f85"/>}
 return <div className="similarity-comparison"><svg viewBox="0 0 360 175" role="img" aria-label={`같은 축척으로 그린 왼쪽 삼각형 ABC와 오른쪽 삼각형 ${left?'ACD':'CBD'}`}><text x="94" y="20" textAnchor="middle" className="comparison-caption">큰 삼각형</text><text x="270" y="20" textAnchor="middle" className="comparison-caption">작은 삼각형</text><polygon points={poly(big)} fill="#ffd75a" fillOpacity=".7" stroke="#9c7000" strokeWidth="1.5"/><polygon points={poly(small)} fill="#729ad9" fillOpacity=".55" stroke="#123f85" strokeWidth="1.5"/>{rightMark(big,2)}{rightMark(small,2)}<text x="39" y="135">○</text><text x="145" y="135">×</text><text x={small[0][0]+10} y={small[0][1]+(aligned?-5:left?-5:19)}>○</text><text x={small[1][0]+(aligned?-20:left?-6:-21)} y={small[1][1]+(aligned?-5:left?19:-5)}>×</text>{big.map((v,i)=><text key={'big'+i} x={v[0]+(i===0?-10:i===1?9:0)} y={v[1]+(i===2?-9:14)} textAnchor="middle">{['A','B','C'][i]}</text>)}{small.map((v,i)=><text key={'small'+i} x={v[0]+(aligned?(i===0?-9:i===1?9:0):i===1?9:-9)} y={v[1]+(aligned&&i===2?-9:!aligned&&((left&&i===1)||(!left&&i===0))?-9:14)} textAnchor="middle">{labels[i]}</text>)}<text x="94" y="164" textAnchor="middle">c</text><text x="38" y="102">b</text><text x="128" y="102">a</text>{aligned?<><text x={212+smallBase/2} y="164" textAnchor="middle">{left?'b':'a'}</text><text x={212+smallBase*.18-12} y={140-smallBase*.24}>{left?'p':'CD'}</text><text x={212+smallBase*.68+5} y={140-smallBase*.24}>{left?'CD':'q'}</text></>:left?<><text x="223" y="98">b</text><text x="238" y="164">p</text></>:<><text x="274" y="100">a</text><text x="258" y="164">q</text></>}</svg><p>{aligned?'대응하는 꼭짓점의 위치를 맞췄어요. 크기 비율은 그대로입니다.':'두 삼각형의 직각과 같은 각을 찾아 대응 순서를 생각하세요.'}</p></div>
}
function AreaSummary(){return <div className="area-summary"><div className="area-summary-heading">두 정사각형에서 큰 정사각형까지</div><div className="summary-row"><span className="summary-term left-area">정사각형 ACDE<br/><b>b²</b></span><span>+</span><span className="summary-term right-area">정사각형 BHIC<br/><b>a²</b></span></div><div className="summary-arrow">↓ 각각 넓이가 같아요 ↓</div><div className="summary-row"><span className="summary-term left-area">직사각형 AFML<br/><b>b²</b></span><span>+</span><span className="summary-term right-area">직사각형 LBGM<br/><b>a²</b></span></div><div className="summary-arrow">↓ 빈틈없이 합치면 ↓</div><div className="summary-whole">큰 정사각형 AFGB <b>c²</b></div><div className="summary-equation">b² + a² = c²</div></div>}

const STORAGE='eagle-pythagoras-school-v1';
export default function Page(){
 const [savedModes,setSavedModes]=useState<Partial<Record<Mode,{index:number;phase:'shape'|'reason'|'done';choice:string;reason:number;finished:boolean}>>>({});
 const [wrongItems,setWrongItems]=useState<string[]>([]),[completedModes,setCompletedModes]=useState<Mode[]>([]);
 const certificateRef=useRef<HTMLElement>(null),learningRef=useRef<HTMLElement>(null);
 const [studentName,setStudentName]=useState(''),[completedAt,setCompletedAt]=useState('');
 const [mode,setMode]=useState<Mode>('area');
 const [selection,setSelection]=useState<FlashSelection|null>(null);const selectionId=useRef(0);
 const [index,setIndex]=useState(0),[phase,setPhase]=useState<'shape'|'reason'|'done'>('shape'),[choice,setChoice]=useState(''),[reason,setReason]=useState(-1),[message,setMessage]=useState(''),[hint,setHint]=useState(false),[attempts,setAttempts]=useState(0),[finished,setFinished]=useState(false),[ready,setReady]=useState(false),[resetConfirm,setResetConfirm]=useState(false);
 const steps=mode==='area'?areaSteps:mode==='similarity'?similaritySteps:applicationSteps;
 const step=steps[index],last=index===steps.length-1,doneCount=finished?steps.length:index+(phase==='done'?1:0),isFormula=mode==='application'?true:mode==='similarity'?index!==0&&index!==3:!/^[A-Z_]+$/.test(step.target)||step.target.includes('_SUM');
 useEffect(()=>{try{const v=JSON.parse((localStorage.getItem(STORAGE)||'null').replace(/cp/g,'pc').replace(/cq/g,'qc'));if(v&&v.applicationGuide!==2){if(v.savedModes)delete v.savedModes.application;v.completedModes=(v.completedModes||[]).filter((m:string)=>m!=='application');v.wrongItems=(v.wrongItems||[]).filter((k:string)=>!k.startsWith('application:'));if(v.mode==='application'){v.index=0;v.phase='shape';v.choice='';v.reason=-1;v.finished=false;}}if(v&&Number.isInteger(v.index)&&v.index>=0&&v.index<(v.mode==='similarity'?similaritySteps.length:v.mode==='application'?applicationSteps.length:areaSteps.length)&&['shape','reason','done'].includes(v.phase)){setMode(v.mode==='similarity'?'similarity':v.mode==='application'?'application':'area');setIndex(v.index);setPhase(v.phase==='reason'?'done':v.phase);setChoice(v.choice||'');setReason(v.reason??-1);setAttempts(v.attempts||0);setFinished(Boolean(v.finished));setCompletedAt(v.completedAt||'');setSavedModes(Object.fromEntries(Object.entries(v.savedModes||{}).map(([key,value])=>{const item=value as {phase:string};return [key,{...item,phase:item.phase==='reason'?'done':item.phase}]})));setWrongItems((v.wrongItems||[]).filter((key:string)=>key.endsWith(':shape')));setCompletedModes(v.completedModes||[]);}}catch{}try{setStudentName(localStorage.getItem('eagle-student-name')||'')}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(STORAGE,JSON.stringify({applicationGuide:2,mode,index,phase,choice,reason,attempts,finished,completedAt,savedModes,wrongItems,completedModes}))}catch{}},[mode,index,phase,choice,reason,attempts,finished,completedAt,savedModes,wrongItems,completedModes,ready]);
 useEffect(()=>{if(ready)try{localStorage.setItem('eagle-student-name',studentName)}catch{}},[studentName,ready]);
 const totalItems=(areaSteps.length+similaritySteps.length+applicationSteps.length),allFinished=completedModes.length===3;
 const deduction=wrongItems.length/totalItems*100,totalScore=100-deduction;
 useEffect(()=>{if(allFinished)certificateRef.current?.scrollIntoView({behavior:'smooth',block:'start'})},[allFinished,mode]);
 useEffect(()=>{if(index>0&&!finished)learningRef.current?.scrollIntoView({behavior:'smooth',block:'start'})},[index,mode]);
 function markWrong(){const id=mode+':'+index+':'+phase;setWrongItems(v=>v.includes(id)?v:[...v,id]);setAttempts(v=>v+1)}
 function chooseAnswer(value:string){if(phase!=='shape')return;setSelection({value,id:++selectionId.current,mode,index});setChoice(value);setHint(false);if(value!==step.target){markWrong();setMessage('다시 골라 보세요.');return;}setPhase('done');setMessage('정답!');}
 useEffect(()=>{if(!ready||phase!=='done'||finished||resetConfirm)return;const timer=window.setTimeout(()=>next(),900);return ()=>window.clearTimeout(timer)},[ready,phase,finished,resetConfirm,mode,index]);
 function next(){setSelection(null);if(last){setCompletedAt(new Date().toISOString());setCompletedModes(v=>v.includes(mode)?v:[...v,mode]);setFinished(true);setMessage('');return}setIndex(v=>v+1);setPhase('shape');setChoice('');setReason(-1);setMessage('');setHint(false);}
 function switchMode(m:Mode){setSelection(null);setSavedModes(v=>({...v,[mode]:{index,phase,choice,reason,finished}}));const next=savedModes[m];setMode(m);setIndex(next?.index||0);setPhase(next?.phase||'shape');setChoice(next?.choice||'');setReason(next?.reason??-1);setFinished(next?.finished||false);setMessage('');setHint(false)}
 function reset(){setSelection(null);setMode('area');setSavedModes({});setWrongItems([]);setCompletedModes([]);setIndex(0);setPhase('shape');setChoice('');setReason(-1);setMessage('');setHint(false);setAttempts(0);setFinished(false);setCompletedAt('');setResetConfirm(false)}
 return <div className="app-shell">
 <header className="topbar"><a href="./" className="brand" aria-label="독수리수학 홈"><img src="./logo.png" alt="독수리수학"/></a><div className="course-label">피타고라스</div><button className="reset-btn" onClick={()=>setResetConfirm(true)}><RotateCcw size={15}/> 처음부터</button></header>
 <main>
 <div className="school-intro"><span>중2 · 수행평가</span><a href="./school-worksheet.pdf" target="_blank" rel="noreferrer">유인물 PDF ↗</a></div>
 <nav className="mode-tabs" aria-label="문제 선택">{(Object.keys(modeNames) as Mode[]).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>{if(m!==mode)switchMode(m)}}>{modeNames[m]}{completedModes.includes(m)?' ✓':''}</button>)}</nav>
 <div className="student-entry"><label htmlFor="student-name">이름</label><input disabled={!ready} id="student-name" maxLength={20} placeholder="인증할 이름을 입력하세요" value={studentName} onChange={e=>setStudentName(e.target.value)}/><details className="score-rules"><summary>채점 안내</summary><p>전체 {totalItems}항목을 100점으로 환산합니다. 틀린 항목 비율만큼 감점하며 같은 항목은 중복 감점하지 않습니다. 힌트는 감점이 없습니다.</p></details></div><div className="overall-progress">전체 수행 <b>{completedModes.length} / 3문제 완료</b><span>감점률 {deduction.toFixed(1)}%</span></div><div className="progress-area"><div className="progress-text"><span>{finished?'완료':'진행'}<b>{doneCount} / {steps.length}</b></span><span className="tiny">{doneCount===0?'첫 연결부터 시작해요':`${doneCount}개의 연결을 찾았어요`}</span></div><div className="progress-track" role="progressbar" aria-label="증명 완성도" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={doneCount}><div style={{width:`${doneCount/steps.length*100}%`}}/></div></div>
 {allFinished&&<section ref={certificateRef} className="certificate" aria-label="학습 완료 인증서"><div className="certificate-brand">독수리수행 · 학습 완료 인증</div><h2>중학교 2학년 피타고라스 증명</h2><div className="certificate-course">1번 넓이 증명 · 2번 닮음 증명 · 3번 넓이 구하기</div><div className="certificate-name">{studentName.trim()||'이름을 위에 입력해 주세요'}{studentName.trim()&&' 학생'}</div><div className="certificate-score">{totalScore.toFixed(1)}<span>점</span></div><div className="certificate-stats"><span>전체 수행 <b>3 / 3 완료</b></span><span>감점률 <b>{deduction.toFixed(1)}%</b></span></div><p>전체 {totalItems}개 평가 항목 중 {wrongItems.length}개 오답 · 100 − ({wrongItems.length} ÷ {totalItems} × 100) = {totalScore.toFixed(1)}점</p><time>{completedAt?new Date(completedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}):''} 완료</time><div className="certificate-instruction">이름과 점수가 보이도록 이 화면을 캡처해서 제출하세요.</div></section>}
 {finished?<section className="finish-card"><div className="finish-copy"><span className="success-icon"><CheckCircle2 size={30}/></span><div className="eyebrow">PROOF COMPLETE</div><h2>{mode==='application'?'조건을 연결해 넓이를 구했어요.':'하나씩 연결해 증명을 완성했어요.'}</h2><p>{mode==='application'?'합동, 피타고라스 정리, 직각을 차례로 활용했습니다.':'도형의 관계와 수학적 이유를 차례로 연결했습니다.'}</p><div className="big-formula">{mode==='application'?'△ABE의 넓이 = 26':'a² + b² = c²'}</div><p className="finish-detail"><MathText text={mode==='application'?'½ × AB × AE = ½ × AB² = ½ × 52 = 26':mode==='similarity'?'b² = pc, a² = qc, p + q = c이므로 a² + b² = c²입니다.':'두 작은 정사각형의 넓이의 합은 두 직사각형의 넓이의 합, 즉 큰 정사각형의 넓이와 같습니다.'}/></p>{!allFinished?<button className="primary" onClick={()=>switchMode((['area','similarity','application'] as Mode[]).find(m=>!completedModes.includes(m))!)}>다음 수행 문제 풀기<ArrowRight size={16}/></button>:<button className="primary" onClick={()=>setResetConfirm(true)}><RotateCcw size={16}/> 전체 수행 다시 풀기</button>}</div><div className="finish-visual">{mode==='area'?<><Geometry source="SQUARE_SUM" target="RECTANGLE_SUM" complete/><AreaSummary/></>:<OtherGeometry mode={mode} source={mode==='application'?'BAE':'ABC'} target=""/>}</div></section>:<section ref={learningRef} className={`learning-card phase-${phase}`}>
 <div className="diagram-panel"><div className="diagram-title"><span>{mode==='application'?'합동인 두 직각삼각형':'직각삼각형 ABC'}</span><span className="right-angle">∠C = 90°</span></div>{mode==='area'?<Geometry source={step.source} target={choice} selection={selection}/>:<OtherGeometry mode={mode} source={step.source} target={choice} guideIndex={mode==='application'?index:-1} selection={selection}/>}<div className="legend"><span><i className="source-dot"/>{mode==='application'&&index<3?'삼각형 ABC':'기준 도형'}</span><span><i className="target-dot"/>{mode==='application'&&index<3?'삼각형 EAD':'선택한 도형'}</span></div><div className={mode!=='area'?'area-pair similarity-pair':'area-pair'}><span>{mode==='area'?'넓이 증명':mode==='similarity'?'닮음 증명':'넓이 구하기'}</span><span className="area-equals">{'→'}</span><span className={choice?'':'placeholder'}>{phase==='shape'?'빈칸의 답은?':<MathText text={choice}/>}</span></div><p className="diagram-note"><MathText text={mode==='area'?'원본과 같은 세 정사각형과 보조선입니다. 사각형의 등호는 넓이가 같다는 뜻이에요.':mode==='similarity'?'AD = p, DB = q, AB = c · CD ⟂ AB':'△ABC ≡ △EAD, C·A·D는 한 직선 위에 있어요.'}/></p>{mode==='area'&&last&&phase==='done'&&<AreaSummary/>}</div>
 <div className="question-panel"><div className="step-meta"><span className="step-chip">STEP {String(index+1).padStart(2,'0')}</span><span>{step.label}</span></div><h2>{step.title}</h2>{step.worksheet&&<WorksheetBlank line={step.worksheet} expected={step.target} answer={phase==='shape'?'':choice}/>}
 {mode==='application'&&<><div className='application-help'>{index<3?'대응하는 꼭짓점  A ↔ E  ·  B ↔ A  ·  C ↔ D':''}</div><div className='proof-blank'><span className='proof-blank-label'>한 칸씩 채워 보세요</span><div><MathText text={applicationLines[index].split('□')[0]}/><AnswerSlot expected={step.target} value={phase==='shape'?'':choice}/></div></div></>}
 <div className="phase-label"><span className={phase==='shape'?'phase-number':'phase-number complete'}>{phase==='shape'?'1':<Check size={12}/>}</span>{mode==='application'?'답을 골라 보세요':mode==='similarity'?'빈칸에 들어갈 내용을 고르세요':step.worksheet?'빈칸을 채워 보세요':isFormula?'식을 고르세요':'도형을 고르세요'}{phase!=='shape'&&<span className="phase-status">확인 완료</span>}</div>
 <div className={`shape-options ${step.choices.every(option=>option.length<=18)?'compact-options':'long-options'}`} role="group" aria-label="도형 또는 식 선택">{step.choices.map((s,i)=><button key={s} aria-pressed={choice===s} className={`shape-option ${choice===s?'selected':''} ${phase!=='shape'&&s===choice?'correct':''}`} disabled={phase!=='shape'} onClick={()=>chooseAnswer(s)}><span className="option-number">{i+1}</span><span><MathText text={step.worksheet?s:shapeName(s)}/></span>{phase!=='shape'&&s===choice&&<Check size={15}/>}</button>)}</div>
 {message&&<div className={`feedback ${phase==='done'?'success':phase==='reason'&&reason===-1?'neutral':'retry'}`} role="status" aria-live="polite">{phase==='done'?<CheckCircle2 size={18}/>:<Lightbulb size={18}/>}<span><MathText text={message}/></span></div>}
 {hint&&<div className="hint-box" role="status"><b>생각의 실마리</b><p><MathText text={step.hint}/></p></div>}
 <div className="actions"><button className="hint-btn" aria-expanded={hint} onClick={()=>setHint(v=>!v)}><Lightbulb size={16}/>{hint?'힌트 닫기':'힌트 보기'}</button><span className="quick-guide">{phase==='done'?'다음 빈칸으로 넘어가요':'답을 누르면 바로 채점해요'}</span></div>
 </div></section>}
 <details className="proof-map"><summary>유인물 풀이 모아보기 · {doneCount} / {steps.length}</summary><div className="worksheet-review">{steps.map((item,i)=><div key={i} className={doneCount>i?'review-done':'review-locked'}><b>{i+1}. {item.label}</b><p><MathText text={doneCount>i?item.explain:'이 단계를 완료하면 풀이가 나타납니다.'}/></p></div>)}</div></details>
 {allFinished&&<details className="proof-map model-answer"><summary>서술형 모범 답안 보기</summary><div className="worksheet-review"><h3>1. 넓이를 이용한 증명</h3><p><MathText text='△ACE와 △ABE는 밑변 AE가 공통이고 AE ∥ CB이므로 높이가 같아 넓이가 같다. AE = AC, AB = AF이고 ∠EAB = ∠CAF = 90° + ∠CAB이므로 △ABE ≡ △AFC (SAS 합동)이다. △AFC와 △AFL은 밑변 AF가 공통이고 AF ∥ CM이므로 높이가 같아 넓이가 같다. 따라서 △ACE와 △AFL의 넓이가 같다. 두 삼각형의 두 배인 정사각형 ACDE와 직사각형 AFML의 넓이도 같다. 같은 방법으로 정사각형 BHIC와 직사각형 LBGM의 넓이도 같다. 그러므로 정사각형 AFGB의 넓이 = 정사각형 ACDE의 넓이 + 정사각형 BHIC의 넓이이므로 c² = b² + a²이다.'/></p><h3>2. 닮음을 이용한 증명</h3><p><MathText text='∠ACB = ∠ADC = 90°이고 ∠BAC = ∠CAD이므로 △ABC ∽ △ACD (AA 닮음)이다. AC : AD = AB : AC에서 b : p = c : b이므로 b² = pc이다. 같은 방법으로 △ABC ∽ △CBD이므로 BC : BD = BA : BC에서 a : q = c : a, a² = qc이다. p + q = c이므로 a² + b² = pc + qc = (p + q)c = c²이다.'/></p><h3>3. 넓이 구하기</h3><p><MathText text='합동인 두 삼각형의 대응변이므로 AB = AE이다. 피타고라스 정리에 의해 AB² = 4² + 6² = 52이다. ∠BAC + ∠ABC = 90°이고 ∠ABC = ∠EAD이므로 ∠BAC + ∠EAD = 90°이다. C, A, D가 한 직선 위에 있으므로 ∠BAE = 180° − 90° = 90°이다. 따라서 △ABE의 넓이 = ½ × AB × AE = ½ × AB² = ½ × 52 = 26이다.'/></p></div></details>}
 <footer><span>독수리수학 <span className="footer-divider">·</span> 배곧중학교 수행평가 대비</span><span>한 칸씩, 바로바로 풀기</span></footer>
 </main>
 {resetConfirm&&<div className="modal-backdrop" role="presentation"><div className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">처음부터 다시 해볼까요?</h2><p>1~3번 전체 진행 기록과 점수가 초기화됩니다.</p><div><button className="secondary" onClick={()=>setResetConfirm(false)}>계속 풀기</button><button className="primary" onClick={reset}>처음부터 시작</button></div></div></div>}
 </div>
}
