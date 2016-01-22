
function summ(TOTAL){
  TOTAL--;
  if(TOTAL>0)
		return TOTAL + summ(TOTAL);
  return 0;  
}



function meth1(TOTAL,only){
o=''
if(only){
  i = TOTAL-1
  o += `(${i+1}) ${i} `  
  o1 = 0
  o1a=[]
  for (var i1 = 0; i1 <= i; i1++) {
    o1 += i1
	  o1a.push(i1)
  }  
 	o += `${o1}=${(o1a.join('+'))}`
	return o
}
  
for (var i = 0; i < TOTAL; i++) {
  o += `(${i+1}) ${i}; ` 
  o1 = 0
  o1a=[]
  for (var i1 = 0; i1 <= i; i1++) {
    o1 += i1
	  o1a.push(i1)
  }  
  L = o1*2
  //o +=`:: ${(Math.sqrt(L)|0)} ${(i*(i+1)/2)} >| ${(L)} || ${L/2} |< ${(Math.sqrt(1))} | `
  //o += `>|${o1}| ${(o1*2)} |< ${((o1/(o1/2+1)))} | ${(Math.sqrt(o1*3))} | `
	o += `${o1}=${(o1a.join('+'))} \n`
  o +='\n';
}
return o 
}

var T = 28;
[meth1(T,1),`TOTAL = ${T}`,meth1(T,0),summ(T), T*(T-1)/2 ].join('\n//---\n')


