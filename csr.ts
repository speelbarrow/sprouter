import { watch } from "fs/promises"
import type { Server, Opts, NakedOpts } from "./server.ts"
import { Glob, GlobScanOptions } from "bun"
import type { WatchOptions } from "fs"
import type { BuildConfig } from "bun"

export interface CSROpts extends Opts {}
export default class CSR implements Server<CSROpts> {
    private root: string
    private naked_opts: NakedOpts
    private builderRef?: Promise<void>

    /**
     * # Naked options:
     *
     * *To make use of the following configuration options, use the specified functions as string keys (e.g. 
     * `Glob.toString()`) and set the value to match the type described below. Anything preceding a `#` is the name
     * of the package in which the function reference/type definition can be found.*
     *
     * - {@link watch `fs/promises#watch`}: {@link WatchOptions `fs#WatchOptions`} 
     *   Relates to how/what files are `watch`ed for changes to trigger a rebuild
     *
     * - {@link Glob `bun#Glob`}: `string`
     *   Filters which files are used as entrypoints for the build
     *
     * - {@link Glob.scan `bun#Glob.prototype.scan`}: `string |`{@link GlobScanOptions `bun#GlobScanOptions`}
     *   Configures the scanning behaviour of the entrypoint glob
     *
     * - {@link Bun.build `Bun.build`}: {@link BuildConfig `bun#BuildConfig`}
     *   Configuration for the build
     *
     * ### Conflicts:
     * If the `entrypoints` option is specified in the configuration for `Bun.build`, it will override the `Glob`
     * behaviour and thus the `Glob` options will be ignored.
     */
    constructor(root: string, naked_opts: NakedOpts = {}) {
        // Store the `root` and `naked_opts`
        this.root = root
        this.naked_opts = naked_opts

        // Run the build manually once, then start the `builder` process
        this.build()
        .then(() => this.builderRef = this.builder())
    }

    private async builder() {
        // Watch the directory forever
        for await (const event of watch(this.root, {
            ...{ recursive: true },
            ...(this.naked_opts[watch.toString()] ?? {}) 
        })) {
            // Only re-build if files have actually been modified
            if (event.eventType === "change" || event.eventType === "rename") {
                await this.build()
            }
        }
    }

    private building: boolean = false
    private async build() {
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
                    new Glob(this.naked_opts[Glob.toString()] ?? "**/index.{html,js,jsx,ts,tsx}")
                            .scan(this.naked_opts[Glob.prototype.scan.toString()] ?? this.root)
                ),
                outdir: this.root + "/../build"
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
