import { SiteConfig, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Hanyi's blog",
    description: "记录一些知识",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: 'local'
        },
        outline:{
            label:'导览'
        },
        nav: [
            { text: '主页', link: '/' },
            { text: '归档', link: '/pages/archive' },
            { text: '分类', link: '/pages/category' },
            { text: '标签', link: '/pages/tags' },
            { text: '关于', link: '/pages/about' },
        ],
    },
})