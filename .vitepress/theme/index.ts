import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './components/Layout.vue'
import Home from './components/Home.vue'
import Archive from './components/Archive.vue'
import Category from './components/Category.vue'
import Tags from './components/Tags.vue'

export default {
    ...DefaultTheme,
    Layout: Layout,
    enhanceApp({ app }) {
        // register global compoment
        app.component('Home', Home)
        app.component('Archive', Archive)
        app.component('Category', Category)
        app.component('Tags', Tags)
    }
} satisfies Theme