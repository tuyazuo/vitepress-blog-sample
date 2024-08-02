<style scoped>
@import url(../custom.css);

.post-list{
    display: flex;
    flex-direction: column;
    padding: 14px 0;
}
.post-title {
    margin-bottom: 0.5rem;
    font-size: 1.15em;
    font-weight: 600;
}
.post-desc{
    font-size: 0.92em;
    color: var(--vp-c-text-2);
}
.post-tag{
    margin-top: 0.5rem;
    display: flex;
    flex-direction: row;
    font-size: 0.8em;
    color: var(--vp-c-text-2);
}
.post-tag span {
    display: inline-block;
    padding: 0 8px;
    background-color: var(--vp-c-bg-alt);
    margin-left: 10px;
    border-radius: 2px;
}
</style>

<template>
    <div v-for="item, index in posts" :key="index" class="post-list">
        <a class="post-title" :href="withBase(item.url)">{{ item.frontmatter.title }}</a>
        <div class="post-desc" v-html="item.excerpt" />
        <div v-if="item.frontmatter.date" class="post-tag">
            <a :href="withBase(`/pages/archive.html?tag=${item.frontmatter.date.substring(0, 7)}`)">
                {{ item.frontmatter.date.substring(0, 10) }}
            </a>
            <a :href="withBase(`/pages/category.html?tag=${encodeURIComponent(item.frontmatter.category)}`)">
                <span>{{ item.frontmatter.category }}</span>
            </a>
            <a :href="withBase(`/pages/tags.html?tag=${encodeURIComponent(tag)}`)" v-for="tag in item.frontmatter.tags">
                <span>{{ tag }}</span>
            </a>
        </div>
    </div>

    <div class="more" v-show="posts.length < count" @click="onClickMore">更多</div>
</template>

<script setup lang="ts">
import {data} from '../posts.data'
import { onMounted, ref, computed, nextTick } from 'vue';
import { withBase } from 'vitepress'

const count = data.length
const pageSize = 20
const pageNum = ref(1)

const posts = computed(()=>{
    const cnt = pageSize * pageNum.value
    return data.slice(0, cnt > count ? count : cnt)
})

function onClickMore(){
    pageNum.value++
}

onMounted(() => {
    const element = document.querySelector('.VPLocalNav')
    //@ts-ignore 窄屏时页面会出现导览
    if(element) element.style.display = 'none';
})
</script>