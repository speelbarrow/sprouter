import { watch } from "fs/promises"
import type { Server, Opts, NakedOpts } from "./server.ts"
import { Glob } from "bun"
import type { WatchOptions } from "fs"
import type { BuildConfig } from "bun"

export interface CSROpts extends Opts {

}
export default class CSR implements Server<CSROpts> {
    private naked_opts: NakedOpts
    private builderRef?: Promise<void>

    /**
     * Naked options:
     * - {@link watch `fs/promises.watch`}: {@link WatchOptions `fs.WatchOptions`} 
     *   Relates to how/what files are `watch`ed for changes to trigger a rebuild
     *
     * - {@link Glob `bun.Glob`}: `string`
     *   Filters which files are used as entrypoints for the build
     *
     * - {@link Bun.build `Bun.build`}: {@link BuildConfig `bun.BuildConfig`}
     *   Configuration for the build
     */
    constructor(root: string, naked_opts: NakedOpts = {}) {
        // Store the naked options
        this.naked_opts = naked_opts

        // Run the build manually once, then start the `builder` process
        this.build(root)
            .then(() => this.builderRef = this.builder(root))
    }

    private async builder(root: string) {
        // Watch the directory forever
        for await (const event of watch(root, {
            ...{ recursive: true },
            ...(this.naked_opts[watch.toString()] ?? {}) 
        })) {
            // Only re-build if files have actually been modified
            if (event.eventType === "change" || event.eventType === "rename") {
                await this.build(root)
            }
        }
    }

    private building: boolean = false
    private async build(root: string) {
        // If a build is already in progress, exit
        if (this.building)
            return

        // Set the `building` flag to prevent serving while building (and to prevent multiple builds)
        else 
            this.building = true
        
        // Build the project
        Bun.build({
            ...{
                entrypoints: await Array.fromAsync(
                    new Glob(this.naked_opts[Glob.toString()] ?? "**/index.{html,js,jsx,ts,tsx}").scan(root)
                ),
                outdir: root + "/../build"
            },
            ...(this.naked_opts[Bun.build.toString()] ?? {})
        })

        // Unset the `building` flag now that the build is complete
        this.building = false
    }

    async serve(request: Request, opts?: CSROpts, naked_opts: NakedOpts = {}): Promise<Response> {
        throw new Error("Method not implemented.")
    }
}
