import fs from 'fs'
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
    buildEnd: (site: SiteConfig)=>{
        //cloudflare d1数据库接口
        if(fs.existsSync('./_worker.js'))
            fs.copyFileSync('./_worker.js', site.outDir + '/_worker.js')
    }
})