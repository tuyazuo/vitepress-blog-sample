<style scoped>
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
<style>
/** 增宽页面内容 */
@media (min-width: 960px) {
    .VPDoc:not(.has-sidebar) .content {
        max-width: inherit !important;
    }
    .VPDoc:not(.has-sidebar) .container{
        max-width: calc(var(--vp-layout-max-width) - 264px) !important;
    }
    .VPDoc.has-aside .content-container{
        max-width: inherit !important;
    }
    /** 用于分类、标签等显示在右侧aside */
    .VPDocAsideOutline{
        display: block !important;
    }
}
</style>

<template>
    <Layout>
        <template #doc-before>
            <div v-if="frontmatter.date" class="post-tag">
                <a :href="withBase(`/pages/archive.html?tag=${frontmatter.date?.substring(0, 7)}`)">
                    {{ frontmatter.date.substring(0, 10) }}
                </a>
                <a :href="withBase(`/pages/category.html?tag=${encodeURIComponent(frontmatter.category)}`)">
                    <span>{{ frontmatter.category }}</span>
                </a>
                <a :href="withBase(`/pages/tags.html?tag=${encodeURIComponent(tag)}`)" v-for="tag in frontmatter.tags">
                    <span>{{ tag }}</span>
                </a>
            </div>

            <Home v-if="frontmatter?.index" />
        </template>

        <template #doc-after>
            <Comment v-if="frontmatter.date" />
        </template>
    </Layout>
</template>

<script setup lang="ts">
import Comment from './Comment.vue'
import { useData, withBase } from 'vitepress';
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
const { frontmatter } = useData();
</script>