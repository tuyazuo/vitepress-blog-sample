<style scoped>
@import url(../custom.css);
</style>

<template>
    <div v-for="(list, key) in dic">
        <div class="filter-tag">
            {{ key }}
        </div>
        <a v-for="item, index in list" :key="index" :href="withBase(item.url)" class="filter-title">
            {{ item.frontmatter.title }}
            <div class="date">{{ item.frontmatter.date?.substring(0, 10) }}</div>
        </a>
    </div>

    <div class="more" v-show="hasCount < (tags[tag] || count)" @click="onClickMore">更多</div>

    <Teleport to=".VPDocOutlineItem" v-if="tick">
        <li @click="onClick('')" class="filter-side">全部&nbsp;{{ count }}</li>
        <li v-for="(cnt, key) in tags" @click="onClick(key)" class="filter-side">
            {{ key }} &nbsp; {{ cnt }}
        </li>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { IPost, data } from '../posts.data'
import { useData, withBase } from 'vitepress'

const count = data.length
const pageSize = 20
const pageNum = ref(1)
const hasCount = ref(pageSize*pageNum.value)

const tags: Record<string, number> = {}
for (let index = 0; index < count; index++) {
    const item = data[index]
    let date = item.frontmatter.date
    if(!date) continue;
    date = date.substring(0, 7)
    if(!tags[date]) tags[date] = 1;
    else tags[date]++;
}

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.href.split('?')[1] : '')
const tag = ref(params.get('tag') || '')
const dic = computed(()=>{
    let cnt = pageSize * pageNum.value
    cnt = cnt > count ? count : cnt
    const tmp: Record<string, IPost[]> = {}
    let has = 0
    for (let index = 0; index < count; index++) {
        const item = data[index]
        let date = item.frontmatter.date
        if(!date) continue;
        date = date.substring(0, 7)
        if(tag.value == '' || tag.value == date){
            if(!tmp[date]) tmp[date] = [];
            tmp[date].push(item)
            has++

            if(has == cnt) break;
        }
    }
    hasCount.value = has
    return tmp
})

const tick = ref(false)
nextTick(()=>{
    tick.value = true
})

function onClick(param: string){
    tag.value = param
}

function onClickMore(){
    pageNum.value++
}
</script>