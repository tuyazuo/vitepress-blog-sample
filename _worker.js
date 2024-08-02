export default {
    async fetch(request, env) {
        if(request.method == 'POST'){
            const url = new URL(request.url);
            if (url.pathname.startsWith('/api/')) {
                const name = url.pathname.substring(url.pathname.indexOf('/api/') + 5)
                if(name == 'get_comment'){
                    const {url, pageNum} = await request.json()
                    if(!url || !pageNum || pageNum < 1) return;
                    const stmt = env.DB.prepare(`SELECT id,nick,body,time FROM comment WHERE url='${url}' ORDER BY time DESC LIMIT ${(pageNum-1)*20},20`);
                    const { results } = await stmt.all();
                    return new Response(JSON.stringify(results))
                }
                else if(name == 'add_comment'){
                    const {url, nick, email, body, site} = await request.json()
                    if(!url || !nick || !email || !body) return new Response();
                    const sql = env.DB.prepare(`INSERT INTO comment (url,nick,email,body,site,time) VALUES (?,?,?,?,?,?)`)
                    const time = Math.floor(new Date().getTime() / 1000)
                    const { success, meta } = await sql.bind(url, nick, email, body, site, time).run();
                    if(!success) return new Response();
                    return new Response(JSON.stringify({
                        id: meta.last_row_id,
                        nick: nick,
                        body: body,
                        time: time
                    }))
                }
            }
        }
        // Otherwise, serve the static assets.
        // Without this, the Worker will error and no assets will be served.
        return env.ASSETS.fetch(request);
    },
}