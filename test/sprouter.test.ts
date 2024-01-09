import { test, expect } from "bun:test"
import { type Server, type Opts, CSR, SSR } from ".."

const ASSETS = import.meta.dir + "/assets"

for (const server of [new CSR(ASSETS), new SSR()] as Server<Opts>[]) {
    for (const [route, path] of [
        ["", "files/index.html"],
        ["/", "files/index.html"],
        ["/index.html", "files/index.html"],
        ["/index.htm", "files/index.html"],
        ["/index", "files/index.html"],
        ["/named", "files/named.html"],
        ["/named/", "files/named.html"],
        ["/index.css", "files/index.css"],
    ]) {
        test(route, async () => {
            const response = await server.serve(new Request("http://localhost:3000" + route))
            expect(response.ok).toBeTrue()
            expect(await response.text()).toBe(await Bun.file(`${ASSETS}/${path}`).text())
        })
    }
}
