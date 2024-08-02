<style scoped>
@import url(../custom.css);
.input{
    padding: 5px 8px;
    border-radius: 5px;
    background-color: var(--vp-code-block-bg);
    font-family: inherit;
}
.ta{
    width: 100%;
    min-height: 65px;
    line-height: 1.35em;
}
.info{
    display: flex;
    justify-content: space-between;
}
.info input{
    margin-right: 10px;
    margin-bottom: 5px;
}
.bt{
    min-width: 70px;
}
.error{
    border: 1px solid red;
}

.msg{
    margin-top: 10px;
}
.nick{
    font-size: 0.95em;
}
.body{
    margin-left: 20px;
    color: var(--vp-c-text-2);
    font-size: 0.85em;
    line-height: 1.3em;
}
</style>

<template>
    <textarea v-model="body" :class="{error: type == 1}" class="input ta" placeholder="留下见解，限120字" />
    <div class="info">
        <div>
            <input v-model="nick" maxlength="12" :class="{error: type == 2}" class="input" placeholder="昵称">
            <input v-model="email" maxlength="35" :class="{error: type == 3}" class="input" placeholder="邮箱">
            <input v-model="site" maxlength="35" :class="{error: type == 4}" class="input" placeholder="网站 选填">
        </div>
        <button class="input bt" @click="send">发送</button>
    </div>

    <div class="msg" v-for="item in list" :key="item.id">
        <div class="nick">{{ item.nick + '  ·  ' + fmtTime(item.time) }}</div>
        <div class="body">{{ item.body }}</div>
    </div>

    <div class="more" v-show="showMore" @click="onClickMore">更多</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useData } from 'vitepress';
const { page } = useData();
const url = page.value.relativePath.substring(page.value.relativePath.indexOf('/') + 1).replace('.md', '')

const json = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('private_comment_msg') || '{}') : {}
const type = ref(0)
const body = ref('')
const nick = ref(json.nick || '')
const email = ref(json.email || '')
const site = ref(json.site || '')
const list: Ref<Array<{id: number, nick: string, body: string, time: number}>> = ref([])

function send(){
    if(!body.value.trim() || body.value.length > 150){
        type.value = 1
        return
    }
    else if(!nick.value.trim() || nick.value.length > 12){
        type.value = 2
        return
    }
    else if(!email.value || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))){
        type.value = 3
        return
    }
    else if(site.value && !(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(site.value))){
        type.value = 4
        return
    }
    type.value = 0
    post('/api/add_comment', {url:url, nick:nick.value, email:email.value, body:body.value, site:site.value}, ret=>{
        if(!ret || !ret['id'] || !ret['nick']) return;
        if (typeof localStorage !== 'undefined')
            localStorage.setItem('private_comment_msg', JSON.stringify({nick:nick.value, email:email.value, site:site.value}));
        list.value.unshift(ret)
        body.value = ''
    })
}

const pageNum = ref(1)
const showMore = ref(false)
onMounted(getComment)

function getComment(){
    if(process.env.NODE_ENV !== 'development'){
        post('/api/get_comment', {url: url, pageNum: pageNum.value}, ret=>{
            if(!ret || !ret[0] || !ret[0].id) {
                showMore.value = false
                return;
            }
            showMore.value = ret.length == 20;
            list.value = list.value.concat(ret)
        })
    }
}

function onClickMore(){
    pageNum.value += 1
    getComment()
}

function fmtTime(time: number){
    const date = new Date(time*1000)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

async function post(url: string, data?: object, callOk?: (ret: any)=>void) {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }).then((r) => {
        if(r.status === 200) return r.json();
        console.error(r)
    }).then(r=>{
        if(!r) return;
        callOk?.(r)
        return r
    }).catch((error) => {
        console.error('>>>>>> http post catch:', url, error)
    })
}
</script>