import type { Server, Opts, NakedOpts } from "./server.ts"

export interface SSROpts extends Opts {
}
export default class SSR implements Server<SSROpts> {
    async serve(request: Request, opts?: SSROpts, naked_opts: NakedOpts = {}): Promise<Response> {
        throw new Error("Method not implemented.")
    }
} 
